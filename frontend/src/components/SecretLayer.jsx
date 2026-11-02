import { useState } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { Tag } from "./Tags";
import { SECRET } from "../lib/content";
import { MEDIA } from "../lib/media";

const SecretLayer = () => {
  const [guess, setGuess] = useState("");
  const [state, setState] = useState("idle");
  const [attempts, setAttempts] = useState(0);
  const [spoiler, setSpoiler] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const check = (e) => {
    e.preventDefault();
    if (!guess.trim()) {
      setState("empty");
      return;
    }
    if (guess.trim().toLowerCase() === SECRET.answer) {
      setState("solved");
    } else {
      setState("wrong");
      setAttempts((a) => a + 1);
      setShakeKey((k) => k + 1);
    }
  };

  const revealSpoiler = () => {
    setSpoiler(true);
    setState("solved");
  };

  const reset = () => {
    setGuess("");
    setState("idle");
    setAttempts(0);
    setSpoiler(false);
  };

  return (
    <section id="secret" className="py-16 sm:py-24" data-testid="secret-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          no="03"
          kicker="The Secret Layer"
          accent="tangerine"
          title="Three clues. One hidden word."
          desc={SECRET.intro}
        />

        <Reveal className="mt-8">
          <div className="flex items-center gap-2" data-testid="clue-tracker">
            {MEDIA.clues.map((c) => (
              <div
                key={c.id}
                className="grid h-9 w-9 place-items-center rounded-xl border border-tangerine/40 bg-tangerine/10 font-display text-sm font-bold text-tangerine"
              >
                {state === "solved" ? c.letter : "?"}
              </div>
            ))}
            <span className="ml-2 text-xs text-slate-500">Find all three letters.</span>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {MEDIA.clues.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.07}>
              <figure
                data-testid={`clue-card-${i + 1}`}
                className="group overflow-hidden rounded-2xl border border-tangerine/25 bg-white/[0.03] transition-colors hover:border-tangerine/50"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={c.src}
                    alt={c.alt}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14]/70 via-transparent to-transparent" />
                </div>
                <figcaption className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest2 text-orange-300">
                    Clue {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-slate-400">{c.hint}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <div className="glass rounded-2xl p-5 sm:p-6" data-testid="easter-egg-panel">
            <form onSubmit={check} className="flex flex-wrap items-center gap-3">
              <div key={shakeKey} className={`min-w-0 flex-1 ${state === "wrong" ? "animate-shake" : ""}`}>
                <input
                  data-testid="easter-egg-input"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Type the hidden word"
                  aria-label="Your answer to the clue puzzle"
                  className="w-full rounded-full border border-tangerine/40 bg-ink/50 px-5 py-3 text-sm text-slate-100 placeholder:text-slate-600"
                />
              </div>
              <button
                type="submit"
                data-testid="easter-egg-submit-btn"
                className="rounded-full bg-tangerine px-5 py-3 text-sm font-bold text-[#2A0F04] transition-transform hover:-translate-y-0.5"
              >
                Try answer
              </button>
              <button
                type="button"
                data-testid="easter-egg-spoiler-btn"
                onClick={revealSpoiler}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
              >
                <Eye className="h-4 w-4" />
                Show spoiler
              </button>
              {(state !== "idle" || attempts > 0) && (
                <button
                  type="button"
                  data-testid="easter-egg-reset-btn"
                  onClick={reset}
                  aria-label="Reset the puzzle"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-slate-400 transition-colors hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </form>

            <div aria-live="polite" className="mt-3 min-h-[22px] text-sm" data-testid="easter-egg-feedback">
              {state === "empty" && <p className="text-orange-300">{SECRET.feedbackEmpty}</p>}
              {state === "wrong" && (
                <p className="text-orange-300">{attempts >= 2 ? SECRET.feedbackHint : SECRET.feedbackWrong}</p>
              )}
              {state === "solved" && !spoiler && (
                <p className="font-semibold text-emerald-300">{SECRET.feedbackCorrect}</p>
              )}
              {spoiler && <p className="font-semibold text-amber-300">{SECRET.spoilerAnswer}</p>}
            </div>

            {state === "solved" && (
              <div data-testid="easter-egg-reveal" className="mt-4 rounded-2xl border border-emeraldx/40 bg-emeraldx/[0.07] p-5">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-300" />
                  <p className="font-display font-bold text-emerald-200">
                    {spoiler ? SECRET.spoilerAnswer : SECRET.feedbackCorrect}
                  </p>
                  {spoiler && <Tag tone="amber" className="ml-auto">Revealed with spoiler</Tag>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{SECRET.unlockBody}</p>
              </div>
            )}

            <p className="mt-4 text-xs text-slate-500">{SECRET.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SecretLayer;
