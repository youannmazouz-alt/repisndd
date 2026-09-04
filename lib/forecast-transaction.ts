import { address as toAddress } from "@solana/kit"
import { getTransferCheckedInstruction } from "@solana-program/token"
import { getAddMemoInstruction } from "@solana-program/memo"
import type { WalletSigner } from "@solana/kit-plugin-wallet"
import { getInferConfig } from "@/lib/env"
import { buildForecastMemo } from "@/lib/forecast-parser"
import { getAssociatedTokenAddress } from "@/lib/token"

/**
 * Builds the two instructions that make up a single forecast transaction:
 *
 *   1. A $INFER token transfer from the signer's associated token account
 *      to the configured treasury token account.
 *   2. A Memo instruction recording `INFER|v1|market=<id>|p=<probability>`.
 *
 * Both instructions are returned together so the caller can submit them as
 * ONE signed Solana transaction. This function never signs or sends
 * anything itself - the connected wallet does that.
 */
export async function buildForecastInstructions(params: {
  signer: WalletSigner
  marketId: string
  probability: number
}) {
  const config = getInferConfig()
  if (!config) {
    throw new Error("INFER is not configured. Add Solana environment variables.")
  }

  const { signer, marketId, probability } = params
  if (!Number.isInteger(probability) || probability < 1 || probability > 99) {
    throw new Error("Probability must be an integer between 1 and 99.")
  }

  const sourceAta = await getAssociatedTokenAddress(signer.address, config.mint)
  const amount = BigInt(Math.round(config.forecastCost * 10 ** config.decimals))

  const transferInstruction = getTransferCheckedInstruction({
    source: sourceAta,
    mint: toAddress(config.mint),
    destination: toAddress(config.treasuryTokenAccount),
    authority: signer,
    amount,
    decimals: config.decimals,
  })

  const memoInstruction = getAddMemoInstruction({
    memo: buildForecastMemo(marketId, probability),
    signers: [signer],
  })

  return [transferInstruction, memoInstruction]
}
