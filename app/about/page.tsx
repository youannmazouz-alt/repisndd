import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About - INFER",
  description: "Why INFER exists and what it refuses to be.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">About</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          INFER is a forecasting ledger, not a prediction market. There are no payouts, no odds, and no way to profit
          from being right beyond a lower Brier score and a place on the{" "}
          <Link href="/judgment" className="text-foreground underline underline-offset-2">
            Judgment
          </Link>{" "}
          leaderboard.
        </p>
        <p>
          Every forecast costs a fixed amount of Robinhood Chain&apos;s native asset, sent to a treasury wallet with
          an on-chain memo, so that committing to a probability has a real, verifiable cost - but that cost is not
          staked against an outcome and it is not returned or multiplied. It exists to keep forecasts from being free
          opinions.
        </p>
        <p>
          What is measured is calibration: whether the probabilities a forecaster states track how often things
          actually happen. A forecaster who is consistently 70% confident should be right about 70% of the time. The
          Brier score used on the{" "}
          <Link href="/judgment" className="text-foreground underline underline-offset-2">
            Judgment
          </Link>{" "}
          page is a standard, well-studied way to measure that - see{" "}
          <Link href="/methods" className="text-foreground underline underline-offset-2">
            Methods
          </Link>{" "}
          for the exact mechanics.
        </p>
        <p>
          INFER holds no funds beyond what a wallet transfers when submitting a forecast, runs no off-chain database
          of positions, and makes no discretionary call on any market&apos;s outcome. Every number on this site is
          derived, in the browser or in the API route, from data that is already public on Robinhood Chain.
        </p>
      </div>
    </div>
  )
}
