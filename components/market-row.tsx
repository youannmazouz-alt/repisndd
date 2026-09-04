import Link from "next/link"
import { formatDate, formatInfer, formatNumber, formatProbability } from "@/lib/format"
import type { Market } from "@/types/market"
import type { MarketAggregate } from "@/types/forecast"

export function MarketRow({ market, aggregate }: { market: Market; aggregate: MarketAggregate | null }) {
  const belief = aggregate?.currentBelief ?? 50
  const forecasters = aggregate?.forecasterCount ?? 0
  const committed = aggregate?.totalCommitted ?? 0

  return (
    <Link
      href={`/markets/${market.id}`}
      className="block border-b border-border py-4 text-foreground no-underline hover:bg-secondary/50"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center sm:gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{market.id}</p>
          <p className="font-serif text-base leading-snug text-pretty">{market.question}</p>
        </div>

        <div className="flex justify-between gap-2 sm:flex-col sm:items-end sm:gap-0">
          <span className="font-mono text-[11px] uppercase text-muted-foreground sm:hidden">belief</span>
          <span className="font-mono text-sm tabular-nums">{formatProbability(belief)}</span>
        </div>

        <div className="flex justify-between gap-2 sm:flex-col sm:items-end sm:gap-0">
          <span className="font-mono text-[11px] uppercase text-muted-foreground sm:hidden">forecasters</span>
          <span className="font-mono text-sm tabular-nums">{formatNumber(forecasters)}</span>
        </div>

        <div className="flex justify-between gap-2 sm:flex-col sm:items-end sm:gap-0">
          <span className="font-mono text-[11px] uppercase text-muted-foreground sm:hidden">committed</span>
          <span className="font-mono text-sm tabular-nums">{formatInfer(committed)}</span>
        </div>

        <div className="flex justify-between gap-2 sm:flex-col sm:items-end sm:gap-0">
          <span className="font-mono text-[11px] uppercase text-muted-foreground sm:hidden">closes</span>
          <span className="font-mono text-sm">{formatDate(market.closesAt)}</span>
        </div>
      </div>
    </Link>
  )
}
