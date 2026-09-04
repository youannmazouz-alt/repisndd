import { formatAddress, formatInfer } from "@/lib/format"
import type { JudgmentRow } from "@/lib/judgment"

export function JudgmentTable({ rows }: { rows: JudgmentRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No resolved judgments yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              forecaster
            </th>
            <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              resolved
            </th>
            <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">brier</th>
            <th className="py-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">committed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.wallet} className="border-b border-border">
              <td className="py-2 pr-4 font-mono">{formatAddress(row.wallet)}</td>
              <td className="py-2 pr-4 font-mono tabular-nums">{row.resolvedCount}</td>
              <td className="py-2 pr-4 font-mono tabular-nums">{row.meanBrier.toFixed(3)}</td>
              <td className="py-2 font-mono tabular-nums">{formatInfer(row.totalCommitted)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
