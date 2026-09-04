/**
 * A normalized, validated forecast reconstructed from an EVM transaction on
 * Robinhood Chain. The blockchain is the source of truth: every field here
 * is derived from an on-chain native-value transfer to the treasury whose
 * calldata carries a structured forecast memo.
 */
export type Forecast = {
  /** EVM transaction hash (0x...). */
  txHash: string
  marketId: string
  wallet: string
  probability: number
  amountCommitted: number
  timestamp: number
  blockNumber: number
}

export type MarketAggregate = {
  marketId: string
  /** Mean of each unique wallet's latest valid forecast. */
  currentBelief: number | null
  /** Number of unique wallets that have ever submitted a valid forecast. */
  forecasterCount: number
  /** Total $INFER committed across all valid submissions, ever. */
  totalCommitted: number
  /** Chronological aggregate belief points, replayed from history. */
  history: { timestamp: number; belief: number }[]
  /** Every valid forecast for this market, most recent first. */
  forecasts: Forecast[]
}

export type ForecastsApiResponse = {
  marketId: string
  aggregate: MarketAggregate
  generatedAt: number
  cached: boolean
}
