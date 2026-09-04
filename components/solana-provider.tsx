"use client"

import type React from "react"
import { ClientProvider } from "@solana/react"
import { inferClient } from "@/lib/solana-client"

/** Publishes the module-level Solana Kit client to the React tree. */
export function SolanaProvider({ children }: { children: React.ReactNode }) {
  return <ClientProvider client={inferClient}>{children}</ClientProvider>
}
