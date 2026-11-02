import { useEffect, useRef, useState } from "react";
import { Download, Mic, Square, Trash2, FolderOpen } from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024;
const toDataUrl = (blob) => new Promise((resolve, reject) => {
  const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(blob);
});

export const VoiceNote = ({ id, label, value = {}, onChange }) => {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const recorder = useRef(null);
  const stream = useRef(null);
  const file = useRef(null);
  const mounted = useRef(false);
  const latest = useRef({ value, onChange });
  latest.current = { value, onChange };
  const update = (patch) => latest.current.onChange({ ...latest.current.value, ...patch });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  const accept = async (blob, name) => {
    if (!blob.size || blob.size > MAX_BYTES) { if (mounted.current) setError("Use an audio file between 1 byte and 10 MB."); return; }
    try {
      const audio = await toDataUrl(blob);
      update({ audio, name, transcript: "" });
    } catch { if (mounted.current) setError("Could not read that recording. Please choose it again."); }
  };
  const start = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setError("Recording is unavailable in this browser. Choose a local audio file instead."); return; }
    setState("asking");
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { media.getTracks().forEach((t) => t.stop()); return; }
      stream.current = media;
      const rec = new MediaRecorder(media);
      recorder.current = rec;
      const chunks = []; let size = 0;
      rec.ondataavailable = (e) => { chunks.push(e.data); size += e.data.size; if (size > MAX_BYTES && rec.state === "recording") rec.stop(); };
      rec.onstop = async () => {
        media.getTracks().forEach((t) => t.stop());
        if (mounted.current) setState("idle");
        const mime = rec.mimeType || chunks[0]?.type || "audio/webm";
        await accept(new Blob(chunks, { type: mime }), `${id}.${mime.includes("mp4") ? "m4a" : mime.includes("ogg") ? "ogg" : "webm"}`);
      };
      rec.onerror = () => { media.getTracks().forEach((t) => t.stop()); if (mounted.current) { setError("Recording failed. Choose a local file or try again."); setState("idle"); } };
      rec.start(1000); setState("recording");
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      if (mounted.current) { setError("Microphone access was denied or unavailable. Choose a local audio file instead."); setState("idle"); }
    }
  };
  const busy = state !== "idle";
  const btn = "inline-flex items-center gap-2 rounded-full border border-line/20 px-4 py-2 text-sm transition-colors hover:border-acc disabled:opacity-50";
  return <div className="border-t border-line/15 py-5" data-testid={`voice-note-${id}`}>
    <h3 className="font-semibold text-tx-hi">{label}</h3>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {state === "recording" ? <button onClick={() => { if (recorder.current?.state === "recording") recorder.current.stop(); }} data-testid={`voice-note-stop-btn-${id}`} className={btn}><Square className="h-4 w-4 text-tan-soft" />Stop recording</button> : <button disabled={busy} onClick={start} data-testid={`voice-note-record-btn-${id}`} className={btn}><Mic className="h-4 w-4" />{state === "asking" ? "Waiting for permission…" : value.audio ? "Record replacement" : "Record"}</button>}
      <button disabled={busy} onClick={() => file.current?.click()} data-testid={`voice-note-upload-btn-${id}`} className={btn}><FolderOpen className="h-4 w-4" />{value.audio ? "Replace audio" : "Choose audio file"}</button>
      <input ref={file} type="file" accept="audio/*" aria-label={`Choose audio for ${label}`} className="hidden" data-testid={`voice-note-upload-input-${id}`} onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; setError(""); if (!f.type.startsWith("audio/")) { setError("Choose a supported audio file."); return; } await accept(f, f.name); }} />
      {value.audio && <><a className={btn} href={value.audio} download={value.name || `${id}.webm`} data-testid={`voice-note-download-${id}`}><Download className="h-4 w-4" />Download audio</a><button disabled={busy} aria-label={`Remove recording for ${label}`} title="Remove recording" onClick={() => update({ audio: null, name: "", transcript: "" })} className={btn} data-testid={`voice-note-remove-btn-${id}`}><Trash2 className="h-4 w-4" /></button></>}
    </div>
    {value.audio && <audio controls src={value.audio} preload="metadata" className="mt-4 h-10 w-full max-w-md" data-testid={`voice-note-player-${id}`} />}
    <p className="mt-2 text-sm text-amb-soft" role="status" data-testid={`voice-note-status-${id}`}>{state === "recording" ? "Recording locally…" : error || (!value.audio ? "Recording: Upload needed." : "")}</p>
    <label htmlFor={`transcript-${id}`} className="field-label mt-4 block">Transcript</label>
    <textarea id={`transcript-${id}`} value={value.transcript || ""} onChange={(e) => update({ transcript: e.target.value })} data-testid={`voice-note-transcript-${id}`} rows={3} placeholder="Upload needed." className="mt-2 w-full rounded-lg border border-line/20 bg-bg/50 p-3 text-base" />
  </div>;
};