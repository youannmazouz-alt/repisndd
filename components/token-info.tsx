"use client"

import { useMemo } from "react"
import { useRequest } from "@solana/react"
import { inferClient } from "@/lib/solana-client"
import { getInferConfig, getSolanaNetwork } from "@/lib/env"
import { fetchInferBalance } from "@/lib/token"
import { explorerAddressUrl } from "@/lib/explorer"
import { formatAddress, formatInfer } from "@/lib/format"

export function TokenInfo() {
  const config = getInferConfig()
  const network = getSolanaNetwork()

  const fetchTreasuryBalance = useMemo(() => {
    return async () => {
      if (!inferClient || !config) return null
      return fetchInferBalance(inferClient, config.treasuryOwner)
    }
  }, [config])

  const { data: treasuryBalance, status } = useRequest(fetchTreasuryBalance)
  const isLoading = status === "fetching"

  if (!config) {
    return (
      <p className="font-mono text-sm text-muted-foreground">
        CA :
      </p>
    )
  }

  const rows: Array<{ label: string; value: string; href?: string }> = [
    { label: "network", value: network },
    { label: "mint", value: formatAddress(config.mint, 6), href: explorerAddressUrl(config.mint, config.network) },
    {
      label: "treasury owner",
      value: formatAddress(config.treasuryOwner, 6),
      href: explorerAddressUrl(config.treasuryOwner, config.network),
    },
    { label: "decimals", value: String(config.decimals) },
    { label: "forecast cost", value: `${formatInfer(config.forecastCost)} per submission` },
    {
      label: "treasury balance",
      value: isLoading ? "loading..." : treasuryBalance !== null && treasuryBalance !== undefined ? formatInfer(treasuryBalance) : "unavailable",
    },
  ]

  return (
    <dl className="divide-y divide-border border-y border-border">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 py-3">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{row.label}</dt>
          <dd className="font-mono text-sm tabular-nums text-foreground">
            {row.href ? (
              <a href={row.href} target="_blank" rel="noreferrer" className="hover:underline">
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
