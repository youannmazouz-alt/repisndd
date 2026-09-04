"use client"

import useSWR from "swr"
import type { ForecastsApiResponse } from "@/types/forecast"

async function fetchJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? "On-chain data is temporarily unavailable.")
  }
  return res.json()
}

/**
 * Client-side view of a single market's indexed forecasts, backed by the
 * `/api/forecasts` server route (which itself reads Robinhood Chain and caches
 * briefly). Used so the UI can refresh right after a forecast transaction
 * confirms, without re-downloading the whole treasury history on every
 * render.
 */
export function useMarketForecasts(marketId: string) {
  const { data, error, isLoading, mutate } = useSWR<ForecastsApiResponse>(
    `/api/forecasts?market=${encodeURIComponent(marketId)}`,
    fetchJson,
    { revalidateOnFocus: false },
  )

  return {
    aggregate: data?.aggregate ?? null,
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    error: error as Error | undefined,
    refresh: () => mutate(),
  }
}

type AllMarketsResponse = {
  markets: Record<string, ForecastsApiResponse["aggregate"]>
  generatedAt: number
}

/** All markets' aggregates in one indexing pass - used on the home and markets pages. */
export function useAllMarketForecasts() {
  const { data, error, isLoading, mutate } = useSWR<AllMarketsResponse>("/api/forecasts", fetchJson, {
    revalidateOnFocus: false,
  })

  return {
    marketAggregates: data?.markets ?? null,
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    error: error as Error | undefined,
    refresh: () => mutate(),
  }
}

/** A single wallet's forecasts across all markets - used on the account page. */
export function useWalletForecasts(wallet: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<AllMarketsResponse>(
    wallet ? `/api/forecasts?wallet=${encodeURIComponent(wallet)}` : null,
    fetchJson,
    { revalidateOnFocus: false },
  )

  return {
    marketAggregates: data?.markets ?? null,
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    error: error as Error | undefined,
    refresh: () => mutate(),
  }
}
