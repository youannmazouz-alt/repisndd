import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Methods - INFER",
  description: "How forecasts are recorded, indexed, aggregated, and scored.",
}

const sections = [
  {
    title: "Submission",
    body: "A forecast is a single SPL token transfer from a forecaster's wallet to the INFER treasury, carrying a fixed amount of $INFER and a memo instruction encoding the market id and a probability between 1 and 99. The transaction is built client-side, signed by the connected wallet, and sent directly to the network - INFER never holds a private key or custodies funds beyond the transfer itself.",
  },
  {
    title: "Memo format",
    body: "The memo is a plain string: INFER:v1:<marketId>:<probabilityInteger>. Any transaction to the treasury whose memo does not match this exact shape, or whose amount does not match the configured forecast cost, is ignored by the indexer - it is not shown as a forecast and does not enter any aggregate.",
  },
  {
    title: "Indexing",
    body: "Forecasts are not stored in a database. Each request to /api/forecasts queries the Solana RPC for the treasury token account's transaction history, decodes every matching transfer and memo, and rebuilds the market's current state from scratch. The result is cached briefly at the edge to keep repeated page loads fast without re-scanning history on every render.",
  },
  {
    title: "Aggregation",
    body: "A market's displayed probability is the amount-weighted mean of every forecaster's most recent valid submission - one wallet, one active forecast per market. Submitting again from the same wallet replaces that wallet's prior forecast in the aggregate; it does not add a second vote.",
  },
  {
    title: "Scoring",
    body: "Once a market resolves to YES or NO, every wallet's final forecast for that market is scored with the Brier score: the squared difference between the stated probability and the realized outcome (0 or 1), on a 0–1 scale where lower is better. A forecaster who said 90% and was right scores 0.01; a forecaster who said 90% and was wrong scores 0.81. The Judgment leaderboard ranks wallets by their mean Brier score across every resolved market they forecasted - not by capital committed.",
  },
  {
    title: "Resolution",
    body: "Markets resolve to a documented, verifiable outcome at a fixed close time. Resolution data lives in the market definitions themselves, not in a separate admin action - there is no discretionary outcome-setting inside this app.",
  },
]

export default function MethodsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Methods</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Everything below is mechanical. There is no hidden weighting, no moderation of forecasts, and no way to
        submit a forecast that isn&apos;t a real on-chain transaction.
      </p>
      <ol className="mt-10 space-y-8">
        {sections.map((section, i) => (
          <li key={section.title} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
