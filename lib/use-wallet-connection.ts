"use client"

import { useConnection } from "wagmi"

/**
 * Thin wrapper around wagmi's `useConnection` hook, exposing the connected
 * EVM account and a stable `isReady` flag (false only while wagmi is still
 * reconnecting on first mount). Kept as a small abstraction so components do
 * not depend directly on wagmi's connection shape.
 */
export function useInferWallet(): {
  address: `0x${string}` | undefined
  isConnected: boolean
  isReady: boolean
} {
  const connection = useConnection()

  return {
    address: connection.address,
    isConnected: connection.isConnected,
    isReady: connection.status !== "reconnecting",
  }
}
