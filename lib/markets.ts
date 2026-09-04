import type { Market } from "@/types/market"

/**
 * Market metadata for the hackathon MVP.
 *
 * There is no on-chain market-creation program. Markets are defined here and
 * may be edited manually before deployment. Resolution is likewise recorded
 * manually (status + resolvedOutcome) rather than via an oracle. This
 * tradeoff is disclosed on the Methods page.
 */
export const markets: Market[] = [
  {
    id: "MKT001",
    question: "Will ETH close above $4,000 on September 30, 2026?",
    shortQuestion: "ETH > $4,000 on Sep 30?",
    description:
      "Resolves YES if the reference ETH/USD price is strictly above $4,000 at the defined observation time (2026-09-30T20:00:00Z). Resolves NO otherwise.",
    category: "Markets",
    openedAt: "2026-08-23T00:00:00Z",
    closesAt: "2026-09-30T20:00:00Z",
    resolutionSource: "Defined ETH/USD reference price",
    status: "open",
    resolvedOutcome: null,
  },
  {
    id: "MKT002",
    question: "Will Robinhood Chain monthly DEX volume exceed the specified threshold before October 1, 2026?",
    shortQuestion: "Robinhood Chain DEX volume > threshold?",
    description:
      "Resolves YES if aggregate Robinhood Chain DEX volume for September 2026 exceeds the threshold specified in the resolution source. Resolves NO otherwise.",
    category: "Markets",
    openedAt: "2026-08-23T00:00:00Z",
    closesAt: "2026-10-01T00:00:00Z",
    resolutionSource: "Defined Robinhood Chain DEX volume aggregator",
    status: "open",
    resolvedOutcome: null,
  },
  {
    id: "MKT003",
    question: "Will USDC supply on Robinhood Chain be higher on September 30 than on August 31, 2026?",
    shortQuestion: "USDC supply on Robinhood Chain rises?",
    description:
      "Resolves YES if the circulating USDC supply on Robinhood Chain at the September 30, 2026 observation time is strictly greater than at the August 31, 2026 reference time. Resolves NO otherwise.",
    category: "Markets",
    openedAt: "2026-08-23T00:00:00Z",
    closesAt: "2026-09-30T20:00:00Z",
    resolutionSource: "Defined USDC-on-Robinhood-Chain supply reference",
    status: "open",
    resolvedOutcome: null,
  },
  {
    id: "MKT004",
    question: "Will a specified Robinhood Chain protocol metric increase by at least 10% during the observation period?",
    shortQuestion: "Protocol metric up 10%+?",
    description:
      "Resolves YES if the specified protocol metric increases by at least 10% between the opening and closing observation times. Resolves NO otherwise.",
    category: "Markets",
    openedAt: "2026-08-23T00:00:00Z",
    closesAt: "2026-09-30T20:00:00Z",
    resolutionSource: "Defined protocol metric reference",
    status: "open",
    resolvedOutcome: null,
  },
]

export function getMarket(id: string): Market | undefined {
  return markets.find((m) => m.id === id)
}

export function allOpenMarkets(): Market[] {
  return markets.filter((m) => m.status === "open")
}
