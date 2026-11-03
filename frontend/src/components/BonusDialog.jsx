import { useRef, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Riddle } from "./Riddle";
import { ShareCard } from "./ShareCard";
import { BONUS } from "../lib/bonus";
import { matches } from "../lib/hash";
import { useProfile } from "../context/profile-context";

const FinalAnswer = ({ onWin }) => {
  const [guess, setGuess] = useState("");
  const [state, setState] = useState("idle");
  const submit = async (e) => {
    e.preventDefault();
    if (!guess.trim()) return setState("empty");
    if (await matches(guess, BONUS.finalHash)) onWin(); else setState("wrong");
  };
  return <form onSubmit={submit} className="rounded-2xl border border-tan/30 bg-tan/[0.06] p-4" data-testid="bonus-final">
    <p className="field-label">Final answer</p><p className="mt-1 text-xs text-tx-low">Combine both words, in order.</p>
    <div className="mt-3 flex flex-wrap gap-2"><input value={guess} onChange={(e) => { setGuess(e.target.value); setState("idle"); }} aria-label="Final answer" data-testid="bonus-final-input" className="min-w-0 flex-1 rounded-full border border-tan/40 bg-bg/50 px-4 py-2 text-sm" />
      <button type="submit" data-testid="bonus-final-submit" className="rounded-full bg-tan px-4 py-2 text-xs font-bold text-[#2A0F04]">Submit</button></div>
    <p aria-live="polite" className="mt-2 text-xs text-tan-soft" data-testid="bonus-final-feedback">{state === "empty" ? "Enter an answer first." : state === "wrong" ? "Not quite. Check the two words and try again." : ""}</p>
  </form>;
};

export const BonusDialog = ({ open, onOpenChange }) => {
  const { profile } = useProfile();
  const audio = useRef(null);
  const [words, setWords] = useState(["", ""]);
  const [won, setWon] = useState(false);
  const solve = (i) => (w) => setWords((ws) => ws.map((x, j) => (j === i ? w : x)));
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent data-lenis-prevent className="max-h-[90vh] max-w-2xl overflow-y-auto border-tan/30 bg-panel text-tx" data-testid="bonus-dialog">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display text-2xl text-tx-hi"><Sparkles className="h-5 w-5 text-tan-soft" />Bonus Section Unlocked</DialogTitle>
        <DialogDescription className="text-tx-low">You found the whisper. One clip, two riddles, one final answer.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="rounded-2xl border border-line/10 bg-fill/[0.03] p-4" data-testid="bonus-clip">
          <p className="field-label">Bonus clip · AI voice, not Ansik’s</p>
          <audio ref={audio} controls preload="none" src={BONUS.clip} className="mt-3 w-full" data-testid="bonus-audio" />
          <button type="button" onClick={() => { audio.current.currentTime = 0; audio.current.play(); }} data-testid="bonus-replay-btn" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-tx-low hover:text-tx-hi"><RotateCcw className="h-3.5 w-3.5" />Replay</button>
          <details className="mt-2"><summary className="cursor-pointer text-xs font-semibold text-tx-hi" data-testid="bonus-transcript-toggle">Transcript</summary><p className="mt-2 text-sm leading-relaxed text-tx-low" data-testid="bonus-transcript">{BONUS.transcript}</p></details>
        </div>
        <p className="text-sm text-tx-low" data-testid="bonus-story">Bonus story: {profile.secret.message || "Upload needed."}</p>
        {BONUS.riddles.map((r, i) => <Riddle key={r.id} r={r} idx={i} word={words[i]} onSolve={solve(i)} />)}
        {words.every(Boolean) && !won && <FinalAnswer onWin={() => setWon(true)} />}
        {won && <div className="animate-in fade-in zoom-in-95 duration-300 rounded-2xl border border-emer/40 bg-emer/[0.06] p-4" data-testid="bonus-success">
          <p className="font-display text-xl font-semibold text-emer-soft">Congratulations. You reached the Access Point.</p>
          <p className="mt-1 text-sm text-tx-low">Share your card and tag Ansik, Wispr Flow and Emergent.</p>
          <ShareCard />
        </div>}
      </div>
    </DialogContent>
  </Dialog>;
};
