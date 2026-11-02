import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Download,
  Eye,
  Lock,
  RotateCcw,
  Save,
} from "lucide-react";
import Logo from "../components/Logo";
import { useProfile } from "../context/profile-context";
import { STEPS } from "./questions";
import { QuestionField, StatusChip } from "./Fields";
import { IntroAudio } from "./VoiceNote";
import {
  clearDraft,
  downloadJson,
  get,
  loadDraft,
  saveDraft,
  set as setPath,
  statusOf,
} from "./utils";
import { emptyProfile } from "../context/profile-context";

const SetupApp = () => {
  const { profile, applyProfile, clearProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => loadDraft() || emptyProfile);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  const upd = (path, v) => setDraft((d) => setPath(d, path, v));

  const stepStatus = (s) => {
    let missing = 0;
    let awaiting = 0;
    s.questions.forEach((q) => {
      const st = statusOf(get(draft, q.path), q.evidencePath ? get(draft, q.evidencePath) : undefined);
      if (st === "missing") missing++;
      if (st === "awaiting") awaiting++;
    });
    if (missing && !awaiting) return { tone: "missing", label: `${missing} missing` };
    if (awaiting) return { tone: "awaiting", label: `${awaiting} awaiting evidence` };
    if (missing) return { tone: "missing", label: `${missing} missing` };
    return { tone: "complete", label: "Complete" };
  };

  const current = STEPS[step];
  const isReview = step === STEPS.length;
  const totalAnswers = useMemo(
    () => STEPS.reduce((n, s) => n + s.questions.length, 0),
    []
  );
  const filled = useMemo(
    () =>
      STEPS.reduce(
        (n, s) => n + s.questions.filter((q) => get(draft, q.path)?.toString().trim()).length,
        0
      ),
    [draft]
  );

  return (
    <div className="min-h-screen bg-bg pb-24 font-body text-tx" data-testid="setup-app">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Logo className="h-8 w-8" />
            <div className="flex-1">
              <p className="font-display text-lg font-bold text-tx-hi">Content Setup</p>
              <p className="flex items-center gap-1.5 text-[11px] text-tx-faint">
                <Lock className="h-3 w-3 text-emer-soft" />
                Private — nothing appears on the public page until you apply it on this device
              </p>
            </div>
            <a
              href="#/"
              data-testid="setup-back-link"
              className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-4 py-2 text-xs font-semibold text-tx-low hover:text-tx-hi"
            >
              <Eye className="h-3.5 w-3.5" />
              View public page
            </a>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-tx-faint">
            Answers stay in this browser. You can save a draft, download them as a file, and review everything before
            applying it. This setup tool is separate from the public portfolio.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" data-testid="setup-progress">
          {STEPS.map((s, i) => {
            const st = stepStatus(s);
            return (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                data-testid={`setup-step-${s.id}`}
                className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest2 transition-colors ${
                  i === step
                    ? "border-acc bg-acc/10 text-acc-soft"
                    : st.tone === "complete"
                      ? "border-emer/40 bg-emer/5 text-emer-soft"
                      : st.tone === "awaiting"
                        ? "border-amb/40 bg-amb/5 text-amb-soft"
                        : "border-line/15 bg-fill/5 text-tx-faint"
                }`}
              >
                {s.title} · {st.label}
              </button>
            );
          })}
          <button
            onClick={() => setStep(STEPS.length)}
            data-testid="setup-step-review"
            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest2 transition-colors ${
              isReview ? "border-acc bg-acc/10 text-acc-soft" : "border-line/15 bg-fill/5 text-tx-faint"
            }`}
          >
            Review &amp; export
          </button>
        </div>

        {!isReview ? (
          <div className="mt-5">
            <div className="glass rounded-3xl p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest2 text-acc-soft">
                Step {step + 1} of {STEPS.length} · {filled}/{totalAnswers} answers started
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-tx-hi">{current.title}</h2>
              <p className="mt-1 text-sm text-tx-low">{current.blurb}</p>
              <div className="mt-5 grid gap-4">
                {current.questions.map((q) => (
                  <QuestionField
                    key={q.path}
                    q={q}
                    value={get(draft, q.path)}
                    evidenceValue={q.evidencePath ? get(draft, q.evidencePath) : undefined}
                    onChange={upd}
                    onEvidenceChange={upd}
                  />
                ))}
                {current.id === "intro" && (
                  <IntroAudio value={draft.intro.audio} onChange={(v) => upd("intro.audio", v)} />
                )}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                data-testid="setup-back-btn"
                className="inline-flex items-center gap-2 rounded-full border border-line/15 px-5 py-2.5 text-sm font-semibold text-tx-low disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
                data-testid="setup-next-btn"
                className="inline-flex items-center gap-2 rounded-full bg-acc px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                {step === STEPS.length - 1 ? "Review answers" : "Next section"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5" data-testid="setup-review">
            <div className="glass rounded-3xl p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest2 text-acc-soft">Final step</p>
              <h2 className="mt-2 flex items-center gap-2 font-display text-2xl font-bold text-tx-hi">
                <ClipboardList className="h-5 w-5 text-acc-soft" />
                Review &amp; export
              </h2>
              <p className="mt-2 text-sm text-tx-low">
                {filled} of {totalAnswers} answers started. Jump back to any section to edit — nothing is published
                until you apply it below.
              </p>
              <div className="mt-4 grid gap-2">
                {STEPS.map((s, i) => {
                  const st = stepStatus(s);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStep(i)}
                      data-testid={`setup-review-edit-${s.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-line/10 bg-fill/[0.03] px-4 py-3 text-left transition-colors hover:border-acc/40"
                    >
                      <span className="font-display text-sm font-bold text-tx-hi">{s.title}</span>
                      <StatusChip status={st.tone === "missing" ? "missing" : st.tone === "awaiting" ? "awaiting" : "complete"} />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    applyProfile(draft);
                    setApplied(true);
                  }}
                  data-testid="setup-apply-btn"
                  className="rounded-full bg-emer px-5 py-3 text-sm font-bold text-[#04211B] transition-transform hover:-translate-y-0.5"
                >
                  Apply to page (this device only)
                </button>
                <button
                  onClick={() => downloadJson(draft, "out-loud-content-setup.json")}
                  data-testid="setup-download-btn"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line/20 px-5 py-3 text-sm font-semibold text-tx hover:bg-fill/5"
                >
                  <Download className="h-4 w-4" />
                  Download responses (JSON)
                </button>
                <button
                  onClick={() => {
                    saveDraft(draft);
                    setApplied(false);
                  }}
                  data-testid="setup-save-btn"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line/20 px-5 py-3 text-sm font-semibold text-tx hover:bg-fill/5"
                >
                  <Save className="h-4 w-4" />
                  Save draft locally
                </button>
                <button
                  onClick={() => {
                    clearDraft();
                    clearProfile();
                    setDraft(emptyProfile);
                    setApplied(false);
                  }}
                  data-testid="setup-clear-btn"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-tan/40 px-5 py-3 text-sm font-semibold text-tan-soft hover:bg-tan/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear all responses
                </button>
              </div>
              {applied && (
                <p className="mt-4 rounded-xl border border-emer/40 bg-emer/10 p-3 text-xs text-emer-soft" data-testid="setup-applied-note">
                  Applied to this device's public page. Nothing left your browser — to move it elsewhere, use the
                  download and import it on that device.
                </p>
              )}
              <p className="mt-4 text-xs text-tx-faint">
                Applied content lives in this browser only. The public portfolio shows it only on this device, and
                clear all responses removes it everywhere here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupApp;
