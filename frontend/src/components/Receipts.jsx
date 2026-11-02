import { Play } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { Tag } from "./Tags";
import { useProfile } from "../context/profile-context";
import { RECEIPTS } from "../lib/content";

const Receipts = () => {
  const { profile } = useProfile();
  const real = profile.receipts.filter((r) => r.title && r.title.trim());
  const mode = real.length ? "real" : "placeholder";
  const source = mode === "real" ? real : RECEIPTS;

  return (
    <section id="receipts" className="py-16 sm:py-24" data-testid="receipts-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          no="04"
          kicker="Voice Receipts"
          accent="amber"
          title="Audio in. Change out."
          desc={
            mode === "real"
              ? "Applied from your Content Setup on this device — every card maps what was said to what changed."
              : "[Each receipt will map a real voice note to its transcript and the exact project change it produced. Every card below is a placeholder until real recordings exist.]"
          }
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {source.map((r, i) => (
            <Reveal key={r.id || r.title + i} delay={i * 0.06} className="h-full">
              <div
                data-testid={`receipt-card-${i + 1}`}
                className="flex h-full flex-col rounded-2xl border border-amb/25 bg-amb/[0.05] p-5 transition-colors hover:border-amb/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-amb-soft">{r.id || `R-0${i + 1}`}</span>
                  <Tag tone={mode === "real" ? "emerald" : "amber"}>
                    {mode === "real" ? "From your setup" : "Placeholder"}
                  </Tag>
                </div>
                <p className="mt-3 font-display text-[15px] font-bold text-tx-hi">{r.title}</p>
                <div className="mt-4 grid flex-1 content-start gap-3">
                  {mode === "placeholder" ? (
                    <div className="flex items-center gap-3 rounded-xl border border-line/10 bg-bg/40 px-4 py-3">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-amb/15 text-amb-soft">
                        <Play className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="field-label">Audio</p>
                        <p className="text-xs text-tx-low">{r.audio}</p>
                      </div>
                      <div className="ml-auto flex h-6 items-center gap-[2px]" aria-hidden>
                        {[10, 16, 8, 14, 6].map((h, j) => (
                          <span key={j} style={{ height: `${h}px` }} className="w-[2px] rounded-full bg-amb/50" />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="rounded-xl border border-line/10 bg-bg/40 px-4 py-3">
                    <p className="field-label">{mode === "real" ? "What was said" : "Transcript"}</p>
                    <p className="mt-1 text-xs text-tx-low">
                      {mode === "real" ? r.said || "[Not yet provided]" : r.transcript}
                    </p>
                  </div>
                  {mode === "real" ? (
                    <div className="rounded-xl border border-line/10 bg-bg/40 px-4 py-3">
                      <p className="field-label">What was transcribed</p>
                      <p className="mt-1 text-xs text-tx-low">{r.transcribed || "[Not yet provided]"}</p>
                    </div>
                  ) : null}
                  <div className="rounded-xl border border-line/10 bg-bg/40 px-4 py-3">
                    <p className="field-label">Project change</p>
                    <p className="mt-1 text-xs text-tx-low">
                      {mode === "real" ? r.built || "[Not yet provided]" : r.change}
                    </p>
                  </div>
                  {mode === "real" ? (
                    <div className="rounded-xl border border-line/10 bg-bg/40 px-4 py-3">
                      <p className="field-label">Evidence</p>
                      <p className="mt-1 break-all text-xs text-tx-low">
                        {r.evidence?.trim() ? r.evidence : "[Evidence needed — add a reference in Content Setup]"}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <p className="text-xs text-tx-faint">
            No time savings or results are claimed anywhere on this page — nothing has been measured yet.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Receipts;
