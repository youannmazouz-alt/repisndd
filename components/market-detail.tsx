"use client"

import { ProbabilityChart } from "@/components/probability-chart"
import { ForecastForm } from "@/components/forecast-form"
import { ForecastHistory } from "@/components/forecast-history"
import { useMarketForecasts } from "@/hooks/use-forecasts"
import { useInferWallet } from "@/lib/use-wallet-connection"
import { getInferConfig } from "@/lib/env"
import { formatDate, formatInfer, formatNumber, formatProbability } from "@/lib/format"
import type { Market } from "@/types/market"

export function MarketDetail({ market }: { market: Market }) {
  const { aggregate, isLoading, error, refresh } = useMarketForecasts(market.id)
  const { connected } = useInferWallet()
  const config = getInferConfig()

  const belief = aggregate?.currentBelief ?? null
  const displayBelief = belief === null ? 50 : belief
  const forecasterCount = aggregate?.forecasterCount ?? 0
  const totalCommitted = aggregate?.totalCommitted ?? 0
  const history = aggregate?.history ?? []
  const recentForecasts = aggregate?.forecasts ?? []

  const myForecast = connected
    ? recentForecasts.find((f) => f.wallet === connected.account.address)
    : undefined

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">INFER / {market.id}</p>
      <h1 className="mt-2 font-serif text-2xl font-bold text-pretty text-foreground sm:text-3xl">
        {market.question}
      </h1>

      <hr className="my-6 border-border" />

      <section>
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">current belief</h2>
        {belief === null && !isLoading ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No forecasts have been recorded yet. The current prior is displayed as 50%.
          </p>
        ) : null}
        <p className="mt-1 text-center font-serif text-5xl font-bold tabular-nums text-foreground sm:text-6xl">
          {formatProbability(displayBelief)}
        </p>

        <div className="mt-6">
          {error ? (
            <p className="text-sm text-muted-foreground">Solana data is temporarily unavailable. <button onClick={() => refresh()} className="underline">retry</button></p>
          ) : (
            <ProbabilityChart points={history} />
          )}
        </div>
      </section>

      <hr className="my-6 border-border" />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="forecasters" value={formatNumber(forecasterCount)} />
        <Stat label="total committed" value={formatInfer(totalCommitted)} />
        <Stat label="closes" value={formatDate(market.closesAt)} />
        <Stat label="status" value={market.status.toUpperCase()} />
      </section>

      <hr className="my-6 border-border" />

      <section>
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {myForecast ? "your current forecast" : "your estimate"}
        </h2>
        {myForecast && config && (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatProbability(myForecast.probability, 0)} - submitted {formatDate(myForecast.timestamp)}. Updating
            your belief costs another {formatInfer(config.forecastCost)}.
          </p>
        )}
        <div className="mt-4">
          <ForecastForm market={market} existingForecast={myForecast} onSubmitted={refresh} />
        </div>
      </section>

      <hr className="my-6 border-border" />

      <section>
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">about this question</h2>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{market.description}</p>

        <h2 className="mt-6 font-mono text-xs uppercase tracking-wide text-muted-foreground">resolution</h2>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{market.resolutionSource}</p>
      </section>

      <hr className="my-6 border-border" />

      <section>
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">recent forecasts</h2>
        <div className="mt-3">
          <ForecastHistory forecasts={recentForecasts.slice(0, 25)} network={config?.network ?? "devnet"} />
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm tabular-nums text-foreground">{value}</p>
    </div>
  )
}
