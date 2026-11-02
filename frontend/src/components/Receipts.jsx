import { Play } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { Tag } from "./Tags";
import { RECEIPTS } from "../lib/content";

const Receipts = () => (
  <section id="receipts" className="py-16 sm:py-24" data-testid="receipts-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        no="04"
        kicker="Voice Receipts"
        accent="amber"
        title="Audio in. Change out."
        desc="[Each receipt will map a real voice note to its transcript and the exact project change it produced. Every card below is a placeholder until real recordings exist.]"
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {RECEIPTS.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.06} className="h-full">
            <div
              data-testid={`receipt-card-${i + 1}`}
              className="flex h-full flex-col rounded-2xl border border-amberx/25 bg-amberx/[0.05] p-5 transition-colors hover:border-amberx/50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-amber-300">{r.id}</span>
                <Tag tone="amber">Placeholder</Tag>
              </div>
              <p className="mt-3 font-display text-[15px] font-bold text-slate-100">{r.title}</p>
              <div className="mt-4 grid flex-1 content-start gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink/40 px-4 py-3">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-amberx/15 text-amber-300">
                    <Play className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="field-label">Audio</p>
                    <p className="text-xs text-slate-400">{r.audio}</p>
                  </div>
                  <div className="ml-auto flex h-6 items-center gap-[2px]" aria-hidden>
                    {[10, 16, 8, 14, 6].map((h, j) => (
                      <span key={j} style={{ height: `${h}px` }} className="w-[2px] rounded-full bg-amberx/50" />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-ink/40 px-4 py-3">
                  <p className="field-label">Transcript</p>
                  <p className="mt-1 text-xs text-slate-400">{r.transcript}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-ink/40 px-4 py-3">
                  <p className="field-label">Project change</p>
                  <p className="mt-1 text-xs text-slate-400">{r.change}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6">
        <p className="text-xs text-slate-500">
          No time savings or results are claimed anywhere on this page — nothing has been measured yet.
        </p>
      </Reveal>
    </div>
  </section>
);

export default Receipts;
