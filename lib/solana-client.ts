import { createClient } from "@solana/kit"
import { solanaRpc } from "@solana/kit-plugin-rpc"
import { walletSigner } from "@solana/kit-plugin-wallet"
import { getSolanaConnectionConfig, type SolanaNetwork } from "@/lib/env"

function chainFor(network: SolanaNetwork): `solana:${string}` {
  if (network === "mainnet") return "solana:mainnet"
  if (network === "testnet") return "solana:testnet"
  return "solana:devnet"
}

const connection = getSolanaConnectionConfig()

/**
 * The wallet client is always available, including before the Pump.fun mint
 * exists. Token balances and forecast transactions remain independently
 * gated by getInferConfig().
 */
export const inferClient = createClient()
  .use(walletSigner({ chain: chainFor(connection.network) }))
  .use(solanaRpc({ rpcUrl: connection.rpcUrl }))

export type InferClient = typeof inferClient
