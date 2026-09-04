import { defineChain } from "viem"
import { getEvmConnectionConfig, getTokenSymbol } from "@/lib/env"

const connection = getEvmConnectionConfig()
const symbol = getTokenSymbol()

/**
 * The Robinhood Chain (or whichever EVM chain the env vars point at),
 * described for viem/wagmi. Robinhood Chain is an Arbitrum Orbit L2 whose
 * native gas token is ETH.
 */
export const inferChain = defineChain({
  id: connection.chainId,
  name: connection.chainName,
  nativeCurrency: {
    name: symbol,
    symbol,
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [connection.rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: connection.explorerUrl,
    },
  },
})
