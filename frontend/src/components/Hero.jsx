import { HERO } from "../lib/content";
import Typewriter from "./Typewriter";
import VoiceIntro from "./VoiceIntro";

export default function Hero() {
  return <section id="hero" data-testid="hero-section" className="relative overflow-hidden pt-32 sm:pt-40">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-24">
      <div>
        <p className="mb-6 font-display text-lg font-semibold text-tx-hi" data-testid="hero-owner">Ansik Aryan Samal <span className="text-tx-faint">/ Out Loud</span></p>
        <Typewriter />
        <p className="mt-6 max-w-lg text-base leading-relaxed text-tx-low" data-testid="hero-summary">{HERO.sub}</p>
      </div>
      <VoiceIntro />
    </div>
  </section>;
}