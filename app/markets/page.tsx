import type { Metadata } from "next"
import { MarketsList } from "@/components/markets-list"

export const metadata: Metadata = {
  title: "Open Questions - INFER",
  description: "Resolvable questions currently open for costly probabilistic forecasts on INFER.",
}

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground">Open Questions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Resolvable questions. State a probability. Commit $INFER. Record it on Solana.
      </p>

      <div className="mt-6">
        <MarketsList />
      </div>
    </div>
  )
}
