"use client"

import { useState } from "react"
import { useConfig } from "wagmi"
import { waitForTransactionReceipt } from "wagmi/actions"
import { ProbabilitySlider } from "@/components/probability-slider"
import { InferButton } from "@/components/infer-button"
import { TransactionResult, type ForecastTxState } from "@/components/transaction-result"
import { useInferWallet } from "@/lib/use-wallet-connection"
import { useInferBalance } from "@/hooks/use-infer-balance"
import { useForecastSubmission } from "@/hooks/use-forecast-submission"
import { WalletButton } from "@/components/wallet-button"
import { getInferConfig } from "@/lib/env"
import { formatInfer } from "@/lib/format"
import type { Market } from "@/types/market"
import type { Forecast } from "@/types/forecast"

/**
 * The primary interaction of the whole application: pick a probability,
 * commit the forecast cost, and record both in one signed Robinhood Chain
 * transaction (a native-value transfer whose calldata carries the memo).
 */
export function ForecastForm({
  market,
  existingForecast,
  onSubmitted,
}: {
  market: Market
  existingForecast?: Forecast
  onSubmitted?: () => void
}) {
  const config = getInferConfig()
  const { address, isConnected, isReady } = useInferWallet()

  if (!config) {
    return (
      <div className="border border-border bg-secondary/40 p-4">
        <p className="text-sm text-muted-foreground">
          INFER is not configured. Add the Robinhood Chain environment variables.
        </p>
      </div>
    )
  }

  if (market.status !== "open") {
    return (
      <div className="border border-border bg-secondary/40 p-4">
        <p className="text-sm text-muted-foreground">
          This question is {market.status}. New forecasts can no longer be submitted.
        </p>
      </div>
    )
  }

  if (!isReady) {
    return <p className="font-mono text-sm text-muted-foreground">reading wallet...</p>
  }

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-start gap-3 border border-border bg-secondary/40 p-4">
        <p className="text-sm text-muted-foreground">Connect an EVM wallet to submit a forecast.</p>
        <WalletButton />
      </div>
    )
  }

  // Re-keying on the connected address resets all local form state
  // (probability, tx status) whenever the active wallet account changes.
  return (
    <ConnectedForecastForm
      key={address}
      market={market}
      existingForecast={existingForecast}
      forecastCost={config.forecastCost}
      onSubmitted={onSubmitted}
    />
  )
}

function ConnectedForecastForm({
  market,
  existingForecast,
  forecastCost,
  onSubmitted,
}: {
  market: Market
  existingForecast?: Forecast
  forecastCost: number
  onSubmitted?: () => void
}) {
  const wagmiConfig = useConfig()
  const { balance, loading: balanceLoading, refresh } = useInferBalance()
  const { submitForecast } = useForecastSubmission()

  const [probability, setProbability] = useState(existingForecast?.probability ?? 50)
  const [txState, setTxState] = useState<ForecastTxState>({ status: "idle" })

  const hasEnoughBalance = balance !== null && balance >= forecastCost
  const isBusy = txState.status === "submitting" || txState.status === "confirming"
  const canSubmit = hasEnoughBalance && !isBusy

  async function handleSubmit() {
    setTxState({ status: "submitting" })
    try {
      const { txHash } = await submitForecast({ marketId: market.id, probability })
      setTxState({ status: "confirming" })
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      setTxState({ status: "success", txHash, probability })
      await refresh()
      onSubmitted?.()
    } catch (err) {
      const outcome = readableEvmError(err)
      if (outcome === "cancelled") {
        setTxState({ status: "cancelled" })
      } else {
        setTxState({ status: "error", message: outcome })
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ProbabilitySlider value={probability} onChange={setProbability} disabled={isBusy} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="text-sm text-muted-foreground">
          Submitting costs <span className="ml-1 font-mono text-foreground">{formatInfer(forecastCost)}</span>
        </div>
        <InferButton variant="primary" onClick={handleSubmit} disabled={!canSubmit}>
          BACK THIS BELIEF
        </InferButton>
      </div>

      {!balanceLoading && !hasEnoughBalance && balance !== null && (
        <p className="text-sm text-destructive">
          {formatInfer(forecastCost)} required. Your balance: {formatInfer(balance)}.
        </p>
      )}

      <TransactionResult state={txState} />
    </div>
  )
}

function readableEvmError(err: unknown): string {
  if (err instanceof Error) {
    const message = err.message.toLowerCase()
    if (
      message.includes("user rejected") ||
      message.includes("user denied") ||
      message.includes("rejected the request")
    ) {
      return "cancelled"
    }
    if (message.includes("insufficient funds") || message.includes("insufficient"))
      return "Insufficient balance to cover the forecast cost plus the network gas fee."
    if (message.includes("timeout") || message.includes("timed out"))
      return "The network did not respond in time. Please try again."
    if (message.includes("chain") && message.includes("mismatch"))
      return "Wrong network. Switch your wallet to Robinhood Chain and try again."
    return "The transaction could not be completed. Please try again."
  }
  return "The transaction could not be completed. Please try again."
}
