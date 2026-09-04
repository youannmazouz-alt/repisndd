"use client"

import { MarketRow } from "@/components/market-row"
import { useAllMarketForecasts } from "@/hooks/use-forecasts"
import type { Market } from "@/types/market"

export function OpenQuestionsList({ markets }: { markets: Market[] }) {
  const { marketAggregates, isLoading, error } = useAllMarketForecasts()

  if (error) {
    return <p className="border-t border-border py-4 text-sm text-muted-foreground">no questions avaible yet</p>
  }

  return (
    <div>
      {markets.map((market) => (
        <MarketRow
          key={market.id}
          market={market}
          aggregate={isLoading ? null : marketAggregates?.[market.id] ?? null}
        />
      ))}
    </div>
  )
}

