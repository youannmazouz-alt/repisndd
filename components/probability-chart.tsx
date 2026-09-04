"use client"

import { useId, useMemo, useState, type MouseEvent } from "react"
import { formatDateTime } from "@/lib/format"

type Point = { timestamp: number; belief: number }

const WIDTH = 720
const HEIGHT = 220
const PAD_LEFT = 36
const PAD_RIGHT = 12
const PAD_TOP = 16
const PAD_BOTTOM = 24

export function ProbabilityChart({ points }: { points: Point[] }) {
  const clipId = useId()
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const scaled = useMemo(() => {
    if (points.length === 0) return null

    const minTs = points[0].timestamp
    const maxTs = points[points.length - 1].timestamp
    const span = Math.max(1, maxTs - minTs)

    const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT
    const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

    return points.map((p, i) => {
      const x =
        points.length === 1
          ? PAD_LEFT + innerWidth / 2
          : PAD_LEFT + ((p.timestamp - minTs) / span) * innerWidth
      const y = PAD_TOP + innerHeight - (p.belief / 100) * innerHeight
      return { ...p, x, y, index: i }
    })
  }, [points])

  if (!scaled || scaled.length === 0) {
    return (
      <div className="border border-border bg-secondary/40 p-8 text-center">
        <p className="text-sm text-muted-foreground">No forecasts have been recorded yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">The current prior is displayed as 50%.</p>
      </div>
    )
  }

  const path = scaled.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ")
  const hovered = hoverIndex !== null ? scaled[hoverIndex] : null

  function onMove(e: MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH
    let closest = 0
    let bestDist = Number.POSITIVE_INFINITY
    scaled!.forEach((p, i) => {
      const d = Math.abs(p.x - px)
      if (d < bestDist) {
        bestDist = d
        closest = i
      }
    })
    setHoverIndex(closest)
  }

  const gridLines = [0, 25, 50, 75, 100]

  return (
    <div>
      <p className="mb-2 font-mono text-xs lowercase text-muted-foreground">aggregate probability over time</p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Aggregate probability over time"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD_LEFT} y={PAD_TOP} width={WIDTH - PAD_LEFT - PAD_RIGHT} height={HEIGHT - PAD_TOP - PAD_BOTTOM} />
          </clipPath>
        </defs>

        {gridLines.map((g) => {
          const y = PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) * (1 - g / 100)
          return (
            <g key={g}>
              <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} />
              <text x={PAD_LEFT - 6} y={y + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10} fontFamily="ui-monospace, monospace">
                {g}
              </text>
            </g>
          )
        })}

        <line
          x1={PAD_LEFT}
          x2={PAD_LEFT}
          y1={PAD_TOP}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="var(--foreground)"
          strokeWidth={1}
        />
        <line
          x1={PAD_LEFT}
          x2={WIDTH - PAD_RIGHT}
          y1={HEIGHT - PAD_BOTTOM}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="var(--foreground)"
          strokeWidth={1}
        />

        <g clipPath={`url(#${clipId})`}>
          <path d={path} fill="none" stroke="var(--foreground)" strokeWidth={1.5} />
        </g>

        {hovered && (
          <g>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PAD_TOP}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <circle cx={hovered.x} cy={hovered.y} r={3} fill="var(--foreground)" />
          </g>
        )}
      </svg>

      <div className="mt-1 h-5 font-mono text-xs text-muted-foreground">
        {hovered ? `${formatDateTime(hovered.timestamp)} - ${hovered.belief.toFixed(1)}%` : "hover the line for exact values"}
      </div>
    </div>
  )
}
