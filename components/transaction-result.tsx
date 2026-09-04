import { explorerTxUrl } from "@/lib/explorer"
import { formatAddress } from "@/lib/format"
import { getChainLabel } from "@/lib/env"

export type ForecastTxState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "confirming" }
  | { status: "success"; txHash: string; probability: number }
  | { status: "cancelled" }
  | { status: "error"; message: string }

export function TransactionResult({ state }: { state: ForecastTxState }) {
  if (state.status === "idle") return null

  if (state.status === "submitting") {
    return <p className="font-mono text-sm text-muted-foreground">submitting forecast...</p>
  }

  if (state.status === "confirming") {
    return <p className="font-mono text-sm text-muted-foreground">confirming on {getChainLabel()}...</p>
  }

  if (state.status === "cancelled") {
    return <p className="font-mono text-sm text-muted-foreground">Transaction cancelled.</p>
  }

  if (state.status === "error") {
    return (
      <div className="border border-destructive/40 bg-destructive/5 p-3">
        <p className="text-sm text-destructive">{state.message}</p>
      </div>
    )
  }

  return (
    <div className="border border-foreground p-4">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">forecast recorded</p>
      <p className="mt-1 font-serif text-3xl font-bold">{state.probability}%</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        transaction {formatAddress(state.txHash, 6, 4)}
      </p>
      <a
        href={explorerTxUrl(state.txHash)}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-block text-sm"
      >
        view on explorer &#8599;
      </a>
    </div>
  )
}
