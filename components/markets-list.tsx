"use client"

import { useEffect, useState } from "react"
import { useInferWallet } from "@/lib/use-wallet-connection"

export function MarketsList() {
  const [hydrated, setHydrated] = useState(false)
  const { connected } = useInferWallet()

  useEffect(() => {
    setHydrated(true)
  }, [])

  const walletConnected = hydrated && Boolean(connected)

  return (
    <div className="border-y border-border py-8">
      <p className="font-serif text-xl font-bold text-foreground">No questions yet. Coming soon.</p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {walletConnected
          ? "Your wallet is connected. New research questions will appear here when participation opens."
          : "Connect your wallet to view upcoming questions and participate when the experiment opens."}
      </p>
    </div>
  )
}
