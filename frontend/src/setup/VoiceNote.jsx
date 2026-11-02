import { useRef, useState } from "react";
import { Mic, Square, Trash2, Upload } from "lucide-react";

/*
 * Optional voice note for a setup answer. Recordings and uploads live in this
 * browser session only — nothing is uploaded anywhere. Typed answers always work.
 */
export const VoiceNote = ({ id }) => {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState(null);
  const [err, setErr] = useState("");
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const fileRef = useRef(null);

  const start = async () => {
    setErr("");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
      setErr("Recording is not supported in this browser — type your answer instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        setUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      setRecording(true);
    } catch (e) {
      setErr("Microphone permission was denied — type your answer instead.");
    }
  };

  const stop = () => {
    recRef.current?.stop();
    setRecording(false);
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      setErr("That file is not audio — pick a voice note or type your answer.");
      return;
    }
    setErr("");
    setUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
  };

  return (
    <div className="mt-3" data-testid={`voice-note-${id}`}>
      <div className="flex flex-wrap items-center gap-2">
        {!recording ? (
          <button
            type="button"
            onClick={start}
            data-testid={`voice-note-record-btn-${id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-3 py-1.5 text-[11px] font-semibold text-tx-low transition-colors hover:text-tx-hi"
          >
            <Mic className="h-3.5 w-3.5" />
            Record a voice note
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            data-testid={`voice-note-stop-btn-${id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-tan px-3 py-1.5 text-[11px] font-bold text-[#2A0F04]"
          >
            <Square className="h-3 w-3" />
            Stop recording
          </button>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          data-testid={`voice-note-upload-btn-${id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-3 py-1.5 text-[11px] font-semibold text-tx-low transition-colors hover:text-tx-hi"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload audio
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={onFile}
          data-testid={`voice-note-upload-input-${id}`}
          aria-label="Upload an audio file"
        />
        {url && (
          <>
            <audio src={url} controls className="h-8 max-w-[220px]" data-testid={`voice-note-player-${id}`} />
            <button
              type="button"
              onClick={() => {
                setUrl((old) => {
                  URL.revokeObjectURL(old);
                  return null;
                });
              }}
              aria-label="Remove voice note"
              data-testid={`voice-note-remove-btn-${id}`}
              className="grid h-7 w-7 place-items-center rounded-full border border-line/15 text-tx-faint hover:text-tan-soft"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
      {recording && <p className="mt-1.5 text-[11px] text-tan-soft">Recording… tap stop when done.</p>}
      {err && <p className="mt-1.5 text-[11px] text-tan-soft">{err}</p>}
      <p className="mt-1 text-[10px] text-tx-faint">
        Voice notes stay in this browser session only — nothing is uploaded. Typed answers always work.
      </p>
    </div>
  );
};

/*
 * Intro audio for the public page: record or upload, stored as a data URL in
 * the local draft so it can be applied to this device's public page.
 */
const MAX_AUDIO_BYTES = 3.5 * 1024 * 1024;

export const IntroAudio = ({ value, onChange }) => {
  const [recording, setRecording] = useState(false);
  const [err, setErr] = useState("");
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const fileRef = useRef(null);

  const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });

  const start = async () => {
    setErr("");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
      setErr("Recording is not supported in this browser — upload an audio file instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size > MAX_AUDIO_BYTES) {
          setErr("That recording is too large to keep on this device — keep the intro under about a minute.");
          return;
        }
        onChange(await blobToDataUrl(blob));
      };
      rec.start();
      setRecording(true);
    } catch (e) {
      setErr("Microphone permission was denied — upload an audio file instead.");
    }
  };

  const onFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      setErr("That file is not audio.");
      return;
    }
    if (f.size > MAX_AUDIO_BYTES) {
      setErr("That file is too large — keep the intro under about a minute.");
      return;
    }
    setErr("");
    onChange(await blobToDataUrl(f));
  };

  return (
    <div className="rounded-2xl border border-line/10 bg-fill/[0.03] p-4" data-testid="intro-audio-tool">
      <p className="field-label">Voice recording for the public page (optional)</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {!recording ? (
          <button
            type="button"
            onClick={start}
            data-testid="intro-audio-record-btn"
            className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-3 py-1.5 text-[11px] font-semibold text-tx-low hover:text-tx-hi"
          >
            <Mic className="h-3.5 w-3.5" />
            Record intro
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              recRef.current?.stop();
              setRecording(false);
            }}
            data-testid="intro-audio-stop-btn"
            className="inline-flex items-center gap-1.5 rounded-full bg-tan px-3 py-1.5 text-[11px] font-bold text-[#2A0F04]"
          >
            <Square className="h-3 w-3" />
            Stop recording
          </button>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          data-testid="intro-audio-upload-btn"
          className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-3 py-1.5 text-[11px] font-semibold text-tx-low hover:text-tx-hi"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload audio file
        </button>
        <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={onFile} aria-label="Upload intro audio" data-testid="intro-audio-upload-input" />
        {value && (
          <>
            <audio src={value} controls className="h-8 max-w-[240px]" data-testid="intro-audio-player" />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove intro recording"
              data-testid="intro-audio-remove-btn"
              className="grid h-7 w-7 place-items-center rounded-full border border-line/15 text-tx-faint hover:text-tan-soft"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
      {recording && <p className="mt-1.5 text-[11px] text-tan-soft">Recording… tap stop when done.</p>}
      {err && <p className="mt-1.5 text-[11px] text-tan-soft">{err}</p>}
      <p className="mt-1 text-[10px] text-tx-faint">
        Kept on this device only. Nothing is uploaded, and no voice is generated for you — the page plays your real
        recording, or clearly says a recording is needed.
      </p>
    </div>
  );
};
