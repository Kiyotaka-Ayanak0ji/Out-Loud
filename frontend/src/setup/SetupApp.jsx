import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Download, Eye, Save, RotateCcw } from "lucide-react";
import { useProfile } from "../context/profile-context";
import { BASE_PROFILE } from "../lib/profile-data";
import { STEPS } from "./questions";
import { QuestionField } from "./Fields";
import { VoiceNote } from "./VoiceNote";
import { downloadJson, get, set as setPath } from "./utils";
import { loadLocalDraft, saveLocalDraft } from "./storage";

const fresh = () => ({ ...structuredClone(BASE_PROFILE), voiceNotes: {} });
export default function SetupApp() {
  const { applyProfile, clearProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(fresh);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    loadLocalDraft().then((saved) => {
      if (active && saved) setDraft(saved);
    }).catch(() => { if (active) setError("Local storage is unavailable. Download your draft before closing this page."); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  const update = (path, value) => { setDraft((d) => setPath(d, path, value)); setStatus("Unsaved local changes"); };
  const save = async () => {
    try { await saveLocalDraft(draft); setError(""); setStatus("Draft saved on this device, including recordings and transcripts."); }
    catch { setError("Could not save locally. Download your draft to keep recordings and transcripts."); }
  };
  const current = STEPS[step];
  const review = !current;
  const button = "inline-flex items-center justify-center gap-2 rounded-full border border-line/20 px-4 py-2.5 text-sm font-medium transition-colors hover:border-acc";
  return <div className="min-h-screen bg-bg px-4 py-8 font-body text-tx sm:px-6" data-testid="setup-app"><div className="mx-auto max-w-4xl">
    <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="font-display text-3xl font-semibold text-tx-hi">Content Setup</h1><a href="#/" data-testid="setup-back-link" className={button}><ArrowLeft className="h-4 w-4" />Portfolio</a></div>
    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-tx-low" data-testid="setup-privacy">Local editor, not a password-protected account. Use a trusted device: anyone with this browser profile can open saved drafts. Recordings and transcripts never appear in the public portfolio or leave this device. Save locally or download explicitly. Transcripts are edited manually; no speech service is connected.</p>
    {!ready ? <p className="mt-8" data-testid="setup-loading">Loading local draft…</p> : <>
      <div className="my-6 flex flex-wrap gap-2" data-testid="setup-progress">{STEPS.map((s, i) => <button key={s.id} data-testid={`setup-step-${s.id}`} onClick={() => setStep(i)} aria-pressed={step === i} className={`${button} ${step === i ? "border-acc bg-acc/10 text-acc-soft" : "text-tx-low"}`}>{s.title}</button>)}<button data-testid="setup-step-review" onClick={() => setStep(STEPS.length)} className={button}>Review & export</button></div>
      {!review ? <div><h2 className="mb-4 font-display text-lg font-semibold text-tx-hi">{current.title}</h2>
        <div className="mb-8" data-testid={`setup-recordings-${current.id}`}>{current.notes.map((note) => <VoiceNote key={note.id} id={note.id} label={note.label} value={draft.voiceNotes?.[note.id]} onChange={(v) => update(`voiceNotes.${note.id}`, v)} />)}</div>
        <div className="grid gap-6">{current.questions.map((q) => <QuestionField key={q.path} q={q} value={get(draft, q.path)} onChange={update} />)}</div>
        <div className="mt-8 flex justify-between gap-3"><button disabled={step === 0} data-testid="setup-back-btn" onClick={() => setStep(Math.max(0, step - 1))} className={`${button} disabled:opacity-40`}><ArrowLeft className="h-4 w-4" />Back</button><button data-testid="setup-next-btn" onClick={() => setStep(step + 1)} className={button}>Next<ArrowRight className="h-4 w-4" /></button></div>
      </div> : <div data-testid="setup-review"><h2 className="font-display text-lg font-semibold text-tx-hi">Review & export</h2><div className="my-5 divide-y divide-line/10">{STEPS.map((s, i) => <button key={s.id} data-testid={`setup-review-edit-${s.id}`} onClick={() => setStep(i)} className="flex w-full items-center justify-between py-4 text-left"><span>{s.title}</span><span className="text-sm text-tx-low">{s.notes.filter((n) => draft.voiceNotes?.[n.id]?.audio).length}/{s.notes.length} recordings</span></button>)}</div>
        <button onClick={() => { applyProfile(draft); setStatus("Text preview applied on this device until reload. Audio and transcripts remain private."); }} data-testid="setup-apply-btn" className={button}><Eye className="h-4 w-4" />Preview text on this device</button>
        <p className="mt-4 text-sm text-tx-low" data-testid="setup-preview-privacy">Preview includes edited portfolio text only. Audio, transcripts and original Flow text are excluded. No publishing or sharing service is connected.</p>
      </div>}
      <div className="mt-8 flex flex-wrap gap-3 border-t border-line/15 pt-6"><button onClick={save} data-testid="setup-save-btn" className={button}><Save className="h-4 w-4" />Save draft locally</button>
        <button onClick={() => downloadJson(draft, "out-loud-private-draft.json")} data-testid="setup-download-btn" className={button}><Download className="h-4 w-4" />Download private draft</button>
        <button onClick={async () => { if (!window.confirm("Remove all local edits, recordings and transcripts and restore the supplied résumé content?")) return; const reset = fresh(); try { await saveLocalDraft(reset); localStorage.removeItem("outloud-profile-v1"); localStorage.removeItem("outloud-profile-draft-v1"); clearProfile(); setDraft(reset); setError(""); setStatus("Local draft reset to source content."); } catch { setError("Could not clear the local draft. Please retry."); } }} data-testid="setup-clear-btn" className={`${button} text-tan-soft`}><RotateCcw className="h-4 w-4" />Reset local draft</button>
      </div>
      <p className="mt-4 text-sm text-emer-soft" role="status" data-testid="setup-save-status">{status}</p><p className="mt-2 text-sm text-tan-soft" role="alert" data-testid="setup-storage-error">{error}</p>
    </>}
  </div></div>;
}