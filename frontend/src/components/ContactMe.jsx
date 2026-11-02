import { ArrowUpRight, Mail } from "lucide-react";
import { SectionHeader } from "./Reveal";
import { useProfile } from "../context/profile-context";
import { MISSING } from "../lib/profile-data";
import { safeUrl } from "../lib/safe-url";

export default function ContactMe() {
  const { profile } = useProfile();
  const c = profile.contact;
  return <section id="contact" className="py-16 sm:py-24" data-testid="contact-section"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader no="07" kicker="Contact Me" title="Let’s talk." />
    {c.publish && <div className="mt-8" data-testid="contact-card"><a href={`mailto:${c.email}`} className="inline-flex max-w-full items-center gap-3 break-all font-display text-xl font-semibold text-acc-soft hover:underline sm:text-3xl" data-testid="contact-email"><Mail className="h-6 w-6 flex-none" />{c.email}</a><p className="mt-4 text-sm text-tx-low" data-testid="contact-location">{c.location}</p></div>}
    <div className="mt-6 flex flex-wrap gap-5">{[["LinkedIn", profile.about.linkedin], ["GitHub", profile.about.github], ["Previous portfolio", profile.about.other]].filter(([, url]) => safeUrl(url)).map(([label, url]) => <a key={label} href={safeUrl(url)} target="_blank" rel="noopener noreferrer" data-testid={`contact-link-${label.toLowerCase().replaceAll(" ", "-")}`} className="inline-flex items-center gap-1 text-sm font-semibold text-tx hover:text-acc-soft">{label}<ArrowUpRight className="h-4 w-4" /></a>)}</div>
    <div className="mt-8 grid gap-4 border-t border-line/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">{[["Availability", c.availability], ["Bangalore / travel", c.travel], ["Submission video", c.video], ["Challenge post", c.post]].map(([label, value], i) => <div key={label} data-testid={`contact-extra-${i + 1}`}><p className="field-label">{label}</p>{i > 1 && safeUrl(value) ? <a href={safeUrl(value)} target="_blank" rel="noopener noreferrer" data-testid={`contact-submission-link-${i}`} className="mt-2 block break-all text-sm text-acc-soft">{value}</a> : <p className="mt-2 text-sm text-tx-low">{value || MISSING}</p>}</div>)}</div>
  </div></section>;
}