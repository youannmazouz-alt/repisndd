import { parseEther, stringToHex, type Hex } from "viem"
import { getInferConfig } from "@/lib/env"
import { buildForecastMemo } from "@/lib/forecast-parser"

export type ForecastTransactionRequest = {
  to: `0x${string}`
  value: bigint
  data: Hex
}

/**
 * Builds the single EVM transaction that makes up a forecast on Robinhood
 * Chain:
 *
 *   - a native-token transfer of the configured forecast cost to the
 *     treasury address, and
 *   - the structured memo `INFER|v1|market=<id>|p=<probability>` encoded as
 *     UTF-8 bytes in the transaction's calldata (`data`).
 *
 * The value and the memo travel together in ONE transaction so the indexer
 * can validate commitment and claim as a pair. This function never signs or
 * sends anything - the connected wallet does that.
 */
export function buildForecastTransaction(params: {
  marketId: string
  probability: number
}): ForecastTransactionRequest {
  const config = getInferConfig()
  if (!config) {
    throw new Error("INFER is not configured. Add the treasury environment variables.")
  }

  const { marketId, probability } = params
  if (!Number.isInteger(probability) || probability < 1 || probability > 99) {
    throw new Error("Probability must be an integer between 1 and 99.")
  }

  return {
    to: config.treasury,
    value: parseEther(String(config.forecastCost)),
    data: stringToHex(buildForecastMemo(marketId, probability)),
  }
}
