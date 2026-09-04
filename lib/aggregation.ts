import type { Forecast } from "@/types/forecast"

/**
 * One wallet = one current opinion.
 *
 * A wallet can revise its forecast, but repeated submissions must not give
 * it additional weight in the current aggregate simply because it paid
 * repeatedly. For each wallet we keep only its most recent valid forecast.
 */
export function latestForecastPerWallet(forecasts: Forecast[]): Forecast[] {
  const latest = new Map<string, Forecast>()
  for (const f of forecasts) {
    const existing = latest.get(f.wallet)
    if (!existing || f.timestamp > existing.timestamp || (f.timestamp === existing.timestamp && f.slot > existing.slot)) {
      latest.set(f.wallet, f)
    }
  }
  return [...latest.values()]
}

export function currentBelief(forecasts: Forecast[]): number | null {
  const latest = latestForecastPerWallet(forecasts)
  if (latest.length === 0) return null
  const sum = latest.reduce((acc, f) => acc + f.probability, 0)
  return sum / latest.length
}

export function totalCommitted(forecasts: Forecast[]): number {
  return forecasts.reduce((acc, f) => acc + f.amountCommitted, 0)
}

export function uniqueForecasterCount(forecasts: Forecast[]): number {
  return new Set(forecasts.map((f) => f.wallet)).size
}

/**
 * Replays all valid forecasts chronologically. Each time a wallet submits a
 * new forecast, it replaces that wallet's previous probability in the
 * running aggregate, and a new aggregate point is recorded.
 */
export function replayBeliefHistory(forecasts: Forecast[]): { timestamp: number; belief: number }[] {
  const chronological = [...forecasts].sort((a, b) => (a.timestamp - b.timestamp) || (a.slot - b.slot))
  const runningLatest = new Map<string, number>()
  const points: { timestamp: number; belief: number }[] = []

  for (const f of chronological) {
    runningLatest.set(f.wallet, f.probability)
    const values = [...runningLatest.values()]
    const belief = values.reduce((acc, v) => acc + v, 0) / values.length
    points.push({ timestamp: f.timestamp, belief })
  }

  return points
}

export function walletHistory(forecasts: Forecast[], wallet: string): Forecast[] {
  return forecasts
    .filter((f) => f.wallet === wallet)
    .sort((a, b) => b.timestamp - a.timestamp)
}
