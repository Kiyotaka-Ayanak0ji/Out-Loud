import { useProfile } from "../context/profile-context";
import { OWNER_NAME, EDUCATION } from "../lib/profile-data";
export default function PrintSummary() {
  const { profile: p } = useProfile();
  return <div id="print-root" data-testid="print-summary"><h1>{OWNER_NAME}</h1><p>{p.about.role}</p><p>{p.contact.publish ? `${p.contact.email} · ${p.contact.location}` : ""}</p>
    <h2>Profile</h2><p>{p.about.bio}</p><h2>Selected work</h2>
    {p.projects.map((project) => <div className="print-project" key={project.id}><p><b>{project.title}{project.status ? ` (${project.status})` : ""}.</b> {project.summary}</p></div>)}
    <h2>Project outcomes</h2><p>Résumé-reported: 5,300+ stocks and about 10,000 views in 3 to 4 months for the Stock Screener; 95% unseen-data accuracy for the job authenticity tool. Supporting evidence: Upload needed.</p>
    <h2>Core skills</h2><p>Python, JavaScript, TypeScript, SQL, React.js, Node.js, Express.js, Flask, FastAPI, PostgreSQL, MongoDB, Scikit-learn, RAG, prompt engineering.</p>
    <h2>Education</h2><p>{EDUCATION[0]}</p><p>Data Science and Artificial Intelligence, IIT Roorkee and Masai School. Ongoing, 2026.</p>
    <h2>Links</h2><p>{p.about.linkedin}</p><p>{p.about.github}</p><p>{p.about.other}</p>
    <h2>Availability & work requirement</h2><p>Availability: {p.contact.availability || "Upload needed."} The $3,000 answer: {p.secret.grant || "Upload needed."}</p>
  </div>;
}