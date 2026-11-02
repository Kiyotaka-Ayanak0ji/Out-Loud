import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { ProposalTag } from "./Tags";
import { useProfile } from "../context/profile-context";
import { MISSING, PROPOSALS } from "../lib/profile-data";

const DecisionCard = ({ d, idx }) => {
  const [open, setOpen] = useState(idx === 0);
  return <article id={`decision-${idx + 1}`} data-testid={`autopsy-card-${idx + 1}`} className="glass overflow-hidden rounded-2xl transition-colors hover:border-acc/40">
    <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={`decision-body-${idx}`} data-testid={`autopsy-card-toggle-${idx + 1}`} className="flex w-full items-center gap-3 p-5 text-left">
      <span className="text-xs text-acc-soft">{d.id}</span><h3 className="flex-1 font-display text-lg font-semibold text-tx-hi">{d.title || MISSING}</h3>
      <ChevronDown className={`h-4 w-4 flex-none text-tx-low transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div id={`decision-body-${idx}`} className="grid gap-4 border-t border-line/10 p-5" data-testid={`decision-details-${idx + 1}`}>
      {[["Context", d.context], ["Decision", d.decision], ["Reason", d.reason], ["Outcome", d.result], ["Lesson", d.lesson]].map(([label, value]) => <div key={label} className="grid gap-1 sm:grid-cols-[84px_1fr] sm:gap-4"><span className="field-label">{label}</span><p className="text-sm leading-relaxed" data-testid={`decision-${idx + 1}-${label.toLowerCase()}`}>{value || MISSING}</p></div>)}
      <p className="text-xs leading-relaxed text-tx-low" data-testid={`decision-source-${idx + 1}`}>Source: {d.source || MISSING}</p>
      <p className="text-xs text-amb-soft" data-testid={`decision-evidence-${idx + 1}`}>{d.evidence || "Supporting evidence"}: {MISSING}</p>
      <p className="text-xs text-tx-low" data-testid={`decision-audio-${idx + 1}`}>Voice note & transcript: {MISSING}</p>
    </div>}
  </article>;
};
export default function Autopsy() {
  const { profile } = useProfile();
  const a = profile.autopsy;
  return <section id="autopsy" className="py-16 sm:py-24" data-testid="autopsy-section"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader no="01" kicker="The Autopsy" title={a.projectName} desc={a.role} />
    <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">{a.decisions.map((d, i) => <Reveal key={d.id || i}><DecisionCard d={d} idx={i} /></Reveal>)}</div>
    <div className="mt-10 border-y border-tan/25 py-6" data-testid="mistakes-panel"><h3 className="font-display text-lg font-semibold text-tan-soft">Mistakes & changes</h3>
      <div className="mt-5 grid gap-6 md:grid-cols-3">{[a.mistakes, ...(a.additionalMistakes || [])].map((m, i) => <div key={i} data-testid={`mistake-${i + 1}`}><p className="mb-3 text-xs text-tx-low">{String(i + 1).padStart(2, "0")}</p>{[["What happened", m.happened], ["Cost", m.cost], ["Change", m.change]].map(([label, value]) => <p key={label} className="mt-2 text-sm"><span className="text-tx-low">{label}: </span>{value || MISSING}</p>)}</div>)}</div>
    </div>
    <h3 className="mt-10 font-display text-lg font-semibold text-tx-hi">Wispr Flow India experiments</h3>
    <p className="mt-2 text-xs text-tx-low" data-testid="proposal-source">Delivery plan §5.1. Proposals only; thresholds are illustrative, not measured results.</p>
    <div className="mt-5 grid gap-4 lg:grid-cols-3">{PROPOSALS.map((p, i) => <article key={p.id} data-testid={`proposal-card-${i + 1}`} className="rounded-2xl border border-line/10 bg-fill/[0.03] p-5">
      <ProposalTag data-testid={`proposal-status-${i + 1}`} /><h4 className="mt-3 font-display text-lg font-semibold text-tx-hi">{p.title}</h4>
      {[["Hypothesis", p.hypothesis], ["Test", p.test], ["Metric", p.metric], ["Kill criterion", p.kill]].map(([label, text]) => <div key={label} className="mt-4"><p className="field-label">{label}</p><p className="mt-1 text-sm leading-relaxed text-tx-low">{text}</p></div>)}
    </article>)}</div>
  </div></section>;
}