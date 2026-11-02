import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MicOff, Pause, Play } from "lucide-react";
import { useMotion } from "../context/motion-context";
import { useProfile } from "../context/profile-context";
import { scrollToSection } from "../lib/scroll";
import { CHAPTERS, HERO } from "../lib/content";
import { MEDIA } from "../lib/media";
import Typewriter from "./Typewriter";
import { Tag } from "./Tags";

const BARS = [12, 20, 28, 36, 26, 40, 22, 32, 16, 28, 38, 24, 14, 22, 30, 18];
const fmt = (t) => {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const Hero = () => {
  const { motionOn } = useMotion();
  const { profile } = useProfile();
  const hasAudio = !!profile.intro.audio;
  const hasTranscript = !!profile.intro.transcript?.trim();
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);
  const secRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.9, 0.15]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a || !hasAudio) return;
    if (playing) a.pause();
    else a.play().catch(() => setAudioError(true));
  };

  const pct = dur ? Math.min(100, (time / dur) * 100) : 0;

  return (
    <section
      id="hero"
      ref={secRef}
      data-testid="hero-section"
      className="relative overflow-hidden pt-28 sm:pt-32 lg:min-h-screen lg:pt-36"
    >
      {!motionOn ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-15%] h-[480px] w-[480px] rounded-full bg-acc/20 blur-[120px]"
        />
      ) : (
        <motion.div
          aria-hidden
          style={{ y: glowY, opacity: glowOpacity }}
          className="pointer-events-none absolute -top-32 right-[-15%] h-[480px] w-[480px] rounded-full bg-acc/20 blur-[120px]"
        />
      )}

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:pb-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amb/40 bg-amb/10 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-amb-soft">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amb" />
            {HERO.badge}
          </span>
          <div className="mt-6">
            <Typewriter />
          </div>
          <p className="mt-6 max-w-md text-base leading-relaxed text-tx-low">{HERO.sub}</p>
          <nav aria-label="Chapters" className="mt-8 flex flex-wrap gap-2">
            {CHAPTERS.slice(1).map((c) => (
              <button
                key={c.id}
                data-testid={`chapter-link-${c.id}`}
                onClick={() => scrollToSection(c.id)}
                className="rounded-full border border-line/10 bg-fill/5 px-3.5 py-2 text-xs font-semibold text-tx-low transition-all hover:-translate-y-0.5 hover:border-acc-bright/50 hover:text-tx-hi"
              >
                <span className="mr-1.5 font-mono text-acc-soft">{c.no}</span>
                {c.full}
              </button>
            ))}
          </nav>
        </div>

        <div className="relative">
          <div className="glass overflow-hidden rounded-3xl">
            <div className="relative h-36 sm:h-44">
              <img src={MEDIA.heroWave} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/30 to-transparent" />
              <p className="absolute bottom-3 left-5 font-mono text-[10px] uppercase tracking-widest2 text-tx-low">
                {HERO.playerLabel}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              {hasAudio ? (
                <>
                  <div className="flex items-center gap-4">
                    <button
                      data-testid="hero-audio-play-btn"
                      onClick={togglePlay}
                      aria-label={playing ? "Pause the intro recording" : "Play the intro recording"}
                      className="grid h-12 w-12 flex-none place-items-center rounded-full bg-acc text-white shadow-[0_10px_30px_-8px_rgba(99,102,241,0.7)] transition-transform hover:scale-105"
                    >
                      {playing ? (
                        <Pause className="h-[18px] w-[18px]" />
                      ) : (
                        <Play className="ml-0.5 h-5 w-5" />
                      )}
                    </button>
                    <div className="flex h-12 flex-1 items-center gap-[3px]" aria-hidden>
                      {BARS.map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px`, animationDelay: `${i * 0.09}s` }}
                          className={`wf-bar w-[3px] rounded-full bg-gradient-to-t from-acc to-violet-400 ${playing ? "wf-anim" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] tabular-nums text-tx-faint">
                      {fmt(time)} / {fmt(dur || 0)}
                    </span>
                  </div>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-line/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-acc to-violet-400 transition-all duration-200"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </>
              ) : (
                <div
                  className="flex items-center gap-3 rounded-2xl border border-amb/30 bg-amb/[0.07] p-4"
                  data-testid="hero-audio-needed"
                >
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-amb/15 text-amb-soft">
                    <MicOff className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-tx-hi">Voice recording needed</p>
                    <p className="text-xs leading-relaxed text-tx-low">
                      The real intro will play here once it is recorded in Content Setup. Everything else on this
                      page works without it.
                    </p>
                  </div>
                </div>
              )}
              <div
                className="mt-5 rounded-2xl border border-dashed border-line/15 bg-fill/[0.03] p-4"
                data-testid="hero-transcript"
              >
                <Tag tone={hasAudio ? "emerald" : "amber"}>
                  {hasAudio ? "Recorded intro — plays on tap only" : "Voice recording needed"}
                </Tag>
                <p className="mt-2.5 text-sm leading-relaxed text-tx-low">
                  {hasTranscript
                    ? profile.intro.transcript
                    : "[Transcript appears once the intro is recorded — add yours in Content Setup.]"}
                </p>
              </div>
              {audioError && (
                <p className="mt-3 text-xs text-tan-soft" data-testid="hero-audio-error">
                  Audio could not play in this browser — the transcript above shows the same content.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {hasAudio && (
        <audio
          ref={audioRef}
          src={profile.intro.audio}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setTime(0);
          }}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          onError={() => setAudioError(true)}
        />
      )}
    </section>
  );
};

export default Hero;
