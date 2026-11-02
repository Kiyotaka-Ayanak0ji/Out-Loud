import { useEffect, useRef, useState } from "react";
import { Ear, Eye, Lightbulb, RefreshCcw } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { Tag } from "./Tags";
import Decoder from "./Decoder";
import { PLATES, SECRET } from "../lib/content";
import { useProfile } from "../context/profile-context";

const W = 720;
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const SecretLayer = () => {
  const { profile } = useProfile();
  const story = profile.secret.story?.trim() ? profile.secret.story : SECRET.story;
  const [plateIdx, setPlateIdx] = useState(0);
  const [reload, setReload] = useState(0);
  const [threshold, setThreshold] = useState(128);
  const [status, setStatus] = useState("loading");
  const [hintLevel, setHintLevel] = useState(0);
  const [textRoute, setTextRoute] = useState(false);
  const [guess, setGuess] = useState("");
  const [state, setState] = useState("idle");
  const [attempts, setAttempts] = useState(0);
  const [spoiler, setSpoiler] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const meanRef = useRef(null);
  const plate = PLATES[plateIdx];

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    meanRef.current = null;
    const img = new Image();
    imgRef.current = img;
    img.onload = () => {
      if (cancelled) return;
      const c = document.createElement("canvas");
      c.width = 180;
      c.height = 180;
      const cx = c.getContext("2d");
      cx.drawImage(img, 0, 0, 180, 180);
      const d = cx.getImageData(0, 0, 180, 180).data;
      let s = 0;
      for (let i = 0; i < d.length; i += 4) s += lum(d[i], d[i + 1], d[i + 2]);
      meanRef.current = s / (d.length / 4);
      setStatus("ready");
    };
    img.onerror = () => {
      if (!cancelled) setStatus("error");
    };
    img.src = plate.src;
    return () => {
      cancelled = true;
    };
  }, [plateIdx, plate.src, reload]);

  useEffect(() => {
    if (status !== "ready") return;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    if (canvas.width !== W) {
      canvas.width = W;
      canvas.height = W;
    }
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, W, W);
    const im = ctx.getImageData(0, 0, W, W);
    const d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = lum(d[i], d[i + 1], d[i + 2]) >= threshold ? 255 : 0;
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
    }
    ctx.putImageData(im, 0, 0);
  }, [threshold, status, plateIdx]);

  const autoLevels = () => {
    if (meanRef.current != null) {
      setThreshold(Math.round(Math.min(210, Math.max(50, meanRef.current + 12))));
    }
  };

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

  const reset = () => {
    setGuess("");
    setState("idle");
    setAttempts(0);
    setSpoiler(false);
  };

  const solved = state === "solved";

  return (
    <section id="secret" className="py-16 sm:py-24" data-testid="secret-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          no="03"
          kicker="The Secret Layer"
          accent="tangerine"
          title="Three plates. One buried word."
          desc={story}
        />

        <p className="mt-4 text-xs text-tx-low" data-testid="secret-evidence">Source: supplied résumés, Edunet internship. Original repository or demo: Upload needed.</p>

        <Reveal className="mt-6">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a plate" data-testid="plate-selector">
            {PLATES.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={plateIdx === i}
                data-testid={`plate-tab-${i + 1}`}
                onClick={() => setPlateIdx(i)}
                className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2 transition-colors ${
                  plateIdx === i
                    ? "border-tan/60 bg-tan/10"
                    : "border-line/10 bg-fill/5 hover:border-line/25"
                }`}
              >
                <img src={p.src} alt="" className="h-10 w-10 rounded-lg object-cover grayscale" />
                <span className={`font-mono text-[11px] font-semibold uppercase tracking-widest2 ${plateIdx === i ? "text-tan-soft" : "text-tx-low"}`}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-5">
          <div className="glass overflow-hidden rounded-3xl p-5 sm:p-6" data-testid="decipher-bench">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <div className="relative mx-auto max-w-[520px]">
                  {status === "ready" ? (
                    <canvas
                      ref={canvasRef}
                      role="img"
                      aria-label={`Deciphered view of ${plate.label}. ${plate.alt} The levels tool shows a thresholded black-and-white version of this plate; sweep the slider to bring the hidden ghost into view.`}
                      data-testid="decipher-canvas"
                      className="bench-canvas w-full rounded-2xl border border-line/10"
                    />
                  ) : (
                    <div
                      className="grid aspect-square w-full place-items-center rounded-2xl border border-line/10 bg-fill/5 text-center"
                      data-testid={status === "loading" ? "decipher-loading" : "decipher-error"}
                    >
                      {status === "loading" ? (
                        <p className="field-label">Developing {plate.label}…</p>
                      ) : (
                        <div className="px-6">
                          <p className="text-sm text-tx-low">The plate failed to load.</p>
                          <button
                            type="button"
                            onClick={() => setReload((value) => value + 1)}
                            data-testid="decipher-retry-btn"
                            className="mt-3 rounded-full border border-line/20 px-4 py-2 text-xs font-semibold text-tx-low hover:text-tx-hi"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-center text-xs text-tx-faint">
                  {plate.label}: {plate.alt}
                </p>
              </div>

              <div className="grid content-start gap-5">
                <div>
                  <label htmlFor="levels" className="field-label">
                    Levels threshold: {threshold}
                  </label>
                  <input
                    id="levels"
                    type="range"
                    min="40"
                    max="220"
                    value={threshold}
                    onChange={(e) => setThreshold(+e.target.value)}
                    data-testid="decipher-slider"
                    aria-label="Levels threshold"
                    className="mt-2 w-full accent-acc"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={autoLevels}
                    data-testid="decipher-auto-btn"
                    className="rounded-full bg-tan px-4 py-2 text-xs font-bold text-[#2A0F04] transition-transform hover:-translate-y-0.5"
                  >
                    Auto levels
                  </button>
                  <button
                    type="button"
                    onClick={() => setHintLevel((h) => Math.min(3, h + 1))}
                    aria-disabled={hintLevel >= 3}
                    data-testid="decipher-hint-btn"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-4 py-2 text-xs font-semibold text-tx-low transition-colors hover:text-tx-hi"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    {hintLevel >= 3 ? "All hints shown" : `Hint ${hintLevel + 1} of 3`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextRoute((v) => !v)}
                    aria-expanded={textRoute}
                    data-testid="decipher-text-route-btn"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-4 py-2 text-xs font-semibold text-tx-low transition-colors hover:text-tx-hi"
                  >
                    <Ear className="h-3.5 w-3.5" />
                    Text clues
                  </button>
                </div>

                <div aria-live="polite" className="min-h-[40px] text-sm" data-testid="decipher-hints">
                  {hintLevel > 0 && (
                    <div className="grid gap-1.5">
                      {SECRET.hints.slice(0, hintLevel).map((h, i) => (
                        <p key={i} className="text-xs leading-relaxed text-tx-low">
                          {h}
                        </p>
                      ))}
                      {hintLevel >= 3 && (
                        <p className="text-xs leading-relaxed text-tan-soft">{plate.strong}</p>
                      )}
                    </div>
                  )}
                </div>

                {textRoute && (
                  <div className="rounded-2xl border border-line/10 bg-fill/[0.03] p-4" data-testid="decipher-text-route">
                    <p className="field-label">Three riddles, in plate order</p>
                    <ol className="mt-2 grid gap-2 text-xs leading-relaxed text-tx-low">
                      {PLATES.map((p) => (
                        <li key={p.id} className="flex gap-2">
                          <span className="flex-none font-mono text-acc-soft">{p.label.replace("Plate ", "")}</span>
                          <span>{p.riddle}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <div className="glass rounded-3xl p-5 sm:p-6" data-testid="easter-egg-panel">
            <form onSubmit={check} className="flex flex-wrap items-center gap-3">
              <div key={shakeKey} className={`min-w-0 w-full sm:w-auto sm:flex-1 ${state === "wrong" ? "animate-shake" : ""}`}>
                <input
                  data-testid="easter-egg-input"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Type the hidden word"
                  aria-label="Your answer to the plate puzzle"
                  className="w-full rounded-full border border-tan/40 bg-bg/50 px-5 py-3 text-sm text-tx placeholder:text-tx-faint"
                />
              </div>
              <button
                type="submit"
                data-testid="easter-egg-submit-btn"
                className="rounded-full bg-tan px-5 py-3 text-sm font-bold text-[#2A0F04] transition-transform hover:-translate-y-0.5"
              >
                Try answer
              </button>
              <button
                type="button"
                data-testid="easter-egg-spoiler-btn"
                onClick={() => {
                  setSpoiler(true);
                  setState("solved");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-line/20 px-5 py-3 text-sm font-semibold text-tx transition-colors hover:bg-fill/5"
              >
                <Eye className="h-4 w-4" />
                Reveal answer
              </button>
              {(state !== "idle" || attempts > 0) && (
                <button
                  type="button"
                  data-testid="easter-egg-reset-btn"
                  onClick={reset}
                  aria-label="Reset the puzzle"
                  className="grid h-11 w-11 place-items-center rounded-full border border-line/15 text-tx-low transition-colors hover:text-tx-hi"
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>
              )}
            </form>

            <div aria-live="polite" className="mt-3 min-h-[22px] text-sm" data-testid="easter-egg-feedback">
              {state === "empty" && <p className="text-tan-soft">{SECRET.feedbackEmpty}</p>}
              {state === "wrong" && <p className="text-tan-soft">{SECRET.feedbackWrong}</p>}
            </div>

            {solved && (
              <div data-testid="easter-egg-reveal" className="mt-4 rounded-2xl border border-emer/40 bg-emer/[0.06] p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-4xl font-extrabold tracking-[0.3em] text-emer-soft" data-testid="easter-egg-answer">
                    OUT
                  </span>
                  <Tag data-testid="easter-egg-solve-status" tone={spoiler ? "amber" : "emerald"} className="ml-auto">
                    {spoiler ? "Revealed with spoiler" : "Solved"}
                  </Tag>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-tx">
                  {spoiler ? SECRET.spoilerAnswer : SECRET.feedbackCorrect}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-tx-low">{SECRET.solveExplain}</p>
                <p className="mt-3 text-sm text-tx-low" data-testid="secret-bonus-story">Bonus story: {profile.secret.message || "Upload needed."}</p>
                <p className="mt-2 text-sm text-tx-low" data-testid="secret-grant-answer">The $3,000 work requirement: {profile.secret.grant || "Upload needed."}</p>
              </div>
            )}

            <p className="mt-4 text-xs text-tx-faint">{SECRET.note}</p>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <Decoder />
        </Reveal>
      </div>
    </section>
  );
};

export default SecretLayer;
