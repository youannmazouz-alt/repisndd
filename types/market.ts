export type MarketStatus = "open" | "closed" | "resolved"

export type ResolvedOutcome = 0 | 1 | null

export type Market = {
  id: string
  question: string
  shortQuestion: string
  description: string
  category: string
  openedAt: string
  closesAt: string
  resolutionSource: string
  status: MarketStatus
  resolvedOutcome: ResolvedOutcome
}
