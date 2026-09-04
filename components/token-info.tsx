"use client"

import { useBalance } from "wagmi"
import { getInferConfig } from "@/lib/env"
import { explorerAddressUrl } from "@/lib/explorer"
import { formatAddress, formatInfer } from "@/lib/format"

export function TokenInfo() {
  const config = getInferConfig()

  const { data: treasuryBalance, isLoading } = useBalance({
    address: config?.treasury,
    query: { enabled: Boolean(config?.treasury) },
  })

  if (!config) {
    return <p className="font-mono text-sm text-muted-foreground">Treasury not configured.</p>
  }

  const balanceValue =
    treasuryBalance !== undefined ? Number(treasuryBalance.value) / 10 ** treasuryBalance.decimals : null

  const rows: Array<{ label: string; value: string; href?: string }> = [
    { label: "network", value: config.chainName },
    { label: "chain id", value: String(config.chainId) },
    { label: "asset", value: `${config.tokenSymbol} (native)` },
    {
      label: "treasury",
      value: formatAddress(config.treasury, 6),
      href: explorerAddressUrl(config.treasury),
    },
    { label: "decimals", value: String(config.decimals) },
    { label: "forecast cost", value: `${formatInfer(config.forecastCost)} per submission` },
    {
      label: "treasury balance",
      value: isLoading ? "loading..." : balanceValue !== null ? formatInfer(balanceValue) : "unavailable",
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
