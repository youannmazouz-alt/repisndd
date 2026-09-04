"use client"

import { useState } from "react"

const stroke = "var(--border)"
const ink = "var(--foreground)"
const muted = "var(--muted-foreground)"
const paper = "var(--background)"
const section = "var(--section)"

function Figure({ number, caption, children, wide = false }: { number: number; caption: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <figure className="my-8">
      <div className={wide ? "overflow-x-auto border border-border bg-background p-3" : "border border-border bg-background p-3"}>
        {wide && <p className="mb-2 text-center font-mono text-[11px] text-muted-foreground sm:hidden">← scroll diagram →</p>}
        {children}
      </div>
      <figcaption className="mt-2 font-serif text-xs leading-relaxed text-muted-foreground">Figure {number}. {caption}</figcaption>
    </figure>
  )
}

function Box({ x, y, w, h, title, lines = [], dashed = false }: { x: number; y: number; w: number; h: number; title: string; lines?: string[]; dashed?: boolean }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="1" fill={paper} stroke={stroke} strokeWidth="1.5" strokeDasharray={dashed ? "5 4" : undefined} />
    <text x={x + w / 2} y={y + 22} textAnchor="middle" fill={ink} fontFamily="ui-monospace, monospace" fontSize="12" fontWeight="700">{title}</text>
    {lines.map((line, i) => <text key={line} x={x + w / 2} y={y + 42 + i * 16} textAnchor="middle" fill={muted} fontFamily="Arial, sans-serif" fontSize="11">{line}</text>)}
  </g>
}

function ArrowDefs() {
  return <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={stroke} /></marker></defs>
}

function Line({ x1, y1, x2, y2, dashed = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1.5" strokeDasharray={dashed ? "5 4" : undefined} markerEnd="url(#arrow)" />
}

export function PremiseFigure() {
  return <Figure number={1} caption="INFER turns an ephemeral opinion into a timestamped, economically costly and eventually measurable claim." wide>
    <svg viewBox="0 0 760 390" role="img" aria-label="Free opinion compared with a costly forecast" className="h-auto min-w-[620px] w-full"><ArrowDefs />
      <text x="380" y="26" textAnchor="middle" fill={muted} fontFamily="Georgia, serif" fontSize="14">versus</text>
      <Box x={40} y={50} w={250} h={76} title="FREE OPINION" lines={['“I think X will happen.”']} />
      <Line x1={165} y1={126} x2={165} y2={178} /><text x="177" y="157" fill={muted} fontSize="10">no measurable cost</text>
      <Box x={40} y={180} w={250} h={105} title="SOCIAL SIGNALS" lines={["confidence · attention", "status · repetition"]} />
      <Box x={470} y={50} w={250} h={76} title="COSTLY FORECAST" lines={["P(X) = 72%"]} />
      <Line x1={595} y1={126} x2={595} y2={162} /><text x="607" y="150" fill={muted} fontSize="10">1 $INFER</text>
      <Box x={470} y={164} w={250} h={90} title="ON-CHAIN RECORD" lines={["timestamp · wallet", "probability"]} />
      <Line x1={595} y1={254} x2={595} y2={286} /><Box x={470} y={288} w={250} h={48} title="REALITY RESOLVES" />
      <Line x1={595} y1={336} x2={595} y2={365} /><text x="595" y="382" textAnchor="middle" fill={ink} fontFamily="ui-monospace, monospace" fontSize="12" fontWeight="700">JUDGMENT CAN BE MEASURED</text>
    </svg>
  </Figure>
}

const lifecycle = [
  ["forecast", "RESOLVABLE QUESTION", "Will X happen before T?"],
  ["estimate", "FORECASTER ESTIMATE", "P(X) = 72%"],
  ["commit", "ECONOMIC COMMITMENT", "1 $INFER"],
  ["record", "SOLANA TRANSACTION", "transfer + memo"],
  ["validate", "FORECAST VALIDATION", "claim and payment match"],
  ["aggregate", "AGGREGATE BELIEF", "latest forecast / wallet"],
  ["resolve", "QUESTION RESOLVES", "outcome ∈ {0,1}"],
  ["score", "BRIER SCORE", "BS = (p − o)²"],
] as const
const notes: Record<string, string> = {
  forecast: "A question must be objectively resolvable under a rule published in advance.", estimate: "The forecaster states uncertainty as a probability, not a categorical claim.", commit: "A standardized token cost accompanies every submission and revision.", record: "One transaction carries both the SPL token transfer and structured memo.", validate: "The indexer accepts neither evidence in isolation.", aggregate: "Each wallet contributes one current belief, regardless of balance or revisions.", resolve: "A published rule maps observed reality to a binary outcome.", score: "The forecast is compared with reality using a proper scoring rule."
}
export function LifecycleDiagram() {
  const [active, setActive] = useState("forecast")
  return <Figure number={2} caption="Complete forecast lifecycle. Labels distinguish user action, chain evidence, protocol calculation and resolution." wide>
    <div className="min-w-[760px]">
      <div className="flex items-stretch gap-2" role="list" aria-label="INFER forecast lifecycle">
        {lifecycle.map(([id, title, detail], index) => <div key={id} className="flex flex-1 items-center gap-2">
          <button type="button" onClick={() => setActive(id)} className={`min-h-28 w-full border p-2 text-left transition-colors ${active === id ? "border-foreground bg-section" : "border-border bg-background"}`}>
            <span className="block font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, "0")} / {index < 3 ? "USER" : index === 3 ? "CHAIN" : index < 6 ? "PROTOCOL" : index === 6 ? "RESOLUTION" : "MEASUREMENT"}</span>
            <span className="mt-3 block font-mono text-xs font-bold">{title}</span><span className="mt-2 block text-xs text-muted-foreground">{detail}</span>
          </button>{index < lifecycle.length - 1 && <span aria-hidden="true" className="font-mono text-muted-foreground">→</span>}
        </div>)}
      </div>
      <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground"><span className="font-mono text-foreground">{active}</span> / {notes[active]}</p>
    </div>
  </Figure>
}

export function TransactionFigure() {
  return <Figure number={3} caption="Illustrative transaction anatomy. Every address, signature, slot and amount below is synthetic.">
    <div className="font-mono text-xs leading-relaxed">
      <div className="border border-border p-4"><div className="flex justify-between gap-4 border-b border-border pb-3"><strong>SOLANA TRANSACTION</strong><span className="text-muted-foreground">ILLUSTRATIVE</span></div>
        <dl className="mt-3 grid grid-cols-[7rem_1fr] gap-y-1"><dt className="text-muted-foreground">signature</dt><dd>5JxK...4Pa [synthetic]</dd><dt className="text-muted-foreground">slot</dt><dd>327,184,991 [example]</dd><dt className="text-muted-foreground">timestamp</dt><dd>23 Aug 2026 21:07 UTC [example]</dd></dl>
        <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="border border-border p-3"><strong>INSTRUCTION 01 / SPL TRANSFER</strong><p className="mt-3 text-muted-foreground">source</p><p>Alice INFER ATA / synthetic</p><p className="mt-2 text-muted-foreground">amount</p><p>1.000000000 INFER</p><p className="mt-2 text-muted-foreground">destination</p><p>INFER Treasury ATA / synthetic</p></div><div className="border border-border p-3"><strong>INSTRUCTION 02 / MEMO</strong><p className="mt-3 break-all">INFER|v1|market=MKT001|p=72</p></div></div>
        <p className="mt-3"><span className="text-muted-foreground">STATUS</span> confirmed [illustrative]</p>
      </div><p className="mt-3 text-muted-foreground">latest valid forecast transaction / No live transaction available yet.</p>
    </div>
  </Figure>
}

export function ValidationFlow() {
  const checks = ["Has INFER memo?", "Valid market ID?", "1 ≤ probability ≤ 99?", "INFER transfer exists?", "Correct mint?", "Correct treasury?", "Amount ≥ forecast cost?"]
  return <Figure number={4} caption="A memo alone is not a forecast. INFER validates commitment and claim together." wide>
    <div className="flex min-w-[760px] items-center gap-2 py-4 font-mono text-xs"><div className="border border-border p-3 font-bold">RAW SOLANA TX</div><span>→</span>{checks.map((check, i) => <div key={check} className="flex items-center gap-2"><div className="border border-border p-3"><span>{check}</span><span className="mt-2 block text-[10px] text-muted-foreground">NO → REJECT</span></div>{i < checks.length - 1 && <span>→</span>}</div>)}<span>→</span><div className="border border-foreground bg-section p-3 font-bold">VALID FORECAST</div></div>
  </Figure>
}

export function RevisionTimeline() {
  return <Figure number={5} caption="Belief revision preserves epistemic history and economic history simultaneously.">
    <div className="grid gap-3 font-mono text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center"><div className="border border-border p-4"><span className="text-muted-foreground">23 AUG</span><strong className="mt-2 block text-xl">72%</strong><span>1 INFER</span></div><span>→</span><div className="border border-border p-4"><span className="text-muted-foreground">25 AUG</span><strong className="mt-2 block text-xl">68%</strong><span>1 INFER</span></div><span>→</span><div className="border border-foreground bg-section p-4"><span className="text-muted-foreground">27 AUG</span><strong className="mt-2 block text-xl">61%</strong><span>CURRENT / 3 INFER TOTAL</span></div></div>
  </Figure>
}

export function CalibrationChart() {
  const points = [[110,220],[160,190],[210,160],[260,130],[310,100],[360,70],[410,40]]
  return <Figure number={6} caption={'A perfectly calibrated forecaster who repeatedly says “70%” should be correct roughly 70% of the time.'}>
    <svg viewBox="0 0 500 280" className="h-auto w-full" role="img" aria-label="Calibration chart"><line x1="70" y1="235" x2="455" y2="235" stroke={stroke}/><line x1="70" y1="235" x2="70" y2="25" stroke={stroke}/><line x1="70" y1="235" x2="430" y2="35" stroke={muted} strokeDasharray="5 4"/><text x="250" y="270" textAnchor="middle" fill={muted} fontSize="11">PREDICTED PROBABILITY</text><text x="15" y="130" transform="rotate(-90 15 130)" textAnchor="middle" fill={muted} fontSize="11">OBSERVED FREQUENCY</text>{points.map(([x,y])=><circle key={x} cx={x} cy={y} r="4" fill={ink}/>)}</svg>
  </Figure>
}

export function SystemFlow({ master = false }: { master?: boolean }) {
  const items = master ? ["FORECASTER\nP(X)=72%", "SOLANA TX\n1 INFER + memo", "LEDGER\nimmutable", "VALIDATION", "LATEST / WALLET", "AGGREGATE\n67.3%", "REALITY\noutcome {0,1}", "BRIER SCORE"] : ["WALLETS", "INFER WEB APP\nNext.js / Vercel", "TRANSACTION BUILDER", "SPL TRANSFER + MEMO", "SOLANA NETWORK", "INDEXER\nparse · validate · normalize", "FORECAST STATE", "RESOLUTION", "BRIER SCORE", "JUDGMENT TABLE"]
  return <Figure number={master ? 11 : 8} caption={master ? "INFER in one diagram: opinion, cost, record, aggregation, resolution and measurement." : "Full system architecture from client wallets to judgment measurement."} wide>
    <svg viewBox={`0 0 ${items.length * 155 + 30} 190`} className="h-[190px] min-w-[980px] w-full" role="img" aria-label={master ? "INFER master diagram" : "INFER system architecture"}><ArrowDefs />{items.map((item,i)=><g key={item}><Box x={20+i*155} y={55} w={130} h={76} title={item.split("\n")[0]} lines={item.split("\n").slice(1)} dashed={i===5 && !master}/>{i<items.length-1&&<Line x1={150+i*155} y1={93} x2={172+i*155} y2={93}/>}</g>)}</svg>
  </Figure>
}

export function TokenFlow() {
  return <Figure number={7} caption="Solid lines carry value. Dashed lines carry information.">
    <div className="grid gap-4 font-mono text-xs md:grid-cols-2"><div className="border border-border p-4"><strong>INITIAL SUPPLY / 100,000,000</strong><ul className="mt-3 flex flex-col gap-2 text-muted-foreground"><li>├── forecasting rewards</li><li>├── information experiments</li><li>├── treasury</li><li>└── contributors</li></ul></div><div className="border border-border p-4"><strong>FORECASTER</strong><p className="mt-4">├──── 1 INFER ────→ TREASURY</p><p className="mt-3">└┄┄ 72% belief ┄┄→ AGGREGATE</p><p className="mt-5 text-muted-foreground">──── value transfer<br/>┄┄┄ information</p></div></div>
  </Figure>
}

export function EvolutionDiagram() {
  const steps=["COSTLY FORECASTS","CALIBRATION","FORECASTING REWARDS","SPONSORED INFORMATION MARKETS","CONDITIONAL MARKETS","DECISION MARKETS","FUTARCHY-LIKE GOVERNANCE"]
  return <Figure number={10} caption="A possible research sequence, not a product roadmap."><div className="flex flex-col items-stretch font-mono text-xs">{steps.map((s,i)=><div key={s} className="text-center"><div className="border border-border p-3">{s}</div>{i<steps.length-1&&<div className="py-1 text-muted-foreground">↓</div>}</div>)}</div></Figure>
}
