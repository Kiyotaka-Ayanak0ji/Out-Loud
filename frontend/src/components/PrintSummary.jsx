import { RESUME as R } from "../lib/resume";

const List = ({ items }) => items.length ? <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul> : null;

export default function PrintSummary() {
  return <div id="print-root" data-testid="print-summary">
    <h1>{R.name}</h1>
    <p>{R.contact.join(" | ")}</p>
    <p>{R.links.map(([k, v], i) => <span key={k}>{i ? " | " : ""}{k}: <a href={`https://${v}`}>{v}</a></span>)}</p>
    <h2>Professional summary</h2><p>{R.summary}</p>
    <h2>Technical skills</h2>{R.skills.map(([k, v]) => <p key={k}><b>{k}:</b> {v}</p>)}
    <h2>Projects</h2>{R.projects.map(([t, stack, items]) => <div className="print-project" key={t}><p><b>{t}</b> | {stack}</p><List items={items} /></div>)}
    <h2>Work experience</h2>{R.experience.map(([org, role, dates, items]) => <div className="print-project" key={org}><p><b>{org}</b> | {role} | {dates}</p><List items={items} /></div>)}
    <h2>Education</h2>{R.education.map((t) => <p key={t}>{t}</p>)}
    <h2>Certifications</h2><List items={R.certifications} />
    <h2>Achievements and leadership</h2><List items={R.achievements} />
    <h2>Languages</h2><p>{R.languages}</p>
  </div>;
}
