/**
 * Pure parsing for the INFER memo format:
 *
 *   INFER|v1|market=MKT001|p=72
 *
 * This function only parses the memo text. It intentionally does not trust
 * the memo on its own - the caller (lib/forecast-indexer.ts) must also
 * verify the corresponding token transfer before treating a forecast as
 * valid.
 */
export type ParsedMemo = {
  marketId: string
  probability: number
}

const MEMO_PREFIX = "INFER"
const MEMO_VERSION = "v1"

export function buildForecastMemo(marketId: string, probability: number): string {
  return `${MEMO_PREFIX}|${MEMO_VERSION}|market=${marketId}|p=${probability}`
}

export function parseForecastMemo(memo: string): ParsedMemo | null {
  if (typeof memo !== "string") return null

  const parts = memo.trim().split("|")
  if (parts.length !== 4) return null

  const [prefix, version, marketPart, probabilityPart] = parts
  if (prefix !== MEMO_PREFIX || version !== MEMO_VERSION) return null

  const marketMatch = marketPart.match(/^market=([A-Za-z0-9_-]+)$/)
  const probabilityMatch = probabilityPart.match(/^p=(\d{1,2})$/)
  if (!marketMatch || !probabilityMatch) return null

  const probability = Number.parseInt(probabilityMatch[1], 10)
  if (!Number.isInteger(probability) || probability < 1 || probability > 99) return null

  return {
    marketId: marketMatch[1],
    probability,
  }
}
