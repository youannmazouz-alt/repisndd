/**
 * Brier score: BS = (p - o)^2
 * p = forecast probability represented between 0 and 1
 * o = actual outcome, 0 or 1
 * Lower is better. A score of 0 is perfect calibration on that single event.
 */
export function brierScore(probabilityPercent: number, outcome: 0 | 1): number {
  const p = probabilityPercent / 100
  return Math.pow(p - outcome, 2)
}

export function meanBrierScore(scores: number[]): number | null {
  if (scores.length === 0) return null
  return scores.reduce((sum, s) => sum + s, 0) / scores.length
}
