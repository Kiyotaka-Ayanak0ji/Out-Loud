import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Sparkles } from "lucide-react";
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
  const autoStarted = useRef(false);
  const [words, setWords] = useState(["", ""]);
  const [won, setWon] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [transcriptError, setTranscriptError] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [replayPending, setReplayPending] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);

  useEffect(() => {
    if (!open || transcript) return undefined;
    const controller = new AbortController();
    fetch(BONUS.transcript, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Transcript request failed");
        return response.text();
      })
      .then((text) => setTranscript(text.trim()))
      .catch((error) => {
        if (error.name !== "AbortError") setTranscriptError(true);
      });
    return () => controller.abort();
  }, [open, transcript]);

  useEffect(() => {
    const player = audio.current;
    if (!open || won || !player) return undefined;
    const startPlayback = () => player.play().catch(() => setPlaybackBlocked(true));
    if (!autoStarted.current) {
      autoStarted.current = true;
      startPlayback();
    } else if (!hasFinished && !player.ended && player.paused) {
      startPlayback();
    }
    return () => player.pause();
  }, [open, won, hasFinished]);

  useEffect(() => {
    if (!isPlaying || !transcript) return undefined;
    let frame;
    let lastUpdate = 0;
    const syncText = (timestamp) => {
      if (timestamp - lastUpdate >= 45) {
        const player = audio.current;
        if (player && Number.isFinite(player.duration) && player.duration > 0) {
          const progress = Math.min(1, player.currentTime / player.duration);
          setRevealedChars(Math.floor(transcript.length * progress));
        }
        lastUpdate = timestamp;
      }
      frame = requestAnimationFrame(syncText);
    };
    frame = requestAnimationFrame(syncText);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, transcript]);

  const playAgain = () => {
    const player = audio.current;
    if (!player || isPlaying) return;
    player.currentTime = 0;
    setRevealedChars(0);
    setReplayPending(true);
    player.play().catch(() => {
      setIsPlaying(false);
      setReplayPending(false);
      setPlaybackBlocked(true);
    });
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasFinished(true);
    setReplayPending(false);
    setRevealedChars(transcript.length);
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      const player = audio.current;
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
      setIsPlaying(false);
      setReplayPending(false);
      setPlaybackBlocked(false);
      setRevealedChars(hasFinished ? transcript.length : 0);
    }
    onOpenChange(nextOpen);
  };

  const solve = (i) => (w) => setWords((ws) => ws.map((x, j) => (j === i ? w : x)));
  const bonusStory = profile?.secret?.message?.trim();
  return <Dialog open={open} onOpenChange={handleOpenChange}>
    <DialogContent data-lenis-prevent className="max-h-[90vh] max-w-2xl overflow-y-auto border-tan/30 bg-panel text-tx" data-testid="bonus-dialog">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display text-2xl text-tx-hi"><Sparkles className="h-5 w-5 text-tan-soft" />Bonus Section Unlocked</DialogTitle>
        <DialogDescription className="text-tx-low">You found the whisper. One clip, two riddles, one final answer.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="rounded-2xl border border-line/10 bg-fill/[0.03] p-4" data-testid="bonus-clip">
          <p className="field-label">A note from Ansik</p>
          <audio ref={audio} preload="auto" src={BONUS.clip} onPlay={() => { setIsPlaying(true); setPlaybackBlocked(false); }} onPause={() => setIsPlaying(false)} onEnded={handleEnded} className="sr-only" data-testid="bonus-audio" />
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="bonus-waveform flex h-8 shrink-0 items-center gap-1" data-playing={isPlaying} aria-hidden="true">
                {[35, 62, 44, 80, 52, 94, 58, 76, 40, 68, 34, 58].map((height, index) => <span key={index} className="wf-bar wf-anim w-[3px] rounded-full bg-tan-soft" style={{ height: `${height}%`, animationDelay: `${index * 70}ms` }} />)}
              </div>
              <span className="truncate text-xs text-tx-low" data-testid="bonus-audio-status">{isPlaying ? "Playing your message" : hasFinished ? "Message complete" : playbackBlocked ? "Audio needs a tap to start" : "Preparing your message"}</span>
            </div>
            {hasFinished && <button type="button" onClick={playAgain} disabled={replayPending} data-testid="bonus-replay-btn" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line/15 px-3 py-1.5 text-xs font-semibold text-tx-hi transition-colors hover:bg-fill/[0.06] disabled:cursor-not-allowed disabled:opacity-45"><RotateCcw className="h-3.5 w-3.5" />Play Again</button>}
            {!hasFinished && !isPlaying && <button type="button" onClick={playAgain} data-testid="bonus-play-btn" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line/15 px-3 py-1.5 text-xs font-semibold text-tx-hi hover:bg-fill/[0.06]"><Play className="h-3.5 w-3.5" />Play audio</button>}
          </div>
          <div className="mt-4 h-px overflow-hidden bg-line/10"><div className="h-full bg-tan-soft transition-[width] duration-100" style={{ width: `${transcript.length ? (revealedChars / transcript.length) * 100 : 0}%` }} /></div>
          <p className="mt-4 min-h-24 whitespace-pre-wrap text-sm leading-7 text-tx-low" aria-label={transcript || "Bonus section transcript"} data-testid="bonus-transcript">
            {transcriptError ? "Transcript unavailable." : transcript ? transcript.slice(0, revealedChars) : "Loading transcript…"}
            {transcript && revealedChars < transcript.length && <span className="caret caret-blink" aria-hidden="true" />}
          </p>
        </div>
        {bonusStory && <p className="text-sm text-tx-low" data-testid="bonus-story">Bonus story: {bonusStory}</p>}
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
