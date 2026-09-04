import { createSolanaRpc } from "@solana/kit"
import { getInferConfig } from "@/lib/env"

/**
 * Server-only, read-only Solana RPC client used for indexing. Deliberately
 * does not include any wallet or signing capability - the server never
 * signs or sends transactions on a user's behalf.
 */
export function getServerRpc() {
  const config = getInferConfig()
  if (!config) return null
  return createSolanaRpc(config.rpcUrl)
}
