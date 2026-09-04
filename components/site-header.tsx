import Image from "next/image"
import Link from "next/link"
import { WalletButton } from "@/components/wallet-button"

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/markets", label: "questions" },
  { href: "/judgment", label: "judgment" },
  { href: "/token", label: "token" },
  { href: "/methods", label: "methods" },
  { href: "/about", label: "about" },
]

export function SiteHeader() {

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[960px] flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/images/infer-mark.jpeg"
              alt="INFER geometric mark"
              width={40}
              height={40}
              priority
              className="size-10 shrink-0 object-cover object-center"
            />
            <div>
              <div className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground">INFER</div>
              <div className="font-mono text-[11px] lowercase tracking-tight text-muted-foreground">
                an experiment in costly beliefs
              </div>
            </div>
          </Link>

          <div className="flex flex-col items-end gap-1.5">
            <WalletButton />
          </div>
        </div>

        <nav aria-label="Primary" className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-2.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[13px] text-foreground underline-offset-2 hover:text-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
