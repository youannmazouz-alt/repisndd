"use client"

import { useCallback } from "react"
import { useRequest } from "@solana/react"
import { useInferWallet } from "@/lib/use-wallet-connection"
import { fetchInferBalance } from "@/lib/token"

/**
 * Fetches the connected wallet's real $INFER balance. Uses `useRequest`
 * (from `@solana/react`) rather than a manual `useEffect`, so it fires on
 * mount, re-fires whenever the address changes, and exposes a `refresh()`
 * for the "refresh" affordances the product spec calls for.
 */
export function useInferBalance() {
  const { client, connected } = useInferWallet()
  const address = connected?.account.address

  const fetcher = useCallback(async () => {
    if (!client || !address) return null
    return fetchInferBalance(client, address)
  }, [client, address])

  const source = client && address ? fetcher : null
  const { data, status, refresh } = useRequest(source)

  return {
    balance: data ?? null,
    loading: status === "fetching",
    error: status === "error",
    refresh,
    connected: Boolean(connected),
    address,
  }
}
