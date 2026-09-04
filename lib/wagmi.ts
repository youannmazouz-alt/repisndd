import { createConfig, http, cookieStorage, createStorage } from "wagmi"
import { injected, walletConnect } from "wagmi/connectors"
import { getEvmConnectionConfig, getInferConfig } from "@/lib/env"
import { inferChain } from "@/lib/chain"

const connection = getEvmConnectionConfig()
const walletConnectProjectId = getInferConfig()?.walletConnectProjectId

/**
 * The wagmi client is always available, including before the treasury is
 * configured. The injected connector covers MetaMask, Rabby and any other
 * EIP-1193 browser wallet; WalletConnect is added only when a project id is
 * provided. `ssr: true` + cookie storage keep the connection stable across
 * Next.js server rendering.
 */
export const wagmiConfig = createConfig({
  chains: [inferChain],
  connectors: [
    injected({ shimDisconnect: true }),
    ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
  ],
  transports: {
    [inferChain.id]: http(connection.rpcUrl),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
})

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig
  }
}
