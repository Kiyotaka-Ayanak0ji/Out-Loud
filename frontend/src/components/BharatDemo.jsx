import { useState } from "react";
import { Loader2, Mic } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { SampleTag, Tag } from "./Tags";
import { GENERIC_RESULT, VOICE_SAMPLES } from "../lib/content";

const MARKERS = {
  electrician: ["electrician", "wiring", "bijli"],
  nurse: ["nurse", "ward", "patient"],
  driver: ["driver", "van", "route"],
};

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-line/10 bg-fill/[0.03] px-4 py-3">
    <p className="field-label">{label}</p>
    <span
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      className="mt-1 block rounded px-1 text-sm font-medium text-tx focus:bg-fill/10"
    >
      {value}
    </span>
  </div>
);

const BharatDemo = () => {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [micState, setMicState] = useState("idle");
  const [micMsg, setMicMsg] = useState("");

  const loadSample = (s) => {
    setTranscript(s.transcript);
    setError("");
  };

  const build = () => {
    if (!transcript.trim()) {
      setError("Type a few spoken-style sentences, or tap a sample button first.");
      setResult(null);
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const key = Object.keys(MARKERS).find((k) =>
        MARKERS[k].some((m) => transcript.toLowerCase().includes(m))
      );
      setResult(key ? VOICE_SAMPLES.find((s) => s.id === key).result : GENERIC_RESULT);
      setLoading(false);
    }, 650);
  };

  const askMic = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicState("unsupported");
      setMicMsg("This browser does not support microphone input — type or load a sample instead.");
      return;
    }
    setMicState("asking");
    setMicMsg("Requesting microphone permission…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicState("granted");
      setMicMsg("Microphone connected — live speech-to-text ships in a later phase. A labelled sample transcript was loaded below.");
      setTranscript(VOICE_SAMPLES[0].transcript);
    } catch (e) {
      setMicState("denied");
      setMicMsg("Microphone access was denied or unavailable. Nothing was recorded — you can type or load a sample instead.");
    }
  };

  return (
    <section id="bharat" className="py-16 sm:py-24" data-testid="bharat-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          no="02"
          kicker="Voice-First Bharat"
          accent="emerald"
          title="Where voice is the interface."
          desc="[Pitch placeholder — why speech-first products win for Bharat. Try the sample demo below: load a sample, edit the transcript, then build the profile.]"
        />

        <Reveal className="mt-8">
          <div className="glass rounded-3xl p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="emerald">Sample input — clearly labelled</Tag>
              <span className="text-xs text-tx-faint">Tap a sample, or type your own.</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {VOICE_SAMPLES.map((s, i) => (
                <button
                  key={s.id}
                  data-testid={`voice-bharat-sample-btn-${i + 1}`}
                  onClick={() => loadSample(s)}
                  className="rounded-full border border-emer/40 bg-emer/10 px-3.5 py-2 text-xs font-semibold text-emer-soft transition-all hover:-translate-y-0.5 hover:bg-emer/20"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <label htmlFor="bharat-transcript" className="field-label mt-6 block">
              Transcript — editable
            </label>
            <textarea
              id="bharat-transcript"
              data-testid="voice-bharat-input"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="[Spoken-style sentences appear here — type or load a sample, then edit freely.]"
              className="mt-2 min-h-[110px] w-full resize-y rounded-2xl border border-line/15 bg-bg/50 p-4 text-sm leading-relaxed text-tx placeholder:text-tx-faint"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                data-testid="voice-bharat-build-btn"
                onClick={build}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-emer px-5 py-2.5 text-sm font-bold text-[#04211B] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Building…" : "Build my profile"}
              </button>
              <button
                data-testid="voice-bharat-mic-btn"
                onClick={askMic}
                className="inline-flex items-center gap-2 rounded-full border border-emer/40 px-5 py-2.5 text-sm font-semibold text-emer-soft transition-colors hover:bg-emer/10"
              >
                <Mic className="h-4 w-4" />
                Use microphone
              </button>
            </div>

            <div aria-live="polite" className="mt-3 min-h-[20px] text-xs" data-testid="voice-bharat-mic-msg">
              {error && (
                <p role="alert" className="text-tan-soft" data-testid="voice-bharat-error">
                  {error}
                </p>
              )}
              {micMsg && <p className={micState === "granted" ? "text-emer-soft" : "text-tan-soft"}>{micMsg}</p>}
            </div>

            {loading ? (
              <div data-testid="voice-bharat-loading" className="mt-6 rounded-2xl border border-line/10 p-6">
                <p className="field-label">Building sample profile…</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line/10">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-emer/60" />
                </div>
              </div>
            ) : (
              result && (
                <div
                  data-testid="voice-bharat-result"
                  className="mt-6 rounded-2xl border border-emer/30 bg-emer/[0.05] p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <SampleTag>Sample result — fields editable</SampleTag>
                    {!result.conf && <Tag tone="slate">Demo output</Tag>}
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Field label="Role" value={result.role} />
                    <Field label="Experience" value={result.experience} />
                    <Field label="Skills" value={result.skills} />
                    <Field label="Languages" value={result.languages} />
                  </div>
                  {result.conf && (
                    <div className="mt-4 grid gap-2">
                      {["Extraction confidence", "Fields confirmed"].map((lbl, i) => (
                        <div key={lbl} className="flex items-center gap-3 text-xs text-tx-low">
                          <span className="w-40 flex-none">{lbl}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line/10">
                            <div className="h-full rounded-full bg-emer" style={{ width: `${result.conf[i]}%` }} />
                          </div>
                          <span className="w-9 text-right font-mono tabular-nums">{result.conf[i]}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.note && <p className="mt-4 text-xs text-tx-faint">{result.note}</p>}
                </div>
              )
            )}

            <p className="mt-5 text-xs text-tx-faint">
              Concept demo — nothing you type or say is stored or sent.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default BharatDemo;
