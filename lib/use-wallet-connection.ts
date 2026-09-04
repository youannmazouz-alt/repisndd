"use client"

import { useConnectedWallet, useIsWalletReady } from "@solana/kit-plugin-wallet/react"
import { inferClient, type InferClient } from "@/lib/solana-client"

/**
 * Thin wrapper around the Kit wallet plugin's React hooks. `inferClient` is
 * a stable module-level value determined by build-time env vars, so this
 * conditional is fixed for the app's lifetime and never toggles at runtime.
 */
export function useInferWallet(): {
  client: InferClient
  isReady: boolean
  connected: ReturnType<typeof useConnectedWallet>
} {
  const isReady = useIsWalletReady(inferClient)
  const connected = useConnectedWallet(inferClient)

  return { client: inferClient, isReady, connected }
}
