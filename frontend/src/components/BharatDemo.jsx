import { useState } from "react";
import { SectionHeader } from "./Reveal";
import { GENERIC_RESULT, VOICE_SAMPLES } from "../lib/content";
import { useProfile } from "../context/profile-context";

export default function BharatDemo() {
  const { profile } = useProfile();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const matched = VOICE_SAMPLES.find((s) => s.transcript === input.trim());
  const build = () => {
    if (!input.trim()) { setError("Enter text or choose a sample."); setResult(null); return; }
    setError(matched ? "" : "Free-text extraction is not connected. No personal details have been inferred.");
    setResult({ ...(matched?.result || GENERIC_RESULT) });
  };
  return <section id="bharat" className="py-16 sm:py-24" data-testid="bharat-section"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader no="02" kicker="Voice-First Bharat" title="Regional voices. Fairer access." accent="emerald" desc={profile.bharat.origin} />
    <p className="mt-4 text-xs text-tx-low" data-testid="bharat-evidence">Source: résumés and delivery plan §5.2. Pitch certificate or results link: Upload needed.</p>
    <div className="glass mt-8 rounded-3xl p-5 sm:p-8">
      <p className="text-sm font-medium text-emer-soft" data-testid="bharat-demo-status">Sample-only concept demo</p>
      <p className="mt-2 text-sm text-tx-low" data-testid="bharat-sample-source">Illustrative inputs from the delivery plan, not real worker data. Native-verified audio: Upload needed.</p>
      <div className="mt-5 flex flex-wrap gap-2">{VOICE_SAMPLES.map((s, i) => <button key={s.id} onClick={() => { setInput(s.transcript); setResult(null); setError(""); }} data-testid={`voice-bharat-sample-btn-${i + 1}`} className="rounded-full border border-emer/40 bg-emer/10 px-4 py-2 text-sm font-semibold text-emer-soft transition-colors hover:bg-emer/20">{s.label}</button>)}</div>
      <label htmlFor="bharat-input" className="field-label mt-6 block">Demo input</label>
      <textarea id="bharat-input" data-testid="voice-bharat-input" value={input} onChange={(e) => { setInput(e.target.value); setResult(null); setError(""); }} maxLength={1000} placeholder="Choose a sample or enter text" rows={4} className="mt-2 w-full rounded-2xl border border-line/15 bg-bg/50 p-4 text-base" />
      {matched && <p className="mt-3 text-sm text-tx-low" data-testid="bharat-translation">{matched.gloss}</p>}
      <button onClick={build} data-testid="voice-bharat-build-btn" className="mt-5 rounded-full bg-emer px-5 py-3 text-sm font-semibold text-[#04211B] transition-transform hover:-translate-y-0.5">Build profile</button>
      <p className="mt-3 text-sm text-amb-soft" aria-live="polite" data-testid="voice-bharat-error">{error}</p>
      {result && <div className="mt-5 border-t border-line/10 pt-5" data-testid="voice-bharat-result"><p className="mb-4 text-sm font-medium text-emer-soft">{matched ? "Pre-computed sample result" : "Unfilled profile"}</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(result).map(([key, value]) => <label key={key} className="block"><span className="field-label">{key}</span><input aria-label={`Profile ${key}`} data-testid={`bharat-result-${key}`} value={value} onChange={(e) => setResult({ ...result, [key]: e.target.value })} className="mt-2 w-full rounded-lg border border-line/15 bg-bg/50 p-3 text-sm" /></label>)}</div></div>}
      <p className="mt-5 text-xs text-tx-low" data-testid="bharat-privacy">No microphone capture, uploads or stored visitor data.</p>
    </div>
    <p className="mt-5 text-sm text-tx-low" data-testid="bharat-languages">{profile.bharat.languages}</p>
    <p className="mt-2 text-sm text-tx-low" data-testid="bharat-learning">User testing & learnings: {profile.bharat.learned || "Upload needed."}</p>
  </div></section>;
}