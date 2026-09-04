import { explorerTxUrl } from "@/lib/explorer"
import { formatAddress, formatDate, formatInfer, formatProbability } from "@/lib/format"
import type { SolanaNetwork } from "@/lib/env"
import type { Forecast } from "@/types/forecast"
import { getMarket } from "@/lib/markets"

/**
 * A list of individual on-chain forecasts. Used both for "recent forecasts"
 * on a market page (wallet + probability) and for a wallet's own history
 * (question + probability), depending on which columns are supplied.
 */
export function ForecastHistory({
  forecasts,
  network,
  showWallet = true,
  showQuestion = false,
}: {
  forecasts: Forecast[]
  network: SolanaNetwork
  showWallet?: boolean
  showQuestion?: boolean
}) {
  if (forecasts.length === 0) {
    return <p className="text-sm text-muted-foreground">No forecasts have been recorded yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">date</th>
            {showQuestion && (
              <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                question
              </th>
            )}
            {showWallet && (
              <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                forecaster
              </th>
            )}
            <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              forecast
            </th>
            <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              committed
            </th>
            <th className="py-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">tx</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map((f) => {
            const market = getMarket(f.marketId)
            return (
              <tr key={f.signature} className="border-b border-border">
                <td className="py-2 pr-4 font-mono whitespace-nowrap">{formatDate(f.timestamp)}</td>
                {showQuestion && (
                  <td className="py-2 pr-4 text-pretty">{market?.shortQuestion ?? f.marketId}</td>
                )}
                {showWallet && <td className="py-2 pr-4 font-mono">{formatAddress(f.wallet)}</td>}
                <td className="py-2 pr-4 font-mono tabular-nums">{formatProbability(f.probability, 0)}</td>
                <td className="py-2 pr-4 font-mono tabular-nums">{formatInfer(f.amountCommitted)}</td>
                <td className="py-2">
                  <a
                    href={explorerTxUrl(f.signature, network)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs"
                  >
                    tx {formatAddress(f.signature)} &#8599;
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
