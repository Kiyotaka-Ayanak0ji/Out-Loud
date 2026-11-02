import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";
import { EvidenceTag, PlaceholderTag, Tag } from "./Tags";
import { useProfile } from "../context/profile-context";
import { PROJECTS, PROJECT_CATS, SKILL_GROUPS } from "../lib/content";
import { MEDIA } from "../lib/media";

const ProjectsSkills = () => {
  const { profile } = useProfile();
  const realProjects = profile.projects.filter((p) => p.title && p.title.trim());
  const realSkills = profile.skills.filter((s) => s.name && s.name.trim() && s.items && s.items.trim());
  const mode = realProjects.length ? "real" : "placeholder";

  const placeholderProjects = PROJECTS;
  const cats =
    mode === "real"
      ? ["All", ...new Set(realProjects.map((p) => p.cat || "Work"))]
      : PROJECT_CATS;
  const [cat, setCat] = useState("All");
  const source = mode === "real" ? realProjects : placeholderProjects;
  const list = source.filter((p) => cat === "All" || (p.cat || "Work") === cat);
  const skillGroups = mode === "real" ? realSkills : SKILL_GROUPS;

  const toolsOf = (p) =>
    mode === "real"
      ? (p.tools || "").split(",").map((t) => t.trim()).filter(Boolean)
      : p.tools;

  return (
    <section id="work" className="py-16 sm:py-24" data-testid="work-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          no="05"
          kicker="Projects & Skills"
          title="The work, browsable."
          desc={
            mode === "real"
              ? "Applied from your Content Setup on this device — links show only what you provided."
              : "[Placeholder projects and skill groups — real entries, links and evidence arrive with supplied material.]"
          }
        />

        <Reveal className="mt-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects" data-testid="project-filters">
            {cats.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                data-testid={`project-filter-${c.toLowerCase()}`}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  cat === c
                    ? "bg-acc text-white"
                    : "border border-line/10 bg-fill/5 text-tx-low hover:border-acc-bright/40 hover:text-tx-hi"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {list.map((p, i) => {
            const realIdx = mode === "real" ? realProjects.indexOf(p) : i;
            const hasLink = mode === "real" && p.link && p.link.trim();
            return (
              <Reveal key={p.id || p.title + i} delay={(i % 2) * 0.06} className="h-full">
                <article
                  data-testid={`project-card-${mode === "real" ? "real-" : ""}${(p.id || i + 1)}`}
                  className="glass flex h-full flex-col overflow-hidden rounded-3xl transition-colors hover:border-acc/40"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={MEDIA.projects[realIdx % MEDIA.projects.length]}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
                    {mode === "real" ? (
                      p.evidenceOk ? (
                        <Tag tone="emerald" className="absolute left-4 top-4">Verified</Tag>
                      ) : (
                        <EvidenceTag className="absolute left-4 top-4" />
                      )
                    ) : (
                      <PlaceholderTag className="absolute left-4 top-4" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-tx-hi">{p.title}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-widest2 text-tx-faint">
                        {p.cat || "Work"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-tx-low">{p.summary}</p>
                    <div className="mt-4">
                      <p className="field-label">Work completed</p>
                      <p className="mt-1 text-sm text-tx">{p.work}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {toolsOf(p).map((t, j) => (
                        <span
                          key={j}
                          className="rounded-full border border-line/10 bg-fill/5 px-3 py-1 text-[11px] font-medium text-tx-low"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-2 pt-5">
                      {hasLink ? (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`project-link-${realIdx + 1}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-acc-soft underline decoration-acc/40 underline-offset-2 hover:decoration-acc"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          Open project link
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-acc-soft">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          Links pending — evidence needed
                        </span>
                      )}
                      {mode === "real" && !p.evidenceOk ? <EvidenceTag /> : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g, i) => (
            <Reveal key={g.id || g.name + i} delay={i * 0.05} className="h-full">
              <div data-testid={`skill-group-${i + 1}`} className="h-full rounded-2xl border border-line/10 bg-fill/[0.03] p-5">
                <p className="font-display text-sm font-bold text-tx-hi">
                  {mode === "real" ? g.name : g.name}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(mode === "real"
                    ? g.items.split(",").map((s) => s.trim()).filter(Boolean)
                    : g.items
                  ).map((s, j) => (
                    <span key={j} className="rounded-full border border-acc/25 bg-acc/10 px-2.5 py-1 text-[11px] text-acc-soft">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSkills;
