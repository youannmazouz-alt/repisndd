"use client"

import { useConnection, useBalance } from "wagmi"

/**
 * Fetches the connected wallet's real native-token (ETH) balance on the
 * configured chain via wagmi's `useBalance`. Returns the balance as a
 * human-readable number, exposes a `refresh()` for post-transaction
 * refetches, and never fabricates a value.
 */
export function useInferBalance() {
  const { address, isConnected } = useConnection()
  const { data, isLoading, isError, refetch } = useBalance({
    address,
    query: { enabled: Boolean(address) },
  })

  const balance = data ? Number(data.value) / 10 ** data.decimals : null

  return {
    balance,
    loading: isLoading,
    error: isError,
    refresh: refetch,
    connected: isConnected,
    address,
  }
}
