import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, AudioLines, Pause, Play, RotateCcw } from "lucide-react";
import { useMotion } from "../context/motion-context";
import { MEDIA } from "../lib/media";
import { scrollToSection } from "../lib/scroll";

const AUTOPLAY_KEY = "outloud-voice-intro-autoplay";

const formatTime = (time) => {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function VoiceIntro() {
  const { motionOn } = useMotion();
  const audioRef = useRef(null);
  const artRef = useRef(null);
  const contextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const didAutoplayRef = useRef(false);
  const autoplayAtLoadRef = useRef(
    window.localStorage.getItem(AUTOPLAY_KEY) === "true",
  );
  const transcriptViewportRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [transcriptError, setTranscriptError] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [autoplay, setAutoplay] = useState(autoplayAtLoadRef.current);
  const [playbackError, setPlaybackError] = useState("");
  const [visualizerError, setVisualizerError] = useState(false);
  const [preferenceError, setPreferenceError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/audio/voice-intro-transcript.txt", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Transcript request failed");
        return response.text();
      })
      .then((text) => setTranscript(text.trim().replace(/\*\*(.*?)\*\*/g, "$1")))
      .catch((error) => {
        if (error.name !== "AbortError") setTranscriptError(true);
      });
    return () => controller.abort();
  }, []);

  const syncTranscript = useCallback(() => {
    const player = audioRef.current;
    if (!player || !transcript || !Number.isFinite(player.duration) || player.duration <= 0) return;
    setCurrentTime(player.currentTime);
    setRevealedChars(Math.floor(transcript.length * Math.min(1, player.currentTime / player.duration)));
  }, [transcript]);

  const playAudio = useCallback((restart = false) => {
    const player = audioRef.current;
    if (!player) return;
    if (restart) {
      player.currentTime = 0;
      setCurrentTime(0);
      setRevealedChars(0);
      setHasFinished(false);
    }
    setPlaybackError("");

    try {
      const AudioContextType = window.AudioContext;
      if (!AudioContextType) throw new Error("Web Audio is unavailable");
      if (!contextRef.current) contextRef.current = new AudioContextType();
      if (!sourceRef.current) sourceRef.current = contextRef.current.createMediaElementSource(player);
      if (!analyserRef.current) {
        const analyser = contextRef.current.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.82;
        sourceRef.current.connect(analyser);
        analyser.connect(contextRef.current.destination);
        analyserRef.current = analyser;
      }
      if (contextRef.current.state === "suspended") {
        contextRef.current.resume().catch(() => setVisualizerError(true));
      }
      setVisualizerError(false);
    } catch (error) {
      setVisualizerError(true);
    }

    player.play().catch((error) => {
      setPlaybackError(
        error.name === "NotAllowedError"
          ? "Your browser needs a tap to start the audio. Press play to try again."
          : "The audio could not be played. Please try again.",
      );
    });
  }, []);

  useEffect(() => {
    if (!autoplayAtLoadRef.current || didAutoplayRef.current) return;
    didAutoplayRef.current = true;
    playAudio();
  }, [playAudio]);

  useEffect(() => {
    if (!hasFinished || !transcript) return;
    setRevealedChars(transcript.length);
    if (duration > 0) setCurrentTime(duration);
  }, [duration, hasFinished, transcript]);

  useEffect(() => () => {
    audioRef.current?.pause();
    if (contextRef.current && contextRef.current.state !== "closed") {
      contextRef.current.close();
    }
    didAutoplayRef.current = false;
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (artRef.current) {
        artRef.current.style.setProperty("--voice-high", "0");
        artRef.current.style.setProperty("--voice-low", "0");
      }
      return undefined;
    }

    const player = audioRef.current;
    const analyser = analyserRef.current;
    if (!player) return undefined;
    const frequencies = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    let frame;
    let lastTextUpdate = 0;

    const tick = (timestamp) => {
      if (timestamp - lastTextUpdate >= 50) {
        syncTranscript();
        lastTextUpdate = timestamp;
        const viewport = transcriptViewportRef.current;
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
      }

      if (motionOn && analyser && frequencies && artRef.current) {
        analyser.getByteFrequencyData(frequencies);
        const sampleRate = contextRef.current.sampleRate;
        const frequencyPerBin = sampleRate / analyser.fftSize;
        let lowEnergy = 0;
        let lowCount = 0;
        let highEnergy = 0;
        let highCount = 0;
        frequencies.forEach((value, index) => {
          const frequency = index * frequencyPerBin;
          if (frequency >= 35 && frequency <= 250) {
            lowEnergy += value;
            lowCount += 1;
          } else if (frequency >= 1800 && frequency <= 8500) {
            highEnergy += value;
            highCount += 1;
          }
        });
        const low = lowCount ? Math.min(1, (lowEnergy / lowCount / 255) * 2.4) : 0;
        const high = highCount ? Math.min(1, (highEnergy / highCount / 255) * 2.8) : 0;
        artRef.current.style.setProperty("--voice-low", low.toFixed(3));
        artRef.current.style.setProperty("--voice-high", high.toFixed(3));
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, motionOn, syncTranscript, transcript]);

  const handleAutoplayChange = (event) => {
    const enabled = event.target.checked;
    try {
      window.localStorage.setItem(AUTOPLAY_KEY, String(enabled));
      setAutoplay(enabled);
      setPreferenceError(false);
    } catch (error) {
      setPreferenceError(true);
    }
  };

  const handleSkip = () => {
    const player = audioRef.current;
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    setCurrentTime(0);
    setRevealedChars(0);
    setHasStarted(false);
    setHasFinished(false);
    scrollToSection("autopsy");
  };

  return (
    <div className="glass overflow-hidden rounded-3xl" data-testid="hero-voice-intro">
      <div
        ref={artRef}
        className="voice-intro-art relative aspect-[2/1] overflow-hidden"
        data-testid="hero-voice-art"
        data-playing={isPlaying}
      >
        <img src={MEDIA.heroWave} alt="Abstract sound-wave artwork for the voice introduction." className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-panel/10 to-transparent" />
        <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
          <AudioLines className="h-3.5 w-3.5 text-amb-soft" />
          Voice intro
        </div>
        <div className="absolute bottom-5 right-5 z-10 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 font-mono text-[11px] text-white/90 backdrop-blur-md" data-testid="hero-voice-time">
          {formatTime(currentTime)} <span className="text-white/50">/</span> {formatTime(duration)}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="field-label">A note from Ansik</p>
            <p className="mt-1 text-sm text-tx-low">Listen as the story types itself.</p>
          </div>
          <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-acc-soft">
            <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-emer-soft pulse-dot" : "bg-tx-faint"}`} />
            {isPlaying ? "Live" : hasFinished ? "Complete" : "Ready"}
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-line/10 bg-bg/45">
          <div className="flex items-center justify-between border-b border-line/10 px-4 py-2.5">
            <p className="field-label">Live transcript</p>
            <span className="font-mono text-[10px] text-tx-faint">{Math.round(duration ? (currentTime / duration) * 100 : 0)}%</span>
          </div>
          <div className="h-1 bg-fill/[0.04]">
            <div className="h-full bg-gradient-to-r from-acc to-amb transition-[width] duration-100" style={{ width: `${duration ? Math.min(100, (currentTime / duration) * 100) : 0}%` }} />
          </div>
          <div ref={transcriptViewportRef} className="voice-transcript-scroll max-h-40 min-h-24 overflow-y-auto px-4 py-3 sm:max-h-48">
            <p
              className="whitespace-pre-wrap text-sm leading-7 text-tx-low"
              aria-label={transcript || "Voice introduction transcript"}
              data-testid="hero-voice-transcript"
            >
              {transcriptError
                ? "The transcript could not be loaded. You can still listen to the recording."
                : transcript
                  ? revealedChars
                    ? transcript.slice(0, revealedChars)
                    : "Press play to follow the transcript in real time."
                  : "Preparing the transcript…"}
              {transcript && revealedChars > 0 && revealedChars < transcript.length && (
                <span className="caret caret-blink voice-intro-caret" aria-hidden="true" />
              )}
            </p>
          </div>
        </div>

        <audio
          ref={audioRef}
          src="/audio/voice-intro.mp3"
          preload="metadata"
          onPlay={() => { setIsPlaying(true); setHasStarted(true); setHasFinished(false); }}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={syncTranscript}
          onEnded={() => {
            setIsPlaying(false);
            setHasFinished(true);
            setCurrentTime(duration);
            setRevealedChars(transcript.length);
          }}
          onError={() => setPlaybackError("The voice introduction audio could not be loaded.")}
          className="sr-only"
          data-testid="hero-voice-audio"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (isPlaying) audioRef.current?.pause();
              else playAudio(hasFinished);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-acc px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-acc/20 transition-colors hover:bg-acc-bright focus-visible:outline-offset-4"
            data-testid="hero-voice-play-btn"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : hasFinished ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            {isPlaying ? "Pause" : hasFinished ? "Play again" : hasStarted ? "Resume intro" : "Play intro"}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line/15 px-4 py-2.5 text-sm font-medium text-tx-low transition-colors hover:bg-fill/[0.06] hover:text-tx-hi"
            data-testid="hero-voice-skip-btn"
          >
            Skip and explore <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-tx-faint">
          <input
            type="checkbox"
            checked={autoplay}
            onChange={handleAutoplayChange}
            className="mt-1 h-3.5 w-3.5 shrink-0 accent-[rgb(var(--c-acc))]"
            data-testid="hero-voice-autoplay"
          />
          <span>Play automatically on each reload</span>
        </label>
        {playbackError && <p className="mt-2 text-xs text-tan-soft" role="status">{playbackError}</p>}
        {preferenceError && <p className="mt-2 text-xs text-tan-soft" role="status">Your playback preference could not be saved.</p>}
        {visualizerError && motionOn && <p className="mt-2 text-xs text-tx-faint" role="status">Live image highlighting is unavailable in this browser; the audio is unaffected.</p>}
      </div>
    </div>
  );
}
