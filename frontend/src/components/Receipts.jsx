import { SectionHeader } from "./Reveal";
import { useProfile } from "../context/profile-context";
import { MISSING, TALK } from "../lib/profile-data";

export default function Receipts() {
  const { profile } = useProfile();
  return <section id="receipts" className="py-16 sm:py-24" data-testid="receipts-section"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader no="04" kicker="Voice Receipts" title="The spoken record" accent="amber" />
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{profile.receipts.map((r, i) => <article key={i} className="rounded-2xl border border-amb/25 bg-amb/[0.05] p-5" data-testid={`receipt-card-${i + 1}`}><h3 className="font-display text-lg font-semibold text-tx-hi">{r.title || MISSING}</h3>{[["Recording & transcript", ""], ["Flow text", ""], ["Spoken record", r.built], ["Evidence", r.evidence]].map(([label, value]) => <div className="mt-4" key={label}><p className="field-label">{label}</p><p className="mt-1 text-sm leading-relaxed text-tx-low">{value || MISSING}</p></div>)}</article>)}</div>
    <div className="mt-8 border-y border-line/15 py-6" data-testid="speed-tests"><h3 className="font-display text-lg font-semibold text-tx-hi">Typing versus talking</h3>
      <div className="mt-4 grid gap-4 text-sm leading-relaxed text-tx-low md:grid-cols-3"><p data-testid="speed-comparison"><span className="font-medium text-tx">Same passage, my timing: </span>typing {TALK.typing}, voice {TALK.voice}.</p><p data-testid="speed-saving">{TALK.saving}</p><p data-testid="speed-tradeoffs">Limitations are listed under Voice limitations below.</p></div>
      <p className="mt-4 text-sm text-tx-low" data-testid="speed-concept">Concept passage: {TALK.concept}</p><p className="mt-2 text-sm text-tx-low" data-testid="speed-regional">Regional languages: {TALK.regional}</p></div>
    <div className="mt-6 grid gap-6 sm:grid-cols-2"><div data-testid="receipt-build-log"><h3 className="font-semibold text-tx-hi">Build log</h3><p className="mt-2 whitespace-pre-line text-sm text-tx-low">{profile.buildLog || MISSING}</p></div><div data-testid="receipt-limitations"><h3 className="font-semibold text-tx-hi">Voice limitations</h3><p className="mt-2 text-sm text-tx-low">{profile.voiceLimit || MISSING}</p></div></div>
  </div></section>;
}