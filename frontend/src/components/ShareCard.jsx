import { useEffect, useState } from "react";
import { Copy, Download, Linkedin, Share2, Twitter } from "lucide-react";
import { BONUS, caption } from "../lib/bonus";
import { drawShareCard } from "../lib/share-card";

const btn = "inline-flex items-center gap-1.5 rounded-full border border-line/15 px-4 py-2 text-xs font-semibold text-tx-low transition-colors hover:text-tx-hi";

export const ShareCard = () => {
  const url = window.location.origin;
  const [img, setImg] = useState("");
  const [note, setNote] = useState("");
  useEffect(() => { drawShareCard(window.location.host).then(setImg); }, []);
  const copy = async (msg) => {
    try { await navigator.clipboard.writeText(caption(url)); setNote(msg || "Caption copied."); } catch { setNote("Copy failed. Select the caption below and copy it."); }
  };
  const file = async () => new File([await (await fetch(img)).blob()], "out-loud-access-point.png", { type: "image/png" });
  const native = async () => {
    try { const f = await file(); await navigator.share({ files: [f], text: caption(url) }); } catch { setNote("Sharing was cancelled or is unavailable."); }
  };
  const canNative = typeof navigator !== "undefined" && !!navigator.canShare && !!navigator.share;
  return <div className="mt-4 grid gap-4" data-testid="bonus-share">
    {img && <img src={img} alt="Out Loud share card: Found the Whisper. Reached the Access Point." className="w-full rounded-2xl border border-tan/30" data-testid="bonus-share-card" />}
    <div className="flex flex-wrap gap-2">
      <a href={img} download="out-loud-access-point.png" className={btn} data-testid="bonus-download-btn"><Download className="h-3.5 w-3.5" />Download PNG</a>
      <button type="button" onClick={() => copy()} className={btn} data-testid="bonus-copy-btn"><Copy className="h-3.5 w-3.5" />Copy caption</button>
      <button type="button" onClick={() => { copy("Caption copied. Paste it in LinkedIn and type @ to tag Ansik, Wispr Flow and Emergent."); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener"); }} className={btn} data-testid="bonus-linkedin-btn"><Linkedin className="h-3.5 w-3.5" />LinkedIn</button>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption(url, true))}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className={btn} data-testid="bonus-x-btn"><Twitter className="h-3.5 w-3.5" />Post on X</a>
      {canNative && <button type="button" onClick={native} className={btn} data-testid="bonus-native-share-btn"><Share2 className="h-3.5 w-3.5" />Share image</button>}
    </div>
    <p className="text-xs text-tx-low">Instagram: download the card and copy the caption, or use Share image on your phone.</p>
    <p aria-live="polite" className="min-h-[18px] text-xs text-emer-soft" data-testid="bonus-share-note">{note}</p>
    <p className="rounded-xl bg-fill/[0.04] p-3 text-xs leading-relaxed text-tx-low" data-testid="bonus-caption">{caption(url)}</p>
  </div>;
};

export { BONUS };
