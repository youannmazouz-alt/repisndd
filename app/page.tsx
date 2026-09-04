import type { Metadata } from "next"
import Link from "next/link"
import {
  CalibrationChart,
  EvolutionDiagram,
  LifecycleDiagram,
  PremiseFigure,
  RevisionTimeline,
  SystemFlow,
  TokenFlow,
  TransactionFigure,
  ValidationFlow,
} from "@/components/mechanism/mechanism-figures"

export const metadata: Metadata = {
  title: "INFER",
  description: "The complete INFER mechanism: costly probabilistic claims, Robinhood Chain records, belief aggregation, resolution and measurable judgment.",
}

const contents = [
  ["01", "premise"], ["02", "lifecycle"], ["03", "committing a forecast"], ["04", "transaction anatomy"],
  ["05", "aggregating beliefs"], ["06", "belief revision"], ["07", "resolution"], ["08", "judgment"],
  ["09", "role of $INFER"], ["10", "system architecture"], ["11", "limits"], ["12", "hypotheses"], ["13", "where this could lead"],
]

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-8 border-t border-border py-12">
    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Section {number}</p>
    <h2 className="mt-2 font-serif text-2xl font-bold lowercase tracking-tight sm:text-3xl">{number} / {title}</h2>
    <div className="mt-6">{children}</div>
  </section>
}

function Prose({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return <p className={`mt-4 max-w-[700px] text-pretty leading-relaxed ${strong ? "font-serif text-xl text-foreground" : "text-muted-foreground"}`}>{children}</p>
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{children}</p>
}

export default function HomePage() {
  return <article className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
    <header className="pb-12">
      <Label>INFER / MECHANISM</Label>
      <h1 className="mt-3 max-w-[760px] font-serif text-4xl font-bold tracking-tight sm:text-5xl">How INFER works</h1>
      <p className="mt-5 max-w-[680px] text-pretty text-xl leading-relaxed text-muted-foreground">A protocol for costly probabilistic claims, on-chain belief revision, and measurable judgment.</p>

      <nav aria-label="Table of contents" className="mt-10 border-y border-border py-5">
        <Label>Contents</Label>
        <ol className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">{contents.map(([n, title]) => <li key={n}><a href={`#section-${n}`} className="font-mono text-sm">{n} / {title}</a></li>)}</ol>
      </nav>
    </header>

    <Section id="section-01" number="01" title="premise">
      <Prose strong>Most information institutions make speech cheap.</Prose>
      <Prose>That has advantages. It also makes it difficult to distinguish confidence, repetition, status and persuasion from useful information.</Prose>
      <Prose>INFER tests a narrower mechanism: what changes when stating a probabilistic belief requires a small, explicit economic commitment?</Prose>
      <PremiseFigure />
    </Section>

    <Section id="section-02" number="02" title="lifecycle">
      <Prose>The mechanism links a resolvable question, a probability and an economic commitment in one auditable sequence. Select a stage to inspect its function.</Prose>
      <LifecycleDiagram />
      <div className="border-l-2 border-foreground pl-4"><Prose>The chain does not decide which forecast is correct. It preserves what was claimed, when it was claimed, and what economic commitment accompanied it. Reality supplies the final comparison.</Prose></div>
    </Section>

    <Section id="section-03" number="03" title="committing a forecast">
      <div className="grid gap-8 md:grid-cols-2">
        <div><Label>Illustrative example / question</Label><p className="mt-3 font-serif text-xl">Will event X resolve YES before September 30?</p><dl className="mt-6 border-y border-border font-mono text-sm"><div className="flex justify-between border-b border-border py-3"><dt>Alice&apos;s estimate</dt><dd>72%</dd></div><div className="flex justify-between border-b border-border py-3"><dt>Forecast cost</dt><dd>1 INFER</dd></div><div className="flex justify-between py-3"><dt>Wallet</dt><dd>0x7Gxa...91Df [synthetic]</dd></div></dl></div>
        <div className="border border-border p-5 font-mono text-center text-sm"><p>ALICE / WALLET</p><p className="py-3 text-muted-foreground">│ selects<br/>↓</p><p className="text-3xl font-bold">72%</p><p className="py-3 text-muted-foreground">│ BACK THIS BELIEF<br/>↓</p><p className="border border-foreground bg-section p-3">1 INFER COMMITMENT</p></div>
      </div>
      <Prose>The commitment does not make Alice&apos;s forecast true. It creates a measurable cost for submitting the claim.</Prose>
      <div className="mt-6 max-w-[700px] border-y border-border font-mono text-sm"><div className="grid grid-cols-2 border-b border-border py-3"><span>belief content</span><strong>72%</strong></div><div className="grid grid-cols-2 py-3"><span>belief commitment</span><strong>1 INFER</strong></div></div>
      <Prose>One wallet may forecast multiple times. Each revision costs another INFER. Repeated payments do not create repeated voting weight.</Prose>
    </Section>

    <Section id="section-04" number="04" title="transaction anatomy">
      <Prose>A valid submission is one Robinhood Chain transaction that carries both a native-asset transfer to the treasury and a structured forecast memo in its calldata.</Prose>
      <TransactionFigure />
      <ValidationFlow />
      <p className="border-y border-foreground py-5 text-center font-serif text-xl font-bold">INFER validates commitment and claim together.</p>
    </Section>

    <Section id="section-05" number="05" title="aggregating beliefs">
      <Prose>Each wallet contributes exactly one current forecast. Its latest valid forecast replaces its previous forecast for aggregation purposes.</Prose>
      <div className="mt-7 grid gap-6 md:grid-cols-2"><div className="border border-border p-5 font-mono text-sm"><Label>Illustrative dataset</Label><div className="mt-4 grid grid-cols-2 gap-y-2"><span>Alice</span><span>72%</span><span>Bob</span><span>55%</span><span>Charlie</span><span>81%</span><span>David</span><span>60%</span></div></div><div className="border border-border bg-section p-5 text-center"><Label>Equal-wallet aggregate</Label><p className="mt-6 font-serif text-xl">P<sub>market</sub> = (72 + 55 + 81 + 60) / 4</p><p className="mt-5 font-mono text-3xl font-bold">67%</p></div></div>
      <div className="mt-8 grid gap-6 md:grid-cols-2"><div className="border border-border p-5 font-mono text-sm"><strong>ALICE / REVISION HISTORY</strong><p className="mt-4 text-muted-foreground line-through">t1 / 72%</p><p className="mt-2 text-muted-foreground line-through">t2 / 68%</p><p className="mt-2">t3 / 61% ← CURRENT</p></div><div className="border border-border p-5 font-mono text-sm"><strong>AGGREGATE USES</strong><p className="mt-4">Alice 61% + Bob 55% + Charlie 81%</p><p className="mt-4 text-muted-foreground line-through">NOT 72 + 68 + 61 + 55 + 81</p></div></div>
      <p className="mt-7 border-y border-foreground py-5 text-center font-serif text-xl font-bold">Historical forecasts remain on-chain. Historical influence does not.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="border border-border p-5"><Label>Wallet A</Label><p className="mt-3 font-mono">balance / 100,000 INFER<br/>forecast / 70%<br/>contribution / 70% × 1</p></div><div className="border border-border p-5"><Label>Wallet B</Label><p className="mt-3 font-mono">balance / 5 INFER<br/>forecast / 60%<br/>contribution / 60% × 1</p></div></div>
      <Prose strong>INFER balance does not multiply epistemic weight.</Prose><Prose>$INFER is a commitment asset. It is not a truth-weighting asset.</Prose>
    </Section>

    <Section id="section-06" number="06" title="belief revision">
      <Prose>Changing one&apos;s mind is not an error. It is information. Every revision changes current derived state while preserving prior claims.</Prose>
      <RevisionTimeline />
      <div className="grid gap-4 sm:grid-cols-2"><div className="border border-border p-5"><Label>1 / Epistemic history</Label><p className="mt-3 text-sm text-muted-foreground">How a forecaster&apos;s probability changed.</p></div><div className="border border-border p-5"><Label>2 / Economic history</Label><p className="mt-3 text-sm text-muted-foreground">How often they were willing to pay to revise it.</p></div></div>
      <p className="mt-6 border-y border-border py-4 text-center font-mono text-sm">belief state at time t = latest valid forecast before t</p>
    </Section>

    <Section id="section-07" number="07" title="resolution">
      <div className="grid gap-4 sm:grid-cols-2"><div className="border border-border p-5 text-center font-mono text-xl">YES → o = 1</div><div className="border border-border p-5 text-center font-mono text-xl">NO → o = 0</div></div>
      <Prose>In version 0.1, questions use predefined resolution criteria. Resolved outcomes are confirmed manually in market configuration according to those published criteria. A later design can use deterministic on-chain data or oracle-based resolution.</Prose>
      <div className="mt-8 flex flex-col items-stretch gap-2 text-center font-mono text-xs sm:flex-row sm:items-center"><div className="border border-border p-3">QUESTION CREATED</div><span>→</span><div className="border border-border p-3">RULE PUBLISHED</div><span>→</span><div className="border border-border p-3">OBSERVATION DATE</div><span>→</span><div className="border border-foreground bg-section p-3">OUTCOME = 0 OR 1</div></div>
      <div className="mt-7 border border-border p-5"><Label>Illustrative example</Label><dl className="mt-4 grid grid-cols-[9rem_1fr] gap-y-2 text-sm"><dt className="text-muted-foreground">Question</dt><dd>Will X exceed Y at time T?</dd><dt className="text-muted-foreground">Reference</dt><dd>Source S</dd><dt className="text-muted-foreground">Observation</dt><dd>X = 241</dd><dt className="text-muted-foreground">Threshold</dt><dd>Y = 250</dd><dt className="text-muted-foreground">Result</dt><dd className="font-mono font-bold">NO / 0</dd></dl></div>
    </Section>

    <Section id="section-08" number="08" title="judgment">
      <p className="border-y border-border bg-section py-7 text-center font-serif text-3xl">BS = (p − o)²</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="border border-border p-5"><Label>Forecaster A</Label><p className="mt-3 font-mono">Forecast 80%<br/>Outcome YES<br/><br/>(0.80 − 1)² = 0.040</p></div><div className="border border-border p-5"><Label>Forecaster B</Label><p className="mt-3 font-mono">Forecast 55%<br/>Outcome YES<br/><br/>(0.55 − 1)² = 0.203</p></div></div>
      <Prose>A was better calibrated on this question. Lower Brier Score is better. A single good prediction does not establish skill; judgment becomes informative across repeated resolved forecasts.</Prose>
      <div className="mt-6"><div className="flex justify-between font-mono text-xs"><span>BETTER / 0.00</span><span>1.00 / WORSE</span></div><div className="mt-2 h-px bg-foreground"/></div>
      <p className="mt-8 border-y border-border py-6 text-center font-serif text-xl">BS<sub>i</sub> = (1 / N) Σ<sub>t=1</sub><sup>N</sup> (p<sub>it</sub> − o<sub>t</sub>)²</p>
      <CalibrationChart />
      <div className="grid gap-4 sm:grid-cols-2"><p className="border border-border p-4"><strong className="font-mono">Accuracy asks</strong><br/><span className="text-muted-foreground">Were you right?</span></p><p className="border border-border p-4"><strong className="font-mono">Calibration asks</strong><br/><span className="text-muted-foreground">Did your probabilities correspond to reality?</span></p></div>
    </Section>

    <Section id="section-09" number="09" title="role of $INFER">
      <Prose strong>Why not submit forecasts for free?</Prose><Prose>They could be. INFER intentionally tests a different institution. The token creates a standardized economic cost for submitting or revising a probabilistic claim.</Prose>
      <TokenFlow />
      <h3 className="mt-10 font-serif text-2xl font-bold">What $INFER does not do</h3>
      <div className="mt-5 border-y border-border">{[["Does $INFER determine truth?","NO"],["Does holding more $INFER give forecasts more weight?","NO"],["Does $INFER represent a vote over outcomes?","NO"],["Does paying more make a forecast automatically better?","NO"],["Does $INFER create an explicit cost for making or revising a claim?","YES"]].map(([q,a])=><div key={q} className="grid grid-cols-[1fr_auto] gap-4 border-b border-border py-3 last:border-b-0"><span>{q}</span><strong className="font-mono">{a}</strong></div>)}</div>
      <Prose strong>The token creates commitment. Reality still determines outcomes.</Prose>
    </Section>

    <Section id="section-10" number="10" title="system architecture">
      <Prose>The application constructs evidence on Robinhood Chain, then derives current belief and judgment state without overwriting the event history.</Prose>
      <SystemFlow />
      <div className="grid gap-4 md:grid-cols-3"><pre className="overflow-x-auto border border-border p-4 text-xs">{`Forecast {\n txHash\n marketId\n wallet\n probability\n amountCommitted\n timestamp\n blockNumber\n}`}</pre><pre className="overflow-x-auto border border-border p-4 text-xs">{`Market {\n id\n question\n closesAt\n resolutionRule\n status\n resolvedOutcome\n}`}</pre><pre className="overflow-x-auto border border-border p-4 text-xs">{`CurrentBelief {\n marketId\n uniqueForecasters\n aggregateProbability\n totalCommitted\n}`}</pre></div>
      <p className="mt-7 border-y border-foreground py-5 text-center font-serif text-lg font-bold">Forecast and token transfer are raw chain evidence. CurrentBelief is derived state.</p>
      <div className="mt-8 flex flex-col items-stretch gap-2 text-center font-mono text-xs sm:flex-row sm:items-center"><div className="border border-border p-3">CHAIN EVENTS</div><span>→</span><div className="border border-border p-3">VALIDATION</div><span>→</span><div className="border border-border p-3">LATEST / WALLET + FULL HISTORY</div><span>→</span><div className="border border-border p-3">RESOLUTION</div><span>→</span><div className="border border-foreground bg-section p-3">BRIER SCORES</div></div>
      <Prose>The protocol does not overwrite history. It derives current state from immutable events.</Prose>
    </Section>

    <Section id="section-11" number="11" title="limits">
      <Prose>INFER is an experiment, not a solved information institution. Its weaknesses should remain inspectable.</Prose>
      <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead><tr className="border-y border-border font-mono text-xs"><th className="py-3 pr-5">PROBLEM</th><th className="py-3">CURRENT MVP RESPONSE</th></tr></thead><tbody>{[["Sybil wallets","Not solved"],["Wealth selection","Explicitly measurable"],["Poor question wording","Published resolution rules"],["Thin participation","Show forecaster count"],["Repeated forecasts","Latest / wallet only"],["Fake memo","Verify native transfer"],["Fake payment","Verify value + treasury"],["Oracle ambiguity","Manual predefined resolution"],["Wallet ≠ person","Explicit limitation"],["Collusion","Not solved"],["Token speculation","Not required for scoring logic"]].map(([a,b])=><tr key={a} className="border-b border-border"><td className="py-3 pr-5">{a}</td><td className="py-3 text-muted-foreground">{b}</td></tr>)}</tbody></table></div>
      <div className="mt-8 grid gap-5 md:grid-cols-3"><div><Label>Sybil resistance</Label><Prose>One wallet is not one human. Repeated submissions cannot add weight, but one person can create several wallets. Version 0.1 does not solve this.</Prose></div><div><Label>Wealth selection</Label><Prose>A cost may select for willingness or ability to pay rather than information. This is a hypothesis to measure, not assume away.</Prose></div><div><Label>Token speculation</Label><Prose>Price volatility changes the real forecast cost. A future version could denominate cost against a stable reference.</Prose></div></div>
    </Section>

    <Section id="section-12" number="12" title="hypotheses">
      <div className="border-y border-border">{[["H0","Adding an explicit economic cost does not improve forecast quality."],["H1","A small cost reduces low-information submissions and improves aggregate calibration."],["H2","Costs mainly select for wealth or conviction, not information."],["H3","Belief revision frequency contains information about uncertainty and new evidence."],["H4","Public forecasting histories create a useful measure of judgment over repeated questions."]].map(([h,t])=><div key={h} className="grid gap-2 border-b border-border py-5 last:border-0 sm:grid-cols-[4rem_1fr]"><strong className="font-mono">{h}</strong><p className="max-w-[650px] text-muted-foreground">{t}</p></div>)}</div>
      <Prose>INFER is useful even if some hypotheses fail. A mechanism that can be measured can also be rejected.</Prose><p className="mt-7 font-serif text-3xl font-bold">The question is empirical.</p>
    </Section>

    <Section id="section-13" number="13" title="where this could lead">
      <Label>Future mechanism research / not currently implemented</Label>
      <div className="mt-6 grid gap-8 md:grid-cols-[.8fr_1.2fr]"><EvolutionDiagram /><div><Prose>INFER begins with a deliberately narrow primitive: record costly probabilistic claims and measure them.</Prose><Prose>A future version could introduce market making, information subsidies, conditional estimates and decision markets. Those mechanisms should be added only when the simpler experiment is understood.</Prose><div className="mt-7 border border-border p-5"><p className="text-muted-foreground">Instead of: Will proposal A pass?</p><p className="mt-4 font-serif text-xl">E[metric | A passes]</p><p className="my-2 font-mono text-xs text-muted-foreground">VERSUS</p><p className="font-serif text-xl">E[metric | A fails]</p><p className="mt-5 border-t border-border pt-4">The first predicts politics. The second estimates consequences.</p></div></div></div>
    </Section>

    <section className="border-t border-border py-12"><Label>One-screen summary</Label><h2 className="mt-2 font-serif text-3xl font-bold">INFER in one diagram</h2><SystemFlow master /><p className="text-center font-mono text-sm leading-loose">Opinion ↓ Cost ↓ Record ↓ Aggregate ↓ Resolve ↓ Measure</p><p className="mt-5 text-center font-serif text-3xl font-bold">That is INFER.</p></section>

    <section className="border-y border-border py-12"><h2 className="font-serif text-3xl font-bold">What does INFER claim?</h2><div className="mt-6 max-w-[700px]"><Prose>Not that costly forecasts are necessarily better.</Prose><Prose>Not that token holders know more.</Prose><Prose>Not that markets automatically discover truth.</Prose><Prose strong>Only that probabilistic claims can be made explicit, costly, persistent and measurable.</Prose><Prose>Whether this produces better information is an empirical question.</Prose></div><nav aria-label="Further reading" className="mt-8 flex flex-wrap gap-5 font-mono text-sm"><Link href="/markets">view open questions</Link><Link href="/methods">inspect methodology</Link><Link href="/token">view $INFER</Link></nav></section>
  </article>
}
