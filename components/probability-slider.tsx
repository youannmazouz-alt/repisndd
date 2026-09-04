"use client"

import { useId } from "react"

type ProbabilitySliderProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function ProbabilitySlider({ value, onChange, disabled }: ProbabilitySliderProps) {
  const id = useId()

  function commit(next: number) {
    const clamped = Math.min(99, Math.max(1, Math.round(next)))
    onChange(clamped)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-serif text-sm text-muted-foreground">
          your estimate
        </label>
        <span className="font-serif text-5xl font-bold tabular-nums text-foreground">{value}%</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">1%</span>
        <input
          id={id}
          type="range"
          min={1}
          max={99}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => commit(Number(e.target.value))}
          className="h-1 w-full flex-1 cursor-pointer appearance-none border border-border bg-secondary accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          aria-valuetext={`${value} percent`}
        />
        <span className="font-mono text-xs text-muted-foreground">99%</span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor={`${id}-number`} className="sr-only">
          Probability, as a number between 1 and 99
        </label>
        <input
          id={`${id}-number`}
          type="number"
          min={1}
          max={99}
          value={value}
          disabled={disabled}
          onChange={(e) => commit(Number(e.target.value))}
          className="w-20 border border-border bg-background px-2 py-1 font-mono text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          You are assigning approximately a {value}% probability to YES.
        </p>
      </div>
    </div>
  )
}
