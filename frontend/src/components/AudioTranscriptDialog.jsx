import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export default function AudioTranscriptDialog({ open, onOpenChange, title, audioSrc, transcriptSrc, testId }) {
  const audio = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [transcriptError, setTranscriptError] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);

  useEffect(() => {
    if (!open || transcript || transcriptError) return undefined;
    const controller = new AbortController();
    fetch(transcriptSrc, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Transcript request failed");
        return response.text();
      })
      .then((text) => setTranscript(text.trim()))
      .catch((error) => {
        if (error.name !== "AbortError") setTranscriptError(true);
      });
    return () => controller.abort();
  }, [open, transcript, transcriptError, transcriptSrc]);

  useEffect(() => {
    const player = audio.current;
    if (!open || !player) return undefined;
    player.pause();
    player.currentTime = 0;
    setRevealedChars(0);
    setHasFinished(false);
    setPlaybackBlocked(false);
    player.play().catch(() => setPlaybackBlocked(true));
    return () => {
      player.pause();
      player.currentTime = 0;
    };
  }, [open]);

  useEffect(() => {
    if (!isPlaying || !transcript) return undefined;
    let frame;
    let lastUpdate = 0;
    const syncText = (timestamp) => {
      if (timestamp - lastUpdate >= 45) {
        const player = audio.current;
        if (player && Number.isFinite(player.duration) && player.duration > 0) {
          setRevealedChars(Math.floor(transcript.length * Math.min(1, player.currentTime / player.duration)));
        }
        lastUpdate = timestamp;
      }
      frame = requestAnimationFrame(syncText);
    };
    frame = requestAnimationFrame(syncText);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, transcript]);

  useEffect(() => {
    if (hasFinished && transcript) setRevealedChars(transcript.length);
  }, [hasFinished, transcript]);

  const playFromStart = () => {
    const player = audio.current;
    if (!player || isPlaying) return;
    player.currentTime = 0;
    setRevealedChars(0);
    setHasFinished(false);
    setPlaybackBlocked(false);
    player.play().catch(() => setPlaybackBlocked(true));
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      const player = audio.current;
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
      setIsPlaying(false);
      setHasFinished(false);
      setPlaybackBlocked(false);
      setRevealedChars(0);
    }
    onOpenChange(nextOpen);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasFinished(true);
    setRevealedChars(transcript.length);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <audio
        ref={audio}
        preload="none"
        src={audioSrc}
        onPlay={() => { setIsPlaying(true); setPlaybackBlocked(false); }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        className="sr-only"
        data-testid={`${testId}-audio`}
      />
      <DialogContent data-lenis-prevent className="max-h-[90vh] max-w-2xl overflow-y-auto border-amb/30 bg-panel text-tx" data-testid={`${testId}-dialog`}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-tx-hi">{title}</DialogTitle>
          <DialogDescription className="text-tx-low">Listen to the recording while its transcript is revealed.</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border border-line/10 bg-fill/[0.03] p-4">
          <p className="field-label">Recording & transcript</p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="text-xs text-tx-low" data-testid={`${testId}-audio-status`}>
              {isPlaying ? "Playing your message" : hasFinished ? "Message complete" : playbackBlocked ? "Audio needs a tap to start" : "Preparing your message"}
            </span>
            {!isPlaying && <button
              type="button"
              onClick={playFromStart}
              data-testid={`${testId}-play-btn`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line/15 px-3 py-1.5 text-xs font-semibold text-tx-hi hover:bg-fill/[0.06]"
            >
              {hasFinished ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {hasFinished ? "Play Again" : "Play audio"}
            </button>}
          </div>
          <div className="mt-4 h-px overflow-hidden bg-line/10">
            <div className="h-full bg-amb-soft transition-[width] duration-100" style={{ width: `${transcript.length ? (revealedChars / transcript.length) * 100 : 0}%` }} />
          </div>
          <p className="mt-4 min-h-24 whitespace-pre-wrap text-sm leading-7 text-tx-low" aria-label={transcript || `${title} transcript`} data-testid={`${testId}-transcript`}>
            {transcriptError ? "Transcript unavailable." : transcript ? transcript.slice(0, revealedChars) : "Loading transcript…"}
            {transcript && revealedChars < transcript.length && <span className="caret caret-blink" aria-hidden="true" />}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
