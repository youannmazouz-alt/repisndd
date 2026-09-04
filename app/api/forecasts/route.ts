import { NextResponse, type NextRequest } from "next/server"
import { getAllValidForecasts } from "@/lib/forecast-indexer"
import { currentBelief, replayBeliefHistory, totalCommitted, uniqueForecasterCount } from "@/lib/aggregation"
import { isInferConfigured } from "@/lib/env"
import { markets } from "@/lib/markets"
import type { Forecast, MarketAggregate } from "@/types/forecast"

export const dynamic = "force-dynamic"

function buildAggregate(marketId: string, forecasts: Forecast[]): MarketAggregate {
  return {
    marketId,
    currentBelief: currentBelief(forecasts),
    forecasterCount: uniqueForecasterCount(forecasts),
    totalCommitted: totalCommitted(forecasts),
    history: replayBeliefHistory(forecasts),
    forecasts: [...forecasts].sort((a, b) => b.timestamp - a.timestamp),
  }
}

/**
 * Server-side indexing endpoint. The blockchain is the source of truth:
 * this route reads raw transactions from Robinhood Chain, validates them,
 * and returns normalized forecast data. It never fabricates data.
 *
 *   GET /api/forecasts?market=MKT001
 *   GET /api/forecasts                (all markets)
 *   GET /api/forecasts?wallet=<addr>  (optional wallet filter)
 *   GET /api/forecasts?refresh=1      (bypass the short-lived cache)
 */
export async function GET(request: NextRequest) {
  if (!isInferConfigured()) {
    return NextResponse.json(
      { error: "INFER is not configured. Add the Robinhood Chain environment variables." },
      { status: 503 },
    )
  }

  const { searchParams } = new URL(request.url)
  const marketId = searchParams.get("market")
  const wallet = searchParams.get("wallet")
  const forceRefresh = searchParams.get("refresh") === "1"

  try {
    const { forecasts, cached, fetchedAt } = await getAllValidForecasts({ forceRefresh })
    const filteredByWallet = wallet ? forecasts.filter((f) => f.wallet === wallet) : forecasts

    if (marketId) {
      const marketForecasts = filteredByWallet.filter((f) => f.marketId === marketId)
      return NextResponse.json({
        marketId,
        aggregate: buildAggregate(marketId, marketForecasts),
        generatedAt: fetchedAt,
        cached,
      })
    }

    const aggregates: Record<string, MarketAggregate> = {}
    for (const market of markets) {
      aggregates[market.id] = buildAggregate(
        market.id,
        filteredByWallet.filter((f) => f.marketId === market.id),
      )
    }

    return NextResponse.json({
      markets: aggregates,
      generatedAt: fetchedAt,
      cached,
    })
  } catch (error) {
    console.error("[v0] /api/forecasts indexing failed:", error)
    return NextResponse.json({ error: "On-chain data is temporarily unavailable." }, { status: 502 })
  }
}
