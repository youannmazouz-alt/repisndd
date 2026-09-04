/** Pure formatting helpers. No React dependencies. */

import { getTokenSymbol } from "@/lib/env"

/** `0x7Gx...91Df` style abbreviation. Never exposes the full address by default. */
export function formatAddress(address: string, lead = 6, trail = 4): string {
  if (address.length <= lead + trail + 3) return address
  return `${address.slice(0, lead)}...${address.slice(-trail)}`
}

export function formatProbability(p: number, digits = 1): string {
  return `${p.toFixed(digits)}%`
}

/**
 * Formats a forecast-commitment amount with the configured native-token
 * symbol (ETH on Robinhood Chain). Native amounts are small, so up to 6
 * fraction digits are shown. Kept named `formatInfer` because it formats the
 * INFER commitment amount, regardless of the underlying asset symbol.
 */
export function formatInfer(amount: number): string {
  return `${amount.toLocaleString("en-US", { maximumFractionDigits: 6 })} ${getTokenSymbol()}`
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US")
}

export function formatDate(iso: string | number): string {
  const d = typeof iso === "number" ? new Date(iso) : new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatDateTime(ms: number): string {
  const d = new Date(ms)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatTime(ms: number): string {
  const d = new Date(ms)
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}
