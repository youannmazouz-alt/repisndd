"use client"

import { useState } from "react"
import { isAbortError } from "@solana/promises"
import { ProbabilitySlider } from "@/components/probability-slider"
import { InferButton } from "@/components/infer-button"
import { TransactionResult, type ForecastTxState } from "@/components/transaction-result"
import { useInferWallet } from "@/lib/use-wallet-connection"
import { useInferBalance } from "@/hooks/use-infer-balance"
import { useForecastSubmission } from "@/hooks/use-forecast-submission"
import { getInferConfig } from "@/lib/env"
import { formatInfer } from "@/lib/format"
import type { Market } from "@/types/market"
import type { Forecast } from "@/types/forecast"
import type { InferClient } from "@/lib/solana-client"

/**
 * The primary interaction of the whole application: pick a probability,
 * commit $INFER, and record both in one signed Solana transaction.
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
  const { client, isReady, connected } = useInferWallet()

  if (!config) {
    return (
      <div className="border border-border bg-secondary/40 p-4">
        <p className="text-sm text-muted-foreground">INFER is not configured. Add Solana environment variables.</p>
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
    return <p className="font-mono text-sm text-muted-foreground">reading Solana...</p>
  }

  if (!client || !connected) {
    return (
      <div className="border border-border bg-secondary/40 p-4">
        <p className="text-sm text-muted-foreground">Connect a Solana wallet to submit a forecast.</p>
      </div>
    )
  }

  // Re-keying on the connected address resets all local form state
  // (probability, tx status) whenever the active wallet account changes.
  return (
    <ConnectedForecastForm
      key={connected.account.address}
      client={client}
      market={market}
      existingForecast={existingForecast}
      forecastCost={config.forecastCost}
      network={config.network}
      onSubmitted={onSubmitted}
    />
  )
}

function ConnectedForecastForm({
  client,
  market,
  existingForecast,
  forecastCost,
  network,
  onSubmitted,
}: {
  client: InferClient
  market: Market
  existingForecast?: Forecast
  forecastCost: number
  network: "devnet" | "mainnet" | "testnet"
  onSubmitted?: () => void
}) {
  const { connected } = useInferWallet()
  const { balance, loading: balanceLoading } = useInferBalance()
  const { submitForecast } = useForecastSubmission(client)

  const [probability, setProbability] = useState(existingForecast?.probability ?? 50)
  const [txState, setTxState] = useState<ForecastTxState>({ status: "idle" })

  const signer = connected?.signer ?? null
  const hasEnoughBalance = balance !== null && balance >= forecastCost
  const isBusy = txState.status === "submitting" || txState.status === "confirming"
  const canSubmit = Boolean(signer) && hasEnoughBalance && !isBusy

  async function handleSubmit() {
    if (!signer) return
    setTxState({ status: "submitting" })
    try {
      setTxState({ status: "confirming" })
      const { signature } = await submitForecast({ signer, marketId: market.id, probability })
      setTxState({ status: "success", signature, probability })
      onSubmitted?.()
    } catch (err) {
      if (isAbortError(err)) return
      const outcome = readableSolanaError(err)
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
          {forecastCost} INFER required. Your balance: {balance} INFER.
        </p>
      )}

      {!signer && <p className="text-sm text-muted-foreground">This wallet cannot sign transactions.</p>}

      <TransactionResult state={txState} network={network} />
    </div>
  )
}

function readableSolanaError(err: unknown): string {
  if (err instanceof Error) {
    const message = err.message.toLowerCase()
    if (message.includes("user rejected") || message.includes("reject")) return "cancelled"
    if (message.includes("insufficient")) return "Insufficient SOL to cover the network fee, or insufficient $INFER."
    if (message.includes("timeout")) return "Solana did not respond in time. Please try again."
    return "The transaction could not be completed. Please try again."
  }
  return "The transaction could not be completed. Please try again."
}
