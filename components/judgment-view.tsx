export function JudgmentView() {
  return (
    <section aria-label="Leaderboard" className="border-y border-border">
      <div className="grid grid-cols-[3rem_1fr_auto] gap-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>Rank</span>
        <span>Wallet</span>
        <span>Brier score</span>
      </div>
      <p className="border-t border-border py-8 text-center font-mono text-sm text-muted-foreground">
        Coming soon
      </p>
    </section>
  )
}
