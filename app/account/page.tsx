import type { Metadata } from "next"
import { AccountView } from "@/components/account-view"

export const metadata: Metadata = {
  title: "Account - INFER",
  description: "Your forecast history and on-chain balance.",
}

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Account</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Every row below is a real transaction indexed from Robinhood Chain - there is no separate account system.
      </p>
      <div className="mt-8">
        <AccountView />
      </div>
    </div>
  )
}
