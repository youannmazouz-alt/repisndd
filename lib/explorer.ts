import { getEvmConnectionConfig } from "@/lib/env"

/**
 * Block explorer links for the configured EVM chain (Robinhood Chain's
 * Blockscout instance by default). The explorer base URL is env-driven and
 * constant for the app's lifetime, so these helpers read it directly rather
 * than threading a network argument through the UI.
 */
export function explorerTxUrl(hash: string): string {
  return `${getEvmConnectionConfig().explorerUrl}/tx/${hash}`
}

export function explorerAddressUrl(address: string): string {
  return `${getEvmConnectionConfig().explorerUrl}/address/${address}`
}

/** A generic link to the configured chain's block explorer home. */
export function getExplorerHomeUrl(): string {
  return getEvmConnectionConfig().explorerUrl
}
