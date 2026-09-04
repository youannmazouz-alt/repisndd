"use client"

import { address as toAddress, type Address } from "@solana/kit"
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token"
import { getInferConfig } from "@/lib/env"
import type { InferClient } from "@/lib/solana-client"

export async function getAssociatedTokenAddress(owner: string, mint: string): Promise<Address> {
  const [ata] = await findAssociatedTokenPda({
    owner: toAddress(owner),
    mint: toAddress(mint),
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  })
  return ata
}

/**
 * Fetches a wallet's real $INFER balance from Solana. Returns `0` (not an
 * error) when the wallet has no associated token account for the mint -
 * that is a normal state, not a failure. Returns `null` only when the app
 * is not configured or the RPC call itself fails, so callers can
 * distinguish "no tokens" from "could not check."
 */
export async function fetchInferBalance(client: InferClient, owner: string): Promise<number | null> {
  const config = getInferConfig()
  if (!config) return null

  try {
    const ata = await getAssociatedTokenAddress(owner, config.mint)
    const result = await client.rpc.getTokenAccountBalance(ata).send()
    if (result.value.uiAmount !== null && result.value.uiAmount !== undefined) {
      return result.value.uiAmount
    }
    return Number(result.value.amount) / 10 ** result.value.decimals
  } catch {
    // Missing associated token account (or any lookup failure) reads as 0,
    // never a fabricated balance.
    return 0
  }
}
