"use client"

import { useSendTransaction } from "@solana/react"
import type { InferClient } from "@/lib/solana-client"
import { buildForecastInstructions } from "@/lib/forecast-transaction"
import type { WalletSigner } from "@solana/kit-plugin-wallet"

export type ForecastSubmissionResult = {
  signature: string
}

/**
 * Wraps the connected wallet's `sendTransaction` action so a component can
 * dispatch a forecast with a single call. This is the only place a
 * transaction is signed and sent - always by the connected wallet, never a
 * backend key.
 */
export function useForecastSubmission(client: InferClient) {
  const action = useSendTransaction(client)

  async function submitForecast(params: { signer: WalletSigner; marketId: string; probability: number }) {
    const instructions = await buildForecastInstructions(params)
    const result = await action.dispatchAsync(instructions)
    return { signature: result.context.signature } satisfies ForecastSubmissionResult
  }

  return {
    submitForecast,
    isRunning: action.isRunning,
    isSuccess: action.isSuccess,
    isError: action.isError,
    error: action.error,
    reset: action.reset,
  }
}
