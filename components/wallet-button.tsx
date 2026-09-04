"use client"

import { useEffect, useRef, useState } from "react"
import { useConnect, useDisconnect, useWallets } from "@solana/kit-plugin-wallet/react"
import { inferClient, type InferClient } from "@/lib/solana-client"
import { useInferWallet } from "@/lib/use-wallet-connection"
import { useInferBalance } from "@/hooks/use-infer-balance"
import { formatAddress, formatInfer } from "@/lib/format"

export function WalletButton() {
  return <WalletButtonInner client={inferClient} />
}

function WalletButtonInner({ client }: { client: InferClient }) {
  const [hydrated, setHydrated] = useState(false)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { isReady, connected } = useInferWallet()
  const { balance, loading: balanceLoading } = useInferBalance()
  const wallets = useWallets(client)
  const { dispatch: connect, isRunning: connecting } = useConnect(client)
  const { dispatch: disconnect } = useDisconnect(client)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  if (!hydrated || !isReady) {
    return <span className="font-mono text-xs text-muted-foreground">reading Solana...</span>
  }

  if (!connected) {
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="border border-foreground bg-transparent px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors hover:bg-foreground hover:text-background"
        >
          [ connect wallet ]
        </button>
        {open && (
          <div className="absolute right-0 z-50 mt-1 w-60 border border-foreground bg-popover p-2">
            {wallets.length === 0 ? (
              <p className="px-2 py-2 text-xs leading-relaxed text-muted-foreground">
                No Wallet Standard wallets detected. Install Phantom, Solflare, or Backpack.
              </p>
            ) : (
              <ul className="flex flex-col">
                {wallets.map((wallet) => (
                  <li key={wallet.name}>
                    <button
                      type="button"
                      disabled={connecting}
                      onClick={async () => {
                        try {
                          await connect(wallet)
                          setOpen(false)
                        } catch {
                          // Rejected or aborted - leave the picker open.
                        }
                      }}
                      className="flex w-full items-center justify-between px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-50"
                    >
                      {wallet.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col items-end gap-0.5 text-right hover:opacity-70"
        aria-label="Wallet menu"
      >
        <span className="font-mono text-xs">{formatAddress(connected.account.address)}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {balanceLoading ? "checking balance..." : balance !== null ? formatInfer(balance) : "\u2014"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-64 border border-foreground bg-popover p-3">
          <p className="break-all font-mono text-xs">{connected.account.address}</p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(connected.account.address)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
            className="mt-2 text-xs underline"
          >
            {copied ? "copied" : "copy address"}
          </button>
          <div className="mt-3 border-t border-border pt-2">
            <p className="text-xs text-muted-foreground">$INFER balance</p>
            <p className="font-mono text-sm">
              {balanceLoading ? "checking balance..." : balance !== null ? formatInfer(balance) : "\u2014"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              disconnect()
              setOpen(false)
            }}
            className="mt-3 w-full border border-foreground px-2 py-1 text-xs uppercase tracking-wide hover:bg-foreground hover:text-background"
          >
            disconnect
          </button>
        </div>
      )}
    </div>
  )
}
