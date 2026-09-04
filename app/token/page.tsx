import type { Metadata } from "next"
import { TokenInfo } from "@/components/token-info"

export const metadata: Metadata = {
  title: "$INFER Token - INFER",
  description: "The SPL token that INFER forecasts are denominated and committed in.",
}

export default function TokenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">$INFER</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        $INFER is the SPL token forecasters commit when they submit a probability. It is not staked, not locked, and
        not redistributed by a market maker - it is transferred to the treasury as a record of conviction, and its
        movement is verifiable on-chain.
      </p>
      <div className="mt-8">
        <TokenInfo />
      </div>
      <div className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          There is no bonding curve and no automated payout. INFER does not custody funds beyond what a forecaster
          sends when submitting - every transfer is a direct wallet-to-treasury SPL transaction, memoed with the
          market id and probability, and indexed straight from the chain.
        </p>
        <p>Holding $INFER does not grant governance rights. Its only function inside this app is forecast cost.</p>
      </div>
    </div>
  )
}
