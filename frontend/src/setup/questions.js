import { PROJECTS, SKILL_GROUPS } from "../lib/profile-data";
const q = (path, label, type = "textarea") => ({ path, label, type });
const voice = (id, label) => ({ id, label });
export const STEPS = [
  { id: "intro", title: "Voice Intro", questions: [], notes: [voice("intro", "Voice introduction")] },
  { id: "autopsy", title: "The Autopsy", questions: [q("autopsy.projectName", "Project", "input"), q("autopsy.role", "Your contribution"),
    ...Array.from({ length: 6 }, (_, i) => [q(`autopsy.decisions.${i}.title`, `Decision ${i + 1}: title`, "input"), ...["context", "decision", "reason", "result", "lesson"].map((f) => q(`autopsy.decisions.${i}.${f}`, `Decision ${i + 1}: ${f}`))]).flat(),
    ...["happened", "cost", "change"].map((f) => q(`autopsy.mistakes.${f}`, `Mistake 1: ${f}`)),
    ...[0, 1].flatMap((i) => ["happened", "cost", "change"].map((f) => q(`autopsy.additionalMistakes.${i}.${f}`, `Mistake ${i + 2}: ${f}`))),
  ], notes: [voice("autopsy", "Project overview"), ...Array.from({ length: 6 }, (_, i) => voice(`decision-${i + 1}`, `Decision ${i + 1}`)), ...[1, 2, 3].map((i) => voice(`mistake-${i}`, `Mistake ${i}`))] },
  { id: "bharat", title: "Voice-First Bharat", questions: [q("bharat.origin", "Origin story"), q("bharat.users", "Who it is for"), q("bharat.languages", "Language levels"), q("bharat.learned", "User testing and learnings")], notes: [voice("bharat", "Pitch and user insight"), ...["hindi", "telugu", "odia"].map((l) => voice(`bharat-${l}`, `${l[0].toUpperCase() + l.slice(1)} sample`))] },
  { id: "secret", title: "The Secret Layer", questions: [q("secret.story", "Steganography background"), q("secret.message", "Bonus story"), q("secret.grant", "Your $3,000 work requirement, budget and rationale")], notes: [voice("secret", "Secret story and work requirement")] },
  { id: "receipts", title: "Voice Receipts", questions: [
    ...Array.from({ length: 4 }, (_, i) => [q(`receipts.${i}.title`, `Receipt ${i + 1}: title`, "input"), q(`receipts.${i}.transcribed`, `Receipt ${i + 1}: original Flow text (private)`), q(`receipts.${i}.built`, `Receipt ${i + 1}: build result`), q(`receipts.${i}.evidence`, `Receipt ${i + 1}: evidence reference`, "input")]).flat(),
    ...Array.from({ length: 3 }, (_, i) => ["prompt", "words", "typing", "speaking"].map((f) => q(`speedTests.${i}.${f}`, `Test ${i + 1}: ${f}${["typing", "speaking"].includes(f) ? " (seconds)" : ""}`, "input"))).flat(),
    q("speedMethod", "Timing method"), q("buildLog", "Dated build log"), q("voiceLimit", "Where voice fell short"),
  ], notes: [voice("receipts", "Voice workflow"), ...[1, 2, 3, 4].map((i) => voice(`receipt-${i}`, `Receipt ${i}`)), ...[1, 2, 3].map((i) => voice(`speed-${i}`, `Speed test ${i}`))] },
  { id: "projects", title: "Projects & Skills", questions: [
    ...PROJECTS.flatMap((p, i) => [q(`projects.${i}.title`, `Project ${i + 1}: name`, "input"), ...["summary", "work", "tools", "link"].map((f) => q(`projects.${i}.${f}`, `${p.title}: ${f}`, f === "link" ? "input" : "textarea"))]),
    ...SKILL_GROUPS.map((s, i) => q(`skills.${i}.items`, s.name)),
  ], notes: [voice("projects", "Projects and skills"), ...PROJECTS.map((p) => voice(`project-${p.id}`, p.title))] },
  { id: "about", title: "About Me", questions: [q("about.role", "Role", "input"), q("about.bio", "Biography"), q("about.whyVoice", "Why voice"), q("about.whyGrowth", "Why growth"), ...["linkedin", "github", "other"].map((f) => q(`about.${f}`, f === "other" ? "Previous portfolio" : f, "input"))], notes: [voice("about", "Personal story and motivation")] },
  { id: "contact", title: "Contact Me", questions: [q("contact.email", "Public email", "input"), q("contact.location", "Location", "input"), q("contact.availability", "Availability and earliest start", "input"), q("contact.travel", "Bangalore / willingness to travel", "input"), q("contact.video", "Submission video link", "input"), q("contact.post", "Challenge post link", "input")], notes: [voice("contact", "Availability and contact preferences")] },
];