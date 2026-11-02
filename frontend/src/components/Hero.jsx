import { MicOff } from "lucide-react";
import { HERO } from "../lib/content";
import { MEDIA } from "../lib/media";
import Typewriter from "./Typewriter";

export default function Hero() {
  return <section id="hero" data-testid="hero-section" className="relative overflow-hidden pt-32 sm:pt-40">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-24">
      <div>
        <p className="mb-6 font-display text-lg font-semibold text-tx-hi" data-testid="hero-owner">Ansik Aryan Samal <span className="text-tx-faint">/ Out Loud</span></p>
        <Typewriter />
        <p className="mt-6 max-w-lg text-base leading-relaxed text-tx-low" data-testid="hero-summary">{HERO.sub}</p>
      </div>
      <div className="glass overflow-hidden rounded-3xl">
        <div className="relative aspect-[2/1]">
          <img src={MEDIA.heroWave} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
        </div>
        <div className="flex items-center gap-4 p-6" data-testid="hero-audio-needed">
          <MicOff className="h-5 w-5 flex-none text-acc-soft" />
          <div><p className="text-sm text-tx-low">Voice intro & transcript</p><p className="mt-1 font-medium text-tx-hi">Upload needed.</p></div>
        </div>
      </div>
    </div>
  </section>;
}