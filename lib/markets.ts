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
    question: "Will SOL close above $250 on September 30, 2026?",
    shortQuestion: "SOL > $250 on Sep 30?",
    description:
      "Resolves YES if the reference SOL/USD price is strictly above $250 at the defined observation time (2026-09-30T20:00:00Z). Resolves NO otherwise.",
    category: "Markets",
    openedAt: "2026-08-23T00:00:00Z",
    closesAt: "2026-09-30T20:00:00Z",
    resolutionSource: "Defined SOL/USD reference price",
    status: "open",
    resolvedOutcome: null,
  },
  {
    id: "MKT002",
    question: "Will Solana monthly DEX volume exceed the specified threshold before October 1, 2026?",
    shortQuestion: "Solana DEX volume > threshold?",
    description:
      "Resolves YES if aggregate Solana DEX volume for September 2026 exceeds the threshold specified in the resolution source. Resolves NO otherwise.",
    category: "Markets",
    openedAt: "2026-08-23T00:00:00Z",
    closesAt: "2026-10-01T00:00:00Z",
    resolutionSource: "Defined Solana DEX volume aggregator",
    status: "open",
    resolvedOutcome: null,
  },
  {
    id: "MKT003",
    question: "Will USDC supply on Solana be higher on September 30 than on August 31, 2026?",
    shortQuestion: "USDC supply on Solana rises?",
    description:
      "Resolves YES if the circulating USDC supply on Solana at the September 30, 2026 observation time is strictly greater than at the August 31, 2026 reference time. Resolves NO otherwise.",
    category: "Markets",
    openedAt: "2026-08-23T00:00:00Z",
    closesAt: "2026-09-30T20:00:00Z",
    resolutionSource: "Defined USDC-on-Solana supply reference",
    status: "open",
    resolvedOutcome: null,
  },
  {
    id: "MKT004",
    question: "Will a specified Solana protocol metric increase by at least 10% during the observation period?",
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
