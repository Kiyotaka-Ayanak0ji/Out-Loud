import Logo from "./Logo";
import { Reveal, SectionHeader } from "./Reveal";
import { PlaceholderTag } from "./Tags";
import { OWNER_NAME } from "../lib/content";

const AboutMe = () => (
  <section id="about" className="py-16 sm:py-24" data-testid="about-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader
        no="06"
        kicker="About Me"
        accent="emerald"
        title="In short."
        desc="[Placeholder summary — ready to be updated from a résumé, project materials and timeline when they are supplied.]"
      />
      <Reveal className="mt-8">
        <div className="glass rounded-3xl p-6 sm:p-8" data-testid="about-card">
          <div className="flex flex-wrap items-center gap-4">
            <Logo className="h-11 w-11" />
            <div>
              <p className="font-display text-lg font-bold text-white">{OWNER_NAME}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest2 text-slate-500">[Role placeholder]</p>
            </div>
            <PlaceholderTag className="ml-auto" />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
            [Professional summary placeholder — two or three first-person lines will be filled here from the résumé
            and project materials. Nothing is claimed until it is supplied.]
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["A", "B", "C"].map((g) => (
              <div key={g} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="field-label">[Principle {g}]</p>
                <p className="mt-1 text-xs text-slate-400">[One line on how you work — placeholder.]</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default AboutMe;
