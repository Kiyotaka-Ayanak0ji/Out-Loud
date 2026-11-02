import { ArrowUpRight } from "lucide-react";
import { useProfile } from "../context/profile-context";
import { OWNER_NAME } from "../lib/content";

const NotSet = ({ label }) => <p className="notset">{label} — not yet provided</p>;

/*
 * Print-only one-page summary. Reads the profile applied from the private
 * Content Setup on this device; omits or labels anything not provided.
 */
const PrintSummary = () => {
  const { profile } = useProfile();
  const a = profile.about;
  const c = profile.contact;
  const decisions = profile.autopsy.decisions.filter((d) => d.title && d.title.trim());
  const projects = profile.projects.filter((p) => p.title && p.title.trim());
  const skills = profile.skills.filter((s) => s.name && s.name.trim() && s.items && s.items.trim());
  const links = [
    ["Résumé", a.resume],
    ["LinkedIn", a.linkedin],
    ["GitHub", a.github],
    ["Other", a.other],
  ].filter(([, v]) => v && v.trim());

  return (
    <div id="print-root" aria-hidden={true}>
      <div className="mx-auto max-w-[680px] text-black">
        <p className="font-mono text-[8pt] uppercase" style={{ letterSpacing: "0.2em" }}>
          Out Loud — print summary
        </p>
        <h1 style={{ fontSize: "21pt", fontWeight: 800, lineHeight: 1.1, margin: "4pt 0 2pt" }}>{OWNER_NAME}</h1>
        {a.role ? (
          <p style={{ fontSize: "10pt", fontWeight: 600 }}>{a.role}</p>
        ) : (
          <p className="notset">Role — not yet provided</p>
        )}

        <h2>Introduction</h2>
        {profile.intro.transcript ? (
          <p>{profile.intro.transcript}</p>
        ) : (
          <NotSet label="Introduction" />
        )}

        <h2>Selected projects</h2>
        {projects.length ? (
          projects.map((p, i) => (
            <div key={i} style={{ marginBottom: "5pt" }}>
              <p style={{ fontWeight: 700, fontSize: "9.5pt" }}>{p.title}</p>
              {p.summary ? <p>{p.summary}</p> : null}
              {p.work ? <p>Contribution: {p.work}</p> : null}
              {p.tools ? <p>Tools: {p.tools}</p> : null}
              {p.link ? (
                <p>
                  Link: <a href={p.link}>{p.link}</a>
                  {p.evidenceOk ? " (evidence attached)" : " (evidence needed)"}
                </p>
              ) : (
                <p className="notset">Link — not yet provided</p>
              )}
            </div>
          ))
        ) : (
          <NotSet label="Projects" />
        )}

        <h2>Key skills</h2>
        {skills.length ? (
          skills.map((s, i) => (
            <p key={i}>
              <b>{s.name}:</b> {s.items}
            </p>
          ))
        ) : (
          <NotSet label="Skills" />
        )}

        <h2>Decisions worth asking about</h2>
        {decisions.length ? (
          decisions.map((d, i) => (
            <p key={i}>
              <b>{d.title}</b>
              {d.result ? ` — ${d.result}` : " — result not yet provided"}
              {d.evidenceOk ? " (evidence attached)" : ""}
            </p>
          ))
        ) : (
          <NotSet label="Decisions" />
        )}

        <h2>Links</h2>
        {links.length ? (
          links.map(([label, v]) => (
            <p key={label}>
              <b>{label}:</b>{" "}
              <a href={v}>{v}</a>
            </p>
          ))
        ) : (
          <NotSet label="Links" />
        )}

        <h2>Contact</h2>
        {c.publish ? (
          <>
            {c.email ? <p>Email: {c.email}</p> : null}
            {c.location ? <p>Location: {c.location}</p> : null}
            {c.profiles ? <p>Profiles: {c.profiles}</p> : null}
          </>
        ) : (
          <p className="notset">Contact details not published by the owner yet</p>
        )}

        <p style={{ marginTop: "8pt", fontSize: "7.5pt", color: "#555" }}>
          Generated from the private Content Setup on this device · Nothing is claimed without evidence ·
          {" "}out loud, by {OWNER_NAME}
        </p>
      </div>
    </div>
  );
};

export default PrintSummary;
