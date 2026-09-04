/** Pure formatting helpers. No blockchain or React dependencies. */

/** `7Gxa...91Df` style abbreviation. Never exposes the full address by default. */
export function formatAddress(address: string, lead = 4, trail = 4): string {
  if (address.length <= lead + trail + 3) return address
  return `${address.slice(0, lead)}...${address.slice(-trail)}`
}

export function formatProbability(p: number, digits = 1): string {
  return `${p.toFixed(digits)}%`
}

export function formatInfer(amount: number): string {
  return `${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} INFER`
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
