"use client"

import { useSendTransaction } from "wagmi"
import { buildForecastTransaction } from "@/lib/forecast-transaction"

export type ForecastSubmissionResult = {
  txHash: `0x${string}`
}

/**
 * Wraps wagmi's `useSendTransaction` so a component can dispatch a forecast
 * with a single call. This is the only place a transaction is signed and
 * sent - always by the connected wallet, never a backend key. It resolves as
 * soon as the wallet returns the transaction hash; the caller can then wait
 * for confirmation separately.
 */
export function useForecastSubmission() {
  const { sendTransactionAsync, isPending, isSuccess, isError, error, reset } = useSendTransaction()

  async function submitForecast(params: {
    marketId: string
    probability: number
  }): Promise<ForecastSubmissionResult> {
    const { to, value, data } = buildForecastTransaction(params)
    const txHash = await sendTransactionAsync({ to, value, data })
    return { txHash }
  }

  return {
    submitForecast,
    isRunning: isPending,
    isSuccess,
    isError,
    error,
    reset,
  }
}
