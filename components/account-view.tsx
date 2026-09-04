"use client"

import Link from "next/link"
import { useInferWallet } from "@/lib/use-wallet-connection"
import { useInferBalance } from "@/hooks/use-infer-balance"
import { useWalletForecasts } from "@/hooks/use-forecasts"
import { markets } from "@/lib/markets"
import { formatAddress, formatInfer, formatProbability, formatDateTime } from "@/lib/format"
import { brierScore } from "@/lib/brier"
import { explorerAddressUrl, explorerTxUrl } from "@/lib/explorer"
import { WalletButton } from "@/components/wallet-button"
import { getInferConfig } from "@/lib/env"

export function AccountView() {
  const { connected } = useInferWallet()
  const { balance, loading: balanceLoading } = useInferBalance()
  const wallet = connected?.account.address as string | undefined
  const { marketAggregates, isLoading, error } = useWalletForecasts(wallet)
  const config = getInferConfig()

  if (!connected) {
    return (
      <div className="border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Connect a wallet to see your forecast history.</p>
        <div className="mt-4 flex justify-center">
          <WalletButton />
        </div>
      </div>
    )
  }

  const rows = markets
    .map((market) => {
      const forecast = marketAggregates?.[market.id]?.forecasts.find((f) => f.wallet === wallet)
      if (!forecast) return null
      const brier =
        market.status === "resolved" && market.resolvedOutcome !== null
          ? brierScore(forecast.probability, market.resolvedOutcome as 0 | 1)
          : null
      return { market, forecast, brier }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)

  return (
    <div>
      <dl className="divide-y divide-border border-y border-border">
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">wallet</dt>
          <dd className="font-mono text-sm text-foreground">
            {config ? (
              <a
                href={explorerAddressUrl(wallet ?? "", config.network)}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {formatAddress(wallet ?? "", 6)}
              </a>
            ) : (
              formatAddress(wallet ?? "", 6)
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">balance</dt>
          <dd className="font-mono text-sm tabular-nums text-foreground">
            {balanceLoading ? "loading..." : balance !== null ? formatInfer(balance) : "unavailable"}
          </dd>
        </div>
      </dl>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-foreground">Forecast history</h2>

      {error ? (
        <p className="mt-4 text-sm text-muted-foreground">Solana data is temporarily unavailable.</p>
      ) : isLoading ? (
        <p className="mt-4 font-mono text-sm text-muted-foreground">loading forecasts...</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No forecasts submitted yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  market
                </th>
                <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  forecast
                </th>
                <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  brier
                </th>
                <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  committed
                </th>
                <th className="py-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">tx</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ market, forecast, brier }) => (
                <tr key={market.id} className="border-b border-border">
                  <td className="py-2 pr-4">
                    <Link href={`/markets/${market.id}`} className="hover:underline">
                      {market.question}
                    </Link>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {formatDateTime(forecast.timestamp)}
                    </div>
                  </td>
                  <td className="py-2 pr-4 font-mono tabular-nums">{formatProbability(forecast.probability)}</td>
                  <td className="py-2 pr-4 font-mono tabular-nums">{brier !== null ? brier.toFixed(3) : "-"}</td>
                  <td className="py-2 pr-4 font-mono tabular-nums">{formatInfer(forecast.amountCommitted)}</td>
                  <td className="py-2 font-mono">
                    {config ? (
                      <a
                        href={explorerTxUrl(forecast.signature, config.network)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        view
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
