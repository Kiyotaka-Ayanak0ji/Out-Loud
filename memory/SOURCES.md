# Source ledger for Out Loud content refresh

Reviewed: 2026-11-02. Primary source PDFs and exact extracted text are in `/app/reference/` (not in the public directory).

## Source mapping
- `software.pdf` / `software.txt`: Software Developer ATS résumé, 2 pages.
- `data.pdf` / `data.txt`: Data Science ATS résumé, 2 pages.
- `ai.pdf` / `ai.txt`: AI Architect OpenAI résumé, 2 pages.
- `plan.pdf` / `plan.txt`: Out Loud Application Concept and Delivery Plan, v1.0, 31 October 2026, 29 pages.
- Source-backed public data: `frontend/src/lib/profile-data.js`.

## Accuracy decisions
- All 7 distinct projects are represented. Text-to-SQL appears only in the Data Science résumé. Secure Notes remains In progress.
- Clyptus start date is NOT supplied (AI résumé literally says `[Start date]`; Data résumé says Present). Do not use NxtWave dates for Clyptus. No role-specific Clyptus work is supplied.
- GitHub uses the digit zero: `Kiyotaka-Ayanak0ji`, confirmed by direct PDF extraction in all three versions. The initial AI extraction misread it.
- About 10,000 **views** in **3 to 4 months**, not users, sign-ups, revenue or conversions. Analytics export remains missing.
- 5,300+ NSE/BSE stocks and Free / Pro $20/month / Premium $40/month are résumé-reported. Dataset and pricing screenshots remain missing per plan §9.2.
- 95% accuracy on unseen data is résumé-reported, not independently tested. Original evaluation is missing.
- Text-to-SQL: 100 evaluation pairs is reported; zero safety violations is a **target**, not a proven outcome. No latency or execution accuracy numbers supplied. Avoid absolute claims about never executing wrong SQL.
- Team pitch ranked 4th in India, not an individual award; NEC E-Summit 2024 at IIT Bombay. Certificate/results missing.
- Proposed welfare tie-ups, not established partnerships. Language levels are self-assessed. Reference language utterances are illustrative, not native-verified.
- Growth H1-H3 come from plan p10. Test counts and kill thresholds are explicitly illustrative proposals.
- No Verified badges assigned to whole projects based on a checkbox. Source attribution is distinct from primary evidence.
- All education, work experience, achievements, certifications, broad technical skills are represented. Current learning and certifications in preparation remain qualified.
- $3,000 answer, mistakes, personal motivations, speech recordings, receipts, speed timings, actual build log, availability and travel preference remain missing; marked exactly `Upload needed.`.
- Latest user instruction overrides plan's built-by-voice badge, hero chapter links and live extraction: no promotional badge, navbar handles navigation, no model integration.
- No download links to unredacted PDFs are exposed because they include a phone number; user approved email and professional links only.

## Preservation
- Existing theme palette, page structure, typewriter, plate puzzle and design lab retained.
- Modern font is self-hosted Space Grotesk (OFL license alongside font).
- Owner recorder is unlisted `/#/setup`, local-only, explicitly not authenticated. No cloud storage, auth or model integration added.
- All owner audio and transcripts remain separate from public content and local text previews.
- Browser LSB decoder aligned with plan's RGB + length + XOR + CRC-32 frame. Static message is `Upload needed.` until actual story is supplied.