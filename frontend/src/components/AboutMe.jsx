import Logo from "./Logo";
import { Reveal, SectionHeader } from "./Reveal";
import { PlaceholderTag, Tag } from "./Tags";
import { useProfile } from "../context/profile-context";
import { OWNER_NAME } from "../lib/content";

const AboutMe = () => {
  const { profile } = useProfile();
  const a = profile.about;
  const hasBio = !!(a.bio && a.bio.trim());
  const links = [
    ["Résumé", a.resume],
    ["LinkedIn", a.linkedin],
    ["GitHub", a.github],
    ["Other", a.other],
  ].filter(([, v]) => v && v.trim());

  return (
    <section id="about" className="py-16 sm:py-24" data-testid="about-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          no="06"
          kicker="About Me"
          accent="emerald"
          title="In short."
          desc={
            hasBio
              ? "Applied from your Content Setup on this device — edit it there anytime."
              : "[Placeholder summary — ready to be updated from a résumé, project materials and timeline when they are supplied.]"
          }
        />
        <Reveal className="mt-8">
          <div className="glass rounded-3xl p-6 sm:p-8" data-testid="about-card">
            <div className="flex flex-wrap items-center gap-4">
              <Logo className="h-11 w-11" />
              <div>
                <p className="font-display text-lg font-bold text-tx-hi">{OWNER_NAME}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest2 text-tx-faint">
                  {a.role && a.role.trim() ? a.role : "[Role placeholder]"}
                </p>
              </div>
              {hasBio ? (
                <Tag tone="emerald" className="ml-auto">From your Content Setup</Tag>
              ) : (
                <PlaceholderTag className="ml-auto" />
              )}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-tx sm:text-base">
              {hasBio
                ? a.bio
                : "[Professional summary placeholder — two or three first-person lines will be filled here from the résumé and project materials. Nothing is claimed until it is supplied.]"}
            </p>
            {hasBio && links.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {links.map(([label, v]) => (
                  <a
                    key={label}
                    href={v}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`about-link-${label.toLowerCase()}`}
                    className="rounded-full border border-emer/35 bg-emer/10 px-3.5 py-1.5 text-[11px] font-semibold text-emer-soft transition-colors hover:bg-emer/20"
                  >
                    {label}
                  </a>
                ))}
              </div>
            ) : null}
            {!hasBio && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["A", "B", "C"].map((g) => (
                  <div key={g} className="rounded-2xl border border-line/10 bg-fill/[0.03] p-4">
                    <p className="field-label">[Principle {g}]</p>
                    <p className="mt-1 text-xs text-tx-low">[One line on how you work — placeholder.]</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutMe;
