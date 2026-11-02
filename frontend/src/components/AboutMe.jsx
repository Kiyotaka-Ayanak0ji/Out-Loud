import { SectionHeader } from "./Reveal";
import { useProfile } from "../context/profile-context";
import { ACHIEVEMENTS, CERTIFICATIONS, EDUCATION, EXPERIENCE, LANGUAGES, MISSING } from "../lib/profile-data";

export default function AboutMe() {
  const { profile } = useProfile();
  return <section id="about" className="py-16 sm:py-24" data-testid="about-section"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader no="06" kicker="About Me" title="Ansik Aryan Samal" accent="emerald" desc={profile.about.role} />
    <p className="mt-6 max-w-3xl text-base leading-relaxed" data-testid="about-bio">{profile.about.bio}</p>
    <p className="mt-4 text-sm text-tx-low" data-testid="about-languages">{LANGUAGES}</p>
    <div className="mt-8 grid gap-x-12 lg:grid-cols-2">
      <div><h3 className="mb-5 font-display text-lg font-semibold text-tx-hi">Experience</h3>{EXPERIENCE.map((e, i) => <article key={e.org} className="border-t border-line/15 py-5" data-testid={`experience-${i + 1}`}><h4 className="font-semibold text-tx-hi">{e.role}</h4><p className="mt-1 text-sm text-emer-soft">{e.org}</p><p className="mt-2 text-xs text-tx-low">{e.dates}</p><p className="mt-3 text-sm leading-relaxed text-tx-low">{e.text}</p></article>)}</div>
      <div>{[["Education", EDUCATION], ["Certifications & learning", CERTIFICATIONS], ["Achievements & leadership", ACHIEVEMENTS]].map(([label, items], i) => <details key={label} open={i === 0} className="border-t border-line/15 py-5"><summary className="cursor-pointer font-display text-lg font-semibold text-tx-hi" data-testid={`about-details-${i + 1}`}>{label}</summary><ul className="mt-4 grid gap-4">{items.map((text, j) => <li key={j} className="text-sm leading-relaxed text-tx-low" data-testid={`about-fact-${i + 1}-${j + 1}`}>{text}</li>)}</ul></details>)}
      <p className="mt-3 text-xs leading-relaxed text-tx-low" data-testid="about-evidence">Source: supplied résumés. Language levels are self-assessed. Certificates and results evidence: Upload needed.</p></div>
    </div>
    <div className="mt-6 grid gap-6 border-t border-line/15 pt-6 sm:grid-cols-2"><div data-testid="about-grant"><h3 className="font-display text-lg font-semibold text-tx-hi">The $3,000 work requirement</h3><p className="mt-2 text-sm text-tx-low">{profile.secret.grant || MISSING}</p></div><div data-testid="about-motivation"><h3 className="font-display text-lg font-semibold text-tx-hi">Why voice. Why growth.</h3><p className="mt-2 text-sm text-tx-low">{profile.about.whyVoice || MISSING}</p>{profile.about.whyGrowth && <p className="mt-2 text-sm text-tx-low">{profile.about.whyGrowth}</p>}</div></div>
  </div></section>;
}