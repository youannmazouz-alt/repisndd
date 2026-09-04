/**
 * All blockchain-specific configuration comes from environment variables.
 * Nothing here is hardcoded. If required variables are missing, the app
 * still renders, but blockchain interaction is disabled and callers must
 * check `isSolanaConfigured()` before touching the chain.
 */

export type SolanaNetwork = "devnet" | "mainnet" | "testnet"

export type SolanaConnectionConfig = {
  network: SolanaNetwork
  rpcUrl: string
}

export type InferConfig = SolanaConnectionConfig & {
  mint: string
  treasuryOwner: string
  treasuryTokenAccount: string
  decimals: number
  forecastCost: number
  appUrl: string
}

function readEnv(key: string): string | undefined {
  const value = process.env[key]
  return value && value.trim().length > 0 ? value.trim() : undefined
}

/**
 * Wallet connection works before the $INFER mint exists. The public devnet
 * endpoint is only a launch-phase fallback; production should provide a
 * dedicated mainnet RPC through NEXT_PUBLIC_SOLANA_RPC_URL.
 */
export function getSolanaConnectionConfig(): SolanaConnectionConfig {
  const rawNetwork = (readEnv("NEXT_PUBLIC_SOLANA_NETWORK") ?? "devnet").toLowerCase()
  const network: SolanaNetwork =
    rawNetwork === "mainnet" || rawNetwork === "testnet" ? rawNetwork : "devnet"
  const fallbackRpc =
    network === "mainnet"
      ? "https://api.mainnet-beta.solana.com"
      : network === "testnet"
        ? "https://api.testnet.solana.com"
        : "https://api.devnet.solana.com"

  return {
    network,
    rpcUrl: readEnv("NEXT_PUBLIC_SOLANA_RPC_URL") ?? fallbackRpc,
  }
}

/**
 * Reads and validates the token-specific configuration. A missing Pump.fun
 * mint disables forecasts and balances, but no longer disables wallet connect.
 */
export function getInferConfig(): InferConfig | null {
  const { network, rpcUrl } = getSolanaConnectionConfig()
  const mint = readEnv("NEXT_PUBLIC_INFER_MINT")
  const treasuryOwner = readEnv("NEXT_PUBLIC_INFER_TREASURY_OWNER")
  const treasuryTokenAccount = readEnv("NEXT_PUBLIC_INFER_TREASURY_TOKEN_ACCOUNT")
  const decimalsRaw = readEnv("NEXT_PUBLIC_INFER_DECIMALS")
  const forecastCostRaw = readEnv("NEXT_PUBLIC_FORECAST_COST")
  const appUrl = readEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000"

  if (!mint || !treasuryOwner || !treasuryTokenAccount) {
    return null
  }

  const decimals = decimalsRaw ? Number.parseInt(decimalsRaw, 10) : 6
  const forecastCost = forecastCostRaw ? Number.parseFloat(forecastCostRaw) : 10

  if (!Number.isFinite(decimals) || decimals < 0 || !Number.isFinite(forecastCost) || forecastCost <= 0) {
    return null
  }

  return {
    network: network === "mainnet" || network === "testnet" ? network : "devnet",
    rpcUrl,
    mint,
    treasuryOwner,
    treasuryTokenAccount,
    decimals,
    forecastCost,
    appUrl,
  }
}

export function isSolanaConfigured(): boolean {
  return getInferConfig() !== null
}

/**
 * The network label is readable even when the rest of the Solana
 * configuration is missing, so the header can always show
 * "SOLANA / DEVNET" (or MAINNET) discreetly.
 */
export function getSolanaNetwork(): "DEVNET" | "MAINNET" | "TESTNET" {
  const raw = (readEnv("NEXT_PUBLIC_SOLANA_NETWORK") ?? "devnet").toLowerCase()
  if (raw === "mainnet") return "MAINNET"
  if (raw === "testnet") return "TESTNET"
  return "DEVNET"
}
