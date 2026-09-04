import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
        <div className="font-serif text-lg font-bold uppercase tracking-tight text-foreground">INFER</div>
        <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-muted-foreground">
          this is an independent Web3 research experiment exploring whether costly, public forecasts can improve
          how beliefs are stated, compared, and judged over time.
        </p>

        <nav aria-label="Robin Hanson profiles" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
          <Link
            href="https://quora.com/profile/Robin-Hanson"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-link"
          >
            Robin Hanson on Quora
          </Link>
          <Link
            href="https://x.com/robinhanson"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-link"
          >
            Robin Hanson on X
          </Link>
        </nav>
      </div>
    </footer>
  )
}
