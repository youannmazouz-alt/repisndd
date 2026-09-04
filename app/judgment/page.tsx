import type { Metadata } from "next"
import { JudgmentView } from "@/components/judgment-view"

export const metadata: Metadata = {
  title: "Judgment - INFER",
  description: "The calibration leaderboard. Ranked by Brier score across resolved markets, not by volume.",
}

export default function JudgmentPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Judgment</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Every wallet that forecasted a resolved market is scored on the accuracy of its final call, using the Brier
        score. This is not a leaderboard of who committed the most INFER - it is a record of who was right.
      </p>
      <div className="mt-8">
        <JudgmentView />
      </div>
    </div>
  )
}
