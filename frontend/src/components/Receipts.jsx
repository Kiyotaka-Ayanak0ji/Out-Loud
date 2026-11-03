import { SectionHeader } from "./Reveal";
import { useProfile } from "../context/profile-context";
import { MISSING, TALK } from "../lib/profile-data";

const TalkSection = () => <div className="mt-8 border-y border-line/15 py-6" data-testid="speed-tests">
  <h3 className="font-display text-lg font-semibold text-tx-hi">Typing versus talking</h3>
  <div className="mt-5 grid gap-4 sm:grid-cols-3" data-testid="speed-comparison">
    {[["Typing", TALK.typing], ["Voice", TALK.voice], ["Faster by voice", `${(TALK.typingSec / TALK.voiceSec).toFixed(1)}×`]].map(([k, v]) => <div key={k} className="rounded-2xl border border-amb/25 bg-amb/[0.05] p-4"><p className="field-label">{k}</p><p className="mt-1 font-display text-2xl font-semibold text-tx-hi">{v}</p></div>)}
  </div>
  <p className="mt-3 text-xs text-tx-low">Same passage, timed on my own setup.</p>
  <div className="mt-6 grid gap-6 md:grid-cols-2">{TALK.points.map(([k, v]) => <div key={k} data-testid={`speed-point-${k.toLowerCase().replace(/[^a-z]+/g, "-")}`}><p className="font-medium text-tx">{k}</p><p className="mt-1 text-sm leading-relaxed text-tx-low">{v}</p></div>)}</div>
  <p className="mt-6 border-l-2 border-amb/60 pl-3 text-sm font-medium text-amb-soft" data-testid="speed-saving">{TALK.saving}</p>
</div>;

export default function Receipts() {
  const { profile } = useProfile();
  return <section id="receipts" className="py-16 sm:py-24" data-testid="receipts-section"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader no="04" kicker="Voice Receipts" title="The spoken record" accent="amber" />
    <div className="mt-8 grid gap-4 md:grid-cols-2">{profile.receipts.map((r, i) => <article key={i} className="rounded-2xl border border-amb/25 bg-amb/[0.05] p-5" data-testid={`receipt-card-${i + 1}`}><h3 className="font-display text-lg font-semibold text-tx-hi">{r.title || MISSING}</h3>
      <div className="mt-4"><p className="field-label">Recording & transcript</p><p className="mt-1 text-sm text-tx-low">{MISSING}</p></div>
      <div className="mt-4"><p className="field-label">Flow text</p><p className="mt-1 text-sm leading-relaxed text-tx-low" data-testid={`receipt-flow-${i + 1}`}>{r.flow || MISSING}</p></div>
    </article>)}</div>
    <TalkSection />
    <div className="mt-6 grid gap-6 sm:grid-cols-2"><div data-testid="receipt-build-log"><h3 className="font-semibold text-tx-hi">Build log</h3><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-tx-low">{profile.buildLog || MISSING}</p></div><div data-testid="receipt-limitations"><h3 className="font-semibold text-tx-hi">Voice limitations</h3><p className="mt-2 text-sm leading-relaxed text-tx-low">{profile.voiceLimit || MISSING}</p></div></div>
  </div></section>;
}
