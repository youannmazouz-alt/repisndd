import { address as toAddress } from "@solana/kit"
import { getInferConfig, type InferConfig } from "@/lib/env"
import { getServerRpc } from "@/lib/solana-server"
import { parseForecastMemo } from "@/lib/forecast-parser"
import { getMarket } from "@/lib/markets"
import type { Forecast } from "@/types/forecast"

const SIGNATURE_LIMIT = 500
const CACHE_TTL_MS = 15_000

type IndexCache = { forecasts: Forecast[]; fetchedAt: number }

// Module-level cache. Serverless-friendly: cheap, per-instance, short TTL,
// never permanent. `forceRefresh` bypasses it explicitly.
let cache: IndexCache | null = null

/**
 * Minimal shape of a `jsonParsed` transaction instruction, covering only the
 * fields this parser reads. Solana's RPC returns much more, but we only
 * trust what we explicitly validate.
 */
type JsonParsedInstruction = {
  program?: string
  parsed?:
    | string
    | {
        type?: string
        info?: {
          authority?: string
          destination?: string
          mint?: string
          amount?: string
          tokenAmount?: { amount: string; decimals: number; uiAmount: number | null }
        }
      }
}

type JsonParsedTransaction = {
  blockTime?: number | null
  transaction?: {
    message?: {
      instructions?: JsonParsedInstruction[]
    }
  }
}

/**
 * Validates and extracts a Forecast from a single transaction. Only
 * considers a forecast valid if the SAME transaction contains:
 *   1. the correct $INFER mint (when the transfer instruction reports one)
 *   2. the configured treasury token account as destination
 *   3. a token transfer >= the configured forecast cost
 *   4. a valid INFER memo
 *   5. a valid, known market id
 *   6. a probability between 1 and 99
 *   7. the transferring wallet as the forecast author
 */
export function parseForecastFromTransaction(
  tx: JsonParsedTransaction,
  signature: string,
  slot: number,
  config: InferConfig,
): Forecast | null {
  if (!tx.blockTime) return null

  const instructions = tx.transaction?.message?.instructions ?? []

  let transferAuthority: string | null = null
  let amountCommitted: number | null = null
  let memoText: string | null = null

  for (const ix of instructions) {
    if (ix.program === "spl-token" && ix.parsed && typeof ix.parsed === "object") {
      const type = ix.parsed.type
      const info = ix.parsed.info
      if ((type === "transferChecked" || type === "transfer") && info) {
        if (info.destination !== config.treasuryTokenAccount) continue
        if (info.mint && info.mint !== config.mint) continue

        let amount: number
        if (info.tokenAmount) {
          amount =
            info.tokenAmount.uiAmount ?? Number(info.tokenAmount.amount) / 10 ** info.tokenAmount.decimals
        } else if (info.amount) {
          amount = Number(info.amount) / 10 ** config.decimals
        } else {
          continue
        }

        if (amount < config.forecastCost) continue
        if (!info.authority) continue

        transferAuthority = info.authority
        amountCommitted = amount
      }
    }

    if (ix.program === "spl-memo" && typeof ix.parsed === "string") {
      memoText = ix.parsed
    }
  }

  if (!transferAuthority || amountCommitted === null || !memoText) return null

  const parsedMemo = parseForecastMemo(memoText)
  if (!parsedMemo) return null
  if (!getMarket(parsedMemo.marketId)) return null

  return {
    signature,
    marketId: parsedMemo.marketId,
    wallet: transferAuthority,
    probability: parsedMemo.probability,
    amountCommitted,
    timestamp: tx.blockTime * 1000,
    slot,
  }
}

/**
 * Indexes the treasury token account's transaction history from Solana and
 * returns every valid forecast, across all markets. Backed by a short-lived
 * cache so a page load never re-downloads the entire history.
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

  const rpc = getServerRpc()
  if (!rpc) {
    return { forecasts: [], cached: false, fetchedAt: now }
  }

  const treasuryAddress = toAddress(config.treasuryTokenAccount)
  const signatures = await rpc.getSignaturesForAddress(treasuryAddress, { limit: SIGNATURE_LIMIT }).send()

  const forecasts: Forecast[] = []

  for (const sigInfo of signatures) {
    if (sigInfo.err) continue // skip failed transactions

    try {
      const tx = await rpc
        .getTransaction(sigInfo.signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 })
        .send()
      if (!tx) continue

      const forecast = parseForecastFromTransaction(
        tx as unknown as JsonParsedTransaction,
        sigInfo.signature,
        Number(sigInfo.slot),
        config,
      )
      if (forecast) forecasts.push(forecast)
    } catch {
      // Malformed or unavailable transaction - ignore and continue indexing.
      continue
    }
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
