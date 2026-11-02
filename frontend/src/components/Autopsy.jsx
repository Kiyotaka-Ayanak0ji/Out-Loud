import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { EvidenceTag, ProposalTag, Tag } from "./Tags";
import { useMotion } from "../context/motion-context";
import { useProfile } from "../context/profile-context";
import { DECISIONS, PROPOSALS } from "../lib/content";

const Row = ({ label, children, note }) => (
  <div className="grid grid-cols-[92px_1fr] items-baseline gap-3 sm:grid-cols-[110px_1fr]">
    <span className="field-label">{label}</span>
    <p className="text-sm leading-relaxed text-tx">
      {children}
      {note && <span className="ml-2 font-mono text-[10px] uppercase text-tx-faint">{note}</span>}
    </p>
  </div>
);

const DecisionCard = ({ d, idx, real }) => {
  const [open, setOpen] = useState(idx === 0);
  const { motionOn } = useMotion();
  const body = (
    <div className="border-t border-line/10 px-5 py-5">
      <div className="grid gap-3">
        {real && d.role ? <Row label="Role">{d.role}</Row> : null}
        <Row label="Context">{d.context}</Row>
        <Row label="Decision">{d.decision}</Row>
        <Row label="Reason">{d.reason}</Row>
        <Row label="Outcome" note={real ? (d.evidenceOk ? undefined : "Not verified") : "Not measured"}>
          {real ? d.result || "[Result not yet provided]" : d.outcome}
        </Row>
        <Row label="Lesson">{d.lesson}</Row>
      </div>
    </div>
  );
  return (
    <div
      data-testid={`autopsy-card-${idx + 1}`}
      className="glass overflow-hidden rounded-2xl transition-colors hover:border-acc/40"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-testid={`autopsy-card-toggle-${idx + 1}`}
        className="flex w-full items-center gap-3 p-5 text-left"
      >
        <span className="font-mono text-xs font-semibold text-acc-soft">{d.id}</span>
        <span className="flex-1 font-display text-[15px] font-bold leading-snug text-tx-hi">{d.title}</span>
        {real ? (
          d.evidenceOk ? (
            <Tag tone="emerald">Verified</Tag>
          ) : (
            <EvidenceTag />
          )
        ) : (
          <EvidenceTag />
        )}
        <ChevronDown
          className={`h-4 w-4 flex-none text-tx-faint transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open &&
        (motionOn ? (
          <AnimatePresence initial={false}>
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="overflow-hidden"
            >
              {body}
            </motion.div>
          </AnimatePresence>
        ) : (
          body
        ))}
    </div>
  );
};

const Autopsy = () => {
  const { profile } = useProfile();
  const pa = profile.autopsy;
  const real = pa.decisions
    .map((d, i) => ({
      ...d,
      id: `D-0${i + 1}`,
      outcome: d.result,
      role: pa.role,
    }))
    .filter((d) => d.title && d.title.trim());
  const mode = real.length ? "real" : "placeholder";
  const realMistakes =
    pa.mistakes.happened?.trim() || pa.mistakes.cost?.trim() || pa.mistakes.change?.trim();

  return (
    <section id="autopsy" className="py-16 sm:py-24" data-testid="autopsy-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          no="01"
          kicker="The Autopsy"
          title="Decisions, opened up."
          desc={
            mode === "real"
              ? `Applied from your Content Setup on this device${pa.projectName ? ` — teardown of ${pa.projectName}` : ""}. Edit it there anytime.`
              : "[A decision-by-decision teardown lands here — six calls, what they cost, what they taught. Placeholder structure below, ready for real content.]"
          }
        />
        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-2" data-testid="autopsy-scoreboard">
            {mode === "real" ? (
              <>
                <Tag tone="emerald">{real.length} real decisions</Tag>
                {pa.role ? <Tag tone="indigo">Role · {pa.role}</Tag> : null}
                <span className="ml-1 text-xs text-tx-faint">Badges show evidence state per decision.</span>
              </>
            ) : (
              <>
                <Tag tone="indigo">Hit · [n]</Tag>
                <Tag tone="indigo">Mixed · [n]</Tag>
                <Tag tone="indigo">Miss · [n]</Tag>
                <span className="ml-1 text-xs text-tx-faint">Counts land with the real decisions.</span>
              </>
            )}
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {(mode === "real" ? real : DECISIONS).map((d, i) => (
            <Reveal key={d.id + i} delay={(i % 2) * 0.06}>
              <DecisionCard d={d} idx={i} real={mode === "real"} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div data-testid="mistakes-panel" className="rounded-2xl border border-tan/30 bg-tan/[0.06] p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest2 text-tan-soft">
              Mistakes panel — the honesty log
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="field-label">What happened</p>
                <p className="mt-1 text-sm text-tx">
                  {realMistakes ? pa.mistakes.happened : "[A real mistake with consequences — not a disguised strength.]"}
                </p>
              </div>
              <div>
                <p className="field-label">What it cost</p>
                <p className="mt-1 text-sm text-tx">
                  {realMistakes ? pa.mistakes.cost || "[Not yet provided]" : "[Time, money or users — placeholder.]"}
                </p>
              </div>
              <div>
                <p className="field-label">What changes</p>
                <p className="mt-1 text-sm text-tx">
                  {realMistakes ? pa.mistakes.change || "[Not yet provided]" : "[What you do differently now.]"}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10">
          <Reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest2 text-tan-soft">
              Growth experiments — proposed, not proven
            </p>
          </Reveal>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {PROPOSALS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06} className="h-full">
                <div
                  data-testid={`proposal-card-${i + 1}`}
                  className="h-full rounded-2xl border border-line/10 bg-fill/[0.03] p-5 transition-colors hover:border-tan/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-tx-faint">{p.id}</span>
                    <ProposalTag />
                  </div>
                  <p className="mt-3 font-display text-[15px] font-bold text-tx-hi">{p.title}</p>
                  <div className="mt-4 grid gap-2.5">
                    <div>
                      <p className="field-label">Hypothesis</p>
                      <p className="mt-0.5 text-xs text-tx-low">{p.hypothesis}</p>
                    </div>
                    <div>
                      <p className="field-label">Test</p>
                      <p className="mt-0.5 text-xs text-tx-low">{p.test}</p>
                    </div>
                    <div>
                      <p className="field-label">Kill criterion</p>
                      <p className="mt-0.5 text-xs text-tx-low">{p.kill}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Autopsy;
