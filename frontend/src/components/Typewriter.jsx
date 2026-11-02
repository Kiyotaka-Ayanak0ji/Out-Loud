import { useEffect, useState } from "react";
import { useMotion } from "../context/motion-context";
import { HERO_PHRASES } from "../lib/content";

/*
 * Self-contained typewriter: all timers live in this component's own state,
 * so parent re-renders (audio time updates, scroll state, section reveals)
 * can never restart or remount the animation.
 */
const Typewriter = () => {
  const { motionOn } = useMotion();
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState(HERO_PHRASES[0]);
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    if (!motionOn) {
      setText(HERO_PHRASES[0]);
      setPhase("typing");
      return;
    }
    const full = HERO_PHRASES[idx];
    let t;
    if (phase === "typing") {
      t =
        text.length < full.length
          ? setTimeout(() => setText(full.slice(0, text.length + 1)), 60)
          : setTimeout(() => setPhase("holding"), 150);
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("erasing"), 2300);
    } else if (text.length > 0) {
      t = setTimeout(() => setText(full.slice(0, text.length - 1)), 26);
    } else {
      t = setTimeout(() => {
        setIdx((i) => (i + 1) % HERO_PHRASES.length);
        setPhase("typing");
      }, 450);
    }
    return () => clearTimeout(t);
  }, [text, phase, idx, motionOn]);

  return (
    <h1
      data-testid="hero-typewriter"
      className="min-h-[2.2em] font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl"
    >
      <span className="bg-gradient-to-r from-acc-bright via-acc-soft to-fuchsia-500 bg-clip-text text-transparent">
        {text}
      </span>
      {motionOn && <span className="caret caret-blink" aria-hidden="true" />}
    </h1>
  );
};

export default Typewriter;
