import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { useProfile } from "../context/profile-context";
import { IN_PROGRESS, MISSING } from "../lib/profile-data";
import { safeUrl } from "../lib/safe-url";
import { ProjectArt } from "./ProjectArt";

export default function ProjectsSkills() {
  const { profile } = useProfile();
  const [cat, setCat] = useState("All");
  const cats = ["All", ...new Set(profile.projects.map((p) => p.cat))];
  return <section id="work" className="py-16 sm:py-24" data-testid="work-section"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader no="05" kicker="Projects & Skills" title="Selected work" />
    <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter projects" data-testid="project-filters">{cats.map((c) => <button key={c} aria-pressed={cat === c} data-testid={`project-filter-${c.toLowerCase().replace(/[^a-z]+/g, "-")}`} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${cat === c ? "border-acc bg-acc text-white" : "border-line/15 text-tx-low hover:border-acc"}`}>{c}</button>)}</div>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">{profile.projects.filter((p) => cat === "All" || p.cat === cat).map((p) => <Reveal key={p.id} className="h-full"><article className="glass flex h-full flex-col rounded-3xl p-5 sm:p-6" data-testid={`project-card-${p.id}`}>
      <div className="mb-5 aspect-[16/9] overflow-hidden rounded-2xl border border-line/10 bg-bg/40" data-testid={`project-image-${p.id}`}>
        {p.image ? <img src={p.image} alt={`${p.title} landing page`} loading="lazy" className="h-full w-full object-cover object-top" /> : <ProjectArt kind={p.art} />}
      </div>
      <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="max-w-full font-display text-xl font-semibold text-tx-hi">{p.title}</h3>{p.status && <span className="text-xs text-amb-soft" data-testid={`project-status-${p.id}`}>{p.status}</span>}</div>
      <p className="mt-3 text-base leading-relaxed text-tx-low">{p.summary || MISSING}</p><p className="mt-4 text-sm leading-relaxed">{p.work || MISSING}</p>
      {p.metric && <p className="mt-4 border-l-2 border-acc/50 pl-3 text-sm leading-relaxed text-acc-soft" data-testid={`project-metric-${p.id}`}>{p.metric}</p>}
      {p.tools && <p className="mt-5 text-xs leading-relaxed text-tx-low" data-testid={`project-tools-${p.id}`}>{p.tools}</p>}
      {p.detail && <details className="mt-5 border-t border-line/10 pt-3"><summary className="cursor-pointer text-sm font-medium text-tx-hi" data-testid={`project-details-${p.id}`}>Details</summary><p className="mt-3 text-sm leading-relaxed text-tx-low" data-testid={`project-evidence-${p.id}`}>{p.detail}</p></details>}
      <div className="mt-auto flex flex-wrap gap-4 pt-5">{(p.links || []).filter(([, url]) => safeUrl(url)).map(([label, url]) => <a key={label} href={safeUrl(url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-acc-soft hover:underline" data-testid={`project-link-${p.id}-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{label}<ArrowUpRight className="h-4 w-4" /></a>)}</div>
    </article></Reveal>)}</div>
    <p className="mt-8 text-sm text-tx-low" data-testid="projects-in-progress">{IN_PROGRESS}</p>
    <details className="mt-12 border-y border-line/15 py-6" open><summary className="cursor-pointer font-display text-lg font-semibold text-tx-hi" data-testid="skills-toggle">Skills & tools</summary>
      <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">{profile.skills.map((s, i) => <div key={s.id || i} data-testid={`skill-group-${i + 1}`}><h3 className="font-semibold text-tx-hi">{s.name}</h3><p className="mt-2 text-sm leading-relaxed text-tx-low">{s.items}</p></div>)}</div>
    </details>
  </div></section>;
}
