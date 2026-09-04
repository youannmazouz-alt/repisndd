/**
 * All blockchain-specific configuration comes from environment variables.
 * Nothing here is hardcoded beyond sensible Robinhood Chain defaults. If the
 * treasury address is missing the app still renders, but forecast
 * submission and indexing are disabled and callers must check
 * `isInferConfigured()` before touching the chain.
 *
 * INFER runs on Robinhood Chain, an EVM Layer 2 (Arbitrum Orbit). The
 * commitment asset is the chain's native token (ETH, 18 decimals) rather
 * than an ERC-20 - a forecast is a native-value transfer to the treasury
 * carrying a structured memo in its calldata.
 */

export type EvmConnectionConfig = {
  chainId: number
  chainName: string
  rpcUrl: string
  explorerUrl: string
  explorerApiUrl: string
}

export type InferConfig = EvmConnectionConfig & {
  /** Treasury EOA that receives forecast commitments. */
  treasury: `0x${string}`
  /** Native token symbol (ETH on Robinhood Chain). */
  tokenSymbol: string
  /** Native token decimals (18 for ETH). */
  decimals: number
  /** Cost of a single forecast submission, denominated in the native token. */
  forecastCost: number
  appUrl: string
  /** Optional WalletConnect project id (enables the WalletConnect connector). */
  walletConnectProjectId?: string
}

// Robinhood Chain mainnet defaults (Arbitrum Orbit L2, native gas token ETH).
const DEFAULT_CHAIN_ID = 4663
const DEFAULT_CHAIN_NAME = "Robinhood Chain"
const DEFAULT_RPC_URL = "https://rpc.mainnet.chain.robinhood.com"
const DEFAULT_EXPLORER_URL = "https://robinhoodchain.blockscout.com"
const DEFAULT_TOKEN_SYMBOL = "ETH"
const DEFAULT_DECIMALS = 18

function readEnv(key: string): string | undefined {
  const value = process.env[key]
  return value && value.trim().length > 0 ? value.trim() : undefined
}

function isEvmAddress(value: string): value is `0x${string}` {
  return /^0x[0-9a-fA-F]{40}$/.test(value)
}

/**
 * Connection-level config is always available, even before a treasury is
 * configured, so the header and explorer links can render.
 */
export function getEvmConnectionConfig(): EvmConnectionConfig {
  const chainIdRaw = readEnv("NEXT_PUBLIC_CHAIN_ID")
  const chainId = chainIdRaw ? Number.parseInt(chainIdRaw, 10) : DEFAULT_CHAIN_ID
  const explorerUrl = readEnv("NEXT_PUBLIC_EXPLORER_URL") ?? DEFAULT_EXPLORER_URL

  return {
    chainId: Number.isFinite(chainId) ? chainId : DEFAULT_CHAIN_ID,
    chainName: readEnv("NEXT_PUBLIC_CHAIN_NAME") ?? DEFAULT_CHAIN_NAME,
    rpcUrl: readEnv("NEXT_PUBLIC_RPC_URL") ?? DEFAULT_RPC_URL,
    explorerUrl,
    explorerApiUrl: readEnv("NEXT_PUBLIC_EXPLORER_API_URL") ?? `${explorerUrl}/api`,
  }
}

/**
 * Reads and validates the treasury-specific configuration. A missing or
 * malformed treasury address disables forecasts and balances, but does not
 * disable wallet connect.
 */
export function getInferConfig(): InferConfig | null {
  const connection = getEvmConnectionConfig()
  const treasury = readEnv("NEXT_PUBLIC_INFER_TREASURY")
  const forecastCostRaw = readEnv("NEXT_PUBLIC_FORECAST_COST")
  const decimalsRaw = readEnv("NEXT_PUBLIC_INFER_DECIMALS")
  const appUrl = readEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000"

  if (!treasury || !isEvmAddress(treasury)) {
    return null
  }

  const decimals = decimalsRaw ? Number.parseInt(decimalsRaw, 10) : DEFAULT_DECIMALS
  const forecastCost = forecastCostRaw ? Number.parseFloat(forecastCostRaw) : 0.001

  if (!Number.isFinite(decimals) || decimals < 0 || !Number.isFinite(forecastCost) || forecastCost <= 0) {
    return null
  }

  return {
    ...connection,
    treasury,
    tokenSymbol: readEnv("NEXT_PUBLIC_TOKEN_SYMBOL") ?? DEFAULT_TOKEN_SYMBOL,
    decimals,
    forecastCost,
    appUrl,
    walletConnectProjectId: readEnv("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"),
  }
}

export function isInferConfigured(): boolean {
  return getInferConfig() !== null
}

/**
 * The chain label is readable even when the treasury is not configured, so
 * the header can always show the network discreetly.
 */
export function getChainLabel(): string {
  return getEvmConnectionConfig().chainName
}

/** Native token symbol, readable without a full treasury config. */
export function getTokenSymbol(): string {
  return readEnv("NEXT_PUBLIC_TOKEN_SYMBOL") ?? DEFAULT_TOKEN_SYMBOL
}
