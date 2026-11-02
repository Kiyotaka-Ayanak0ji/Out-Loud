import { useRef, useState } from "react";
import { FileImage, Lock, RotateCcw, ShieldCheck } from "lucide-react";

const STATES = {
  idle: "Pick a source, add the passphrase, and decode — all of it stays in your browser.",
  loading: "Loading the image…",
  invalid: "That file does not work as a puzzle image — use the master plate or another stego image.",
  badkey: "The pixels decoded, but the text is scrambled — the passphrase is not right yet.",
  error: "Decoding failed unexpectedly — try again.",
};

/*
 * LSB steganography decoder. Reads the least-significant bit of every red
 * pixel, takes a 32-bit length header, XOR-unscrambles the payload with the
 * passphrase, and rebuilds the text. Nothing is uploaded.
 */
const Decoder = () => {
  const [pass, setPass] = useState("");
  const [imgSrc, setImgSrc] = useState(null);
  const [imgName, setImgName] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState("");
  const fileRef = useRef(null);

  const useMaster = () => {
    setImgName("The portfolio's master plate");
    setImgSrc("/clues/master-plate.png");
    setMessage("");
    setStatus("loading");
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setStatus("invalid");
      return;
    }
    setImgName(f.name);
    setMessage("");
    const r = new FileReader();
    r.onload = () => {
      setImgSrc(r.result);
      setStatus("loading");
    };
    r.onerror = () => setStatus("invalid");
    r.readAsDataURL(f);
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const run = async () => {
    if (!imgSrc) {
      setStatus("invalid");
      return;
    }
    if (!pass.trim()) {
      setStatus("badkey");
      return;
    }
    setStatus("decoding");
    try {
      setProgress("Loading the image into the canvas…");
      await wait(350);
      const img = new Image();
      const loaded = new Promise((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("load"));
      });
      img.src = imgSrc;
      await loaded;
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      if (!W || !H || W * H < 4000 || W > 5000 || H > 5000) {
        setStatus("invalid");
        return;
      }
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const cx = cv.getContext("2d");
      cx.drawImage(img, 0, 0);
      const d = cx.getImageData(0, 0, W, H).data;
      setProgress("Reading the least-significant bits…");
      await wait(350);
      const total = W * H;
      const bytes = new Uint8Array(Math.floor(total / 8));
      let byteI = 0;
      let cur = 0;
      let bitI = 0;
      for (let i = 0; i < total; i++) {
        cur = (cur << 1) | (d[i * 4] & 1);
        bitI++;
        if (bitI === 8) {
          bytes[byteI++] = cur & 255;
          bitI = 0;
          cur = 0;
          if (byteI >= bytes.length) break;
        }
      }
      setProgress("Unscrambling with your passphrase…");
      await wait(350);
      const len = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
      if (!(len > 0 && len < 100000) || 4 + len > bytes.length) {
        setStatus("invalid");
        return;
      }
      const key = new TextEncoder().encode(pass.trim().toLowerCase());
      const payload = new Uint8Array(len);
      for (let i = 0; i < len; i++) payload[i] = bytes[4 + i] ^ key[i % key.length];
      const text = new TextDecoder("utf-8", { fatal: false }).decode(payload);
      if (/[\u0000-\u0008\u000E-\u001F]/.test(text)) {
        setStatus("badkey");
        return;
      }
      setMessage(text);
      setStatus("success");
    } catch (e) {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
    setProgress("");
    setPass("");
    setImgSrc(null);
    setImgName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="glass rounded-3xl p-5 sm:p-6" data-testid="decoder-panel">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-lg font-bold text-tx-hi">The decoder — phase two</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emer/40 bg-emer/10 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest2 text-emer-soft">
          <Lock className="h-3 w-3" />
          Runs in your browser
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-tx-low">
        The plates you deciphered are the warm-up. One master plate on this site carries a whole message in its
        least-significant bits. Solve the three plates, feed the word they spelled to the decoder, and read it.
      </p>

      <div className="mt-4 grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={useMaster}
            data-testid="decoder-source-master-btn"
            className="inline-flex items-center gap-1.5 rounded-full border border-tan/40 bg-tan/10 px-3.5 py-2 text-xs font-semibold text-tan-soft hover:bg-tan/20"
          >
            <FileImage className="h-3.5 w-3.5" />
            Use the master plate
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            data-testid="decoder-source-file-btn"
            className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-3.5 py-2 text-xs font-semibold text-tx-low hover:text-tx-hi"
          >
            Upload an image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
            data-testid="decoder-file-input"
            aria-label="Upload a puzzle image"
          />
          {imgName && (
            <span className="text-xs text-tx-faint" data-testid="decoder-source-name">
              Source: {imgName}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="decoder-pass" className="field-label">
            Passphrase — try what the plates spelled
          </label>
          <input
            id="decoder-pass"
            type="text"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="The word the plates spelled"
            data-testid="decoder-pass-input"
            className="mt-2 w-full rounded-full border border-tan/40 bg-bg/50 px-4 py-2.5 text-sm text-tx placeholder:text-tx-faint"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={run}
            disabled={status === "decoding"}
            data-testid="decoder-run-btn"
            className="rounded-full bg-tan px-5 py-2.5 text-sm font-bold text-[#2A0F04] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            Decode
          </button>
          <button
            type="button"
            onClick={reset}
            data-testid="decoder-reset-btn"
            className="inline-flex items-center gap-1.5 rounded-full border border-line/15 px-4 py-2.5 text-xs font-semibold text-tx-low hover:text-tx-hi"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>

        <div aria-live="polite" className="min-h-[24px] text-sm" data-testid="decoder-status">
          {(status === "decoding" || status === "loading") && progress && <p className="text-tx-low">{progress}</p>}
          {status !== "decoding" && status !== "loading" && status !== "success" && (
            <p className={status === "idle" ? "text-tx-faint" : "text-tan-soft"}>{STATES[status]}</p>
          )}
          {status === "success" && <p className="font-semibold text-emer-soft">Decoded — the hidden message is real.</p>}
        </div>

        {status === "success" && (
          <div className="rounded-2xl border border-emer/40 bg-emer/[0.06] p-4" data-testid="decoder-result">
            <p className="text-sm leading-relaxed text-tx">{message}</p>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-tx-faint">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none text-emer-soft" />
              How it worked: every pixel of the image hides one bit of the message in its least-significant red value.
              The decoder read those bits in order, took the length header, unscrambled the payload with your
              passphrase, and rebuilt the text — all locally. The passphrase is part of the puzzle, not security.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Decoder;
