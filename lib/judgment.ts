import { markets } from "@/lib/markets"
import { brierScore, meanBrierScore } from "@/lib/brier"
import type { Forecast } from "@/types/forecast"

export type JudgmentRow = {
  wallet: string
  resolvedCount: number
  meanBrier: number
  totalCommitted: number
}

/**
 * Builds the Judgment leaderboard from real resolved forecasts only. For
 * each wallet, on each resolved market, uses that wallet's FINAL valid
 * forecast before the market closed (i.e. its last submission for that
 * market, since only valid submissions before closing are ever indexed).
 */
export function buildJudgmentLeaderboard(allForecasts: Forecast[]): JudgmentRow[] {
  const resolvedMarkets = markets.filter((m) => m.status === "resolved" && m.resolvedOutcome !== null)
  if (resolvedMarkets.length === 0) return []

  const perWallet = new Map<string, { scores: number[]; committed: number }>()

  for (const market of resolvedMarkets) {
    const outcome = market.resolvedOutcome as 0 | 1
    const forMarket = allForecasts.filter((f) => f.marketId === market.id)

    const finalByWallet = new Map<string, Forecast>()
    for (const f of forMarket) {
      const existing = finalByWallet.get(f.wallet)
      if (!existing || f.timestamp > existing.timestamp) {
        finalByWallet.set(f.wallet, f)
      }
    }

    for (const f of forMarket) {
      const entry = perWallet.get(f.wallet) ?? { scores: [], committed: 0 }
      entry.committed += f.amountCommitted
      perWallet.set(f.wallet, entry)
    }

    for (const [wallet, finalForecast] of finalByWallet) {
      const entry = perWallet.get(wallet) ?? { scores: [], committed: 0 }
      entry.scores.push(brierScore(finalForecast.probability, outcome))
      perWallet.set(wallet, entry)
    }
  }

  const rows: JudgmentRow[] = []
  for (const [wallet, { scores, committed }] of perWallet) {
    const mean = meanBrierScore(scores)
    if (mean === null) continue
    rows.push({ wallet, resolvedCount: scores.length, meanBrier: mean, totalCommitted: committed })
  }

  return rows.sort((a, b) => a.meanBrier - b.meanBrier)
}
