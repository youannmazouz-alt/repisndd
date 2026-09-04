import { getInferConfig, type SolanaNetwork } from "@/lib/env"

function clusterParam(network: SolanaNetwork): string {
  if (network === "mainnet") return ""
  return `?cluster=${network}`
}

export function explorerTxUrl(signature: string, network: SolanaNetwork): string {
  return `https://explorer.solana.com/tx/${signature}${clusterParam(network)}`
}

export function explorerAddressUrl(address: string, network: SolanaNetwork): string {
  return `https://explorer.solana.com/address/${address}${clusterParam(network)}`
}

/**
 * A generic link to the Solana Explorer cluster the app is currently
 * configured for (falls back to devnet when unconfigured, since the
 * link is only decorative in that case).
 */
export function getExplorerClusterUrl(): string {
  const network = getInferConfig()?.network ?? "devnet"
  return `https://explorer.solana.com/${clusterParam(network) || "?cluster=mainnet"}`
}
