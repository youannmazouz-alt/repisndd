import { hexToString, parseEther, type Hex } from "viem"
import { getInferConfig, type InferConfig } from "@/lib/env"
import { parseForecastMemo } from "@/lib/forecast-parser"
import { getMarket } from "@/lib/markets"
import type { Forecast } from "@/types/forecast"

const TX_LIMIT = 500
const CACHE_TTL_MS = 15_000

type IndexCache = { forecasts: Forecast[]; fetchedAt: number }

// Module-level cache. Serverless-friendly: cheap, per-instance, short TTL,
// never permanent. `forceRefresh` bypasses it explicitly.
let cache: IndexCache | null = null

/**
 * Minimal shape of a Blockscout/Etherscan-style `txlist` result row,
 * covering only the fields this parser reads. The explorer returns much
 * more, but we only trust what we explicitly validate.
 */
type ExplorerTx = {
  hash?: string
  from?: string
  to?: string
  value?: string
  input?: string
  timeStamp?: string
  blockNumber?: string
  isError?: string
  txreceipt_status?: string
}

function decodeMemo(input: string | undefined): string | null {
  if (!input || input === "0x" || input.length < 4) return null
  try {
    return hexToString(input as Hex)
  } catch {
    return null
  }
}

/**
 * Validates and extracts a Forecast from a single explorer transaction.
 * Only considers a forecast valid if the transaction:
 *   1. was sent TO the configured treasury address
 *   2. succeeded on-chain (no error / receipt status ok)
 *   3. transferred native value >= the configured forecast cost
 *   4. carries a valid INFER memo in its calldata
 *   5. references a valid, known market id
 *   6. states a probability between 1 and 99
 * The sending address (`from`) is recorded as the forecast author.
 */
export function parseForecastFromTx(tx: ExplorerTx, config: InferConfig): Forecast | null {
  if (!tx.hash || !tx.from || !tx.to || !tx.timeStamp) return null
  if (tx.to.toLowerCase() !== config.treasury.toLowerCase()) return null
  if (tx.isError === "1") return null
  if (tx.txreceipt_status !== undefined && tx.txreceipt_status === "0") return null

  let value: bigint
  try {
    value = BigInt(tx.value ?? "0")
  } catch {
    return null
  }

  const costWei = parseEther(String(config.forecastCost))
  if (value < costWei) return null

  const memoText = decodeMemo(tx.input)
  if (!memoText) return null

  const parsedMemo = parseForecastMemo(memoText)
  if (!parsedMemo) return null
  if (!getMarket(parsedMemo.marketId)) return null

  const timestampSec = Number(tx.timeStamp)
  if (!Number.isFinite(timestampSec)) return null

  return {
    txHash: tx.hash,
    marketId: parsedMemo.marketId,
    wallet: tx.from,
    probability: parsedMemo.probability,
    amountCommitted: Number(value) / 10 ** config.decimals,
    timestamp: timestampSec * 1000,
    blockNumber: Number(tx.blockNumber ?? 0),
  }
}

async function fetchTreasuryTransactions(config: InferConfig): Promise<ExplorerTx[]> {
  const url =
    `${config.explorerApiUrl}?module=account&action=txlist` +
    `&address=${config.treasury}&sort=desc&page=1&offset=${TX_LIMIT}`

  const res = await fetch(url, {
    headers: { accept: "application/json" },
    // Server route already forces dynamic; keep the fetch itself uncached.
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Explorer request failed with status ${res.status}`)
  }

  const json = (await res.json()) as { status?: string; message?: string; result?: unknown }

  // Blockscout returns status "0" with message "No transactions found" for an
  // empty history - that is a normal empty result, not an error.
  if (!Array.isArray(json.result)) {
    if (json.message && /no transactions found/i.test(json.message)) return []
    throw new Error(json.message ?? "Explorer returned an unexpected response")
  }

  return json.result as ExplorerTx[]
}

/**
 * Indexes the treasury address's transaction history from the chain's block
 * explorer and returns every valid forecast, across all markets. Backed by
 * a short-lived cache so a page load never re-downloads the entire history.
 */
export async function getAllValidForecasts(opts?: {
  forceRefresh?: boolean
}): Promise<{ forecasts: Forecast[]; cached: boolean; fetchedAt: number }> {
  const config = getInferConfig()
  const now = Date.now()

  if (!config) {
    return { forecasts: [], cached: false, fetchedAt: now }
  }

  if (!opts?.forceRefresh && cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { forecasts: cache.forecasts, cached: true, fetchedAt: cache.fetchedAt }
  }

  const transactions = await fetchTreasuryTransactions(config)

  const forecasts: Forecast[] = []
  for (const tx of transactions) {
    const forecast = parseForecastFromTx(tx, config)
    if (forecast) forecasts.push(forecast)
  }

  cache = { forecasts, fetchedAt: Date.now() }
  return { forecasts, cached: false, fetchedAt: cache.fetchedAt }
}

export async function getValidForecastsForMarket(
  marketId: string,
  opts?: { forceRefresh?: boolean },
): Promise<{ forecasts: Forecast[]; cached: boolean; fetchedAt: number }> {
  const { forecasts, cached, fetchedAt } = await getAllValidForecasts(opts)
  return { forecasts: forecasts.filter((f) => f.marketId === marketId), cached, fetchedAt }
}
