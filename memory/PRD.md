# Out Loud: product requirements and handoff

## Original goal
Build a polished, mobile-first portfolio called **Out Loud**: memorable, explorable in about three minutes, and organised into Hero, The Autopsy, Voice-First Bharat, The Secret Layer, Voice Receipts, Projects & Skills, About Me, and Contact Me. Frontend-only, no backend data persistence. Include dark/light themes, a motion toggle, browser-based steganography, a printable summary, and a local content setup tool.

## Current user requirements (2026-11-02)
- Use the supplied three résumés and application concept/delivery plan as the source of truth. Fill every relevant section, without unsupported claims or invented numbers.
- Missing facts, files, evidence and recordings must read exactly **Upload needed.**
- Concise professional copy, no generic AI filler, explanatory section commentary, promotional tags such as Built by Voice, or double-dash prose.
- Record/replay/replace audio and edit associated transcripts for every spoken-input section, only in a private editing area. Never automatically publish, upload or share recordings/transcripts.
- Without server-side access control, use an unlisted local editor and remove it from public navigation. Do not claim it is an authenticated owner account.
- Modern, professional, readable, slightly edgy font. Preserve the existing premium feel, palette, page structure, themes and design lab. No new visual concepts.
- Navbar handles section navigation; remove redundant hero chapter links.
- User approved **email and professional links**, not phone publication.
- User explicitly cancelled the GPT-Astra request: **no model integration**.

## Source materials
Four supplied PDFs and exact extracted text live in `/app/reference/`, outside public assets:
- `software.pdf` / `.txt`: Software Developer résumé.
- `data.pdf` / `.txt`: Data Science résumé.
- `ai.pdf` / `.txt`: AI Architect résumé.
- `plan.pdf` / `.txt`: Out Loud Application Concept and Delivery Plan, v1.0, 31 October 2026.

`/app/memory/SOURCES.md` records source locations, reconciliation decisions and claim limits. No original résumé PDF is linked publicly because it includes the non-approved phone number.

## Architecture
- React CRA/craco, Tailwind, Framer Motion, Lenis. Frontend-only; template backend is not used by the app.
- `src/lib/profile-data.js`: source-backed public baseline, seven projects, six decisions, three proposals, skill groups, work experience, education, achievements, certifications and missing content.
- `src/lib/content.js`: navbar structure, hero copy, source-derived illustrative Bharat samples, puzzle clues.
- `src/context/profile-context.js`: public profile starts from `BASE_PROFILE`, never from localStorage or private drafts. Explicit text preview is in-memory until reload and strips all audio, voice transcripts and original receipt Flow text.
- `src/setup/SetupApp.jsx`, `questions.js`, `Fields.jsx`: unlisted hash route `/#/setup`, source-filled text fields, eight editor steps, review, explicit local save/download/reset, temporary local text preview.
- `src/setup/VoiceNote.jsx`: 34 section/decision/mistake/language/project/receipt recording groups. Browser MediaRecorder, local audio file selection, playback, replacement, per-recording manual transcript editor and audio download. Audio encoded as data URLs, 10 MB per-recording limit. Tracks stop when recording stops or controls unmount, including late permission responses.
- `src/setup/storage.js`: IndexedDB `outloud-owner-local`, store `drafts`, key `owner`. Explicit save includes recordings and transcripts; no automatic cloud upload or publishing. Local save errors surface and JSON export stays available.
- Existing legacy localStorage drafts are not loaded into public content or silently deleted. Explicit confirmed reset removes legacy local keys as well as resetting the current IndexedDB draft.
- `src/components/*`: eight public sections, responsive nav, footer, one-page print summary.
- `src/lib/steganography.js`: local RGB LSB decoding with 32-bit length, XOR passphrase and CRC-32, matching the supplied reference format. `backend/gen_master_plate.py` is an offline asset utility, not an API.
- `src/context/theme-context.js`, `motion-context.js`: existing dark/light and reduced-motion behaviour preserved.
- `src/components/Reveal.jsx`: stable motion.div wrapper across animation toggles, preventing canvas/child remounts.
- `public/fonts/`: self-hosted variable Space Grotesk and OFL license; one consistent font family across public UI, editor and print.
- `public/design-lab.html`: preserved unchanged, accessible by direct URL.

## Implemented history
### Earlier rounds, 2026-11-02
- Premium custom portfolio after four design-lab variants.
- Stable title typewriter, dark/light themes, motion setting.
- Three grayscale clue plates containing O/U/T, local threshold tool, hints, spoiler and browser decoder.
- Local content setup and printable summary.

### Source refresh and privacy work, 2026-11-02
- Replaced generic portfolio placeholders with source-backed content for all eight sections and all seven distinct projects.
- Added full experience, education, certifications, achievements, self-assessed languages and grouped skills. Learning/in-progress qualifications preserved.
- Stock Screener decisions use only supported facts; missing reasons, lessons, screenshots and analytics marked Upload needed.
- Metrics attributed as résumé-reported, not independently verified. No blanket Verified badges. 10,000 views remain views, 95% accuracy is reported not independently measured, and zero SQL safety violations remains a target.
- Three India growth proposals taken from the plan, with explicitly illustrative thresholds.
- Public Bharat inputs/results match the reference's illustrative Hindi/Telugu/Odia examples. Exact samples only; arbitrary/altered input yields unfilled fields, never keyword-based invented values. No fake confidence values or public recording control.
- Four voice-receipt slots, three timing rows, build log, work-requirement answer and missing materials marked Upload needed.
- Removed old placeholder project artwork, public setup links, Built by Voice claims/tags, hero chapter buttons and generic commentary.
- Source email and professional links published as approved. Phone excluded.
- Replaced typography with self-hosted Space Grotesk and refined spacing/heading hierarchy without changing the existing visual direction.
- Added local section-linked recordings, transcript editing, explicit save, JSON/audio downloads, replacement/reset and lifecycle cleanup.
- Private audio/transcripts excluded from public page, local text preview and print. Local editor clearly warns about shared-browser access and has no authentication claim.
- Updated master PNG to decode to Upload needed. instead of a fabricated bonus story; corrected decoder to reference CRC format.
- Fixed failed-image Retry, motion-toggle blank canvas, and 320px navbar clipping.

## Verification
- Production build: `yarn --cwd /app/frontend build` passed.
- Initial browser smoke screenshot passed.
- Testing report: `/app/test_reports/iteration_1.json`. Initial 24/26 grouped tests exposed two UI defects; both fixed and full scripts rerun.
- Final results: **26/26 Chromium grouped runtime checks passed** (19 core + 7 edge).
- Scripts: `/app/tests/portfolio_runtime.py`, `/app/tests/portfolio_edges.py`.
- Detailed final results: `/app/test_reports/runtime/results.json`, `edge-results.json`, `responsive.json`.
- Verified navigation, seven project filters/details, eight sections, loaded font, 320/768/1024/1440 in both themes, stable typewriter, preserved design lab.
- Verified all recording control groups, representative audio/transcript round trips in all eight sections, actual MediaRecorder with synthetic input, playback/replacement/download, IndexedDB save/reload, denied/unsupported/late mic permissions, track cleanup, file and storage errors, confirmed reset.
- Verified private content never appears on public page or print, including same-browser preview, fresh context, and legacy localStorage injection. No application-origin uploads/mutation requests or private fixture data in observed requests. Platform-injected requests were distinguished from app behaviour.
- Puzzle/hints/spoiler/retry, CRC near-wrong passphrase, Unicode/bounds and PNG hash tested. Canvas remains 720×720 with nontransparent pixels through both motion toggle directions.
- Print: exactly one A4 page in both themes, white backgrounds, no private transcripts or editing/navigation UI.
- Limits: Chromium automation only; real physical microphone/device and Safari/Firefox not tested. No full accessibility/security audit claimed.

## Deliberate limitations
- **MOCKED / sample-only:** Bharat profile extraction uses precomputed illustrative examples; no live AI or speech-to-text integration, per user instruction.
- Owner transcript editing is manual. No real owner audio supplied or published.
- `/#/setup` is local and unlisted, not password-protected; anyone with the same browser profile can access explicitly saved drafts.
- Public audio and receipts remain Upload needed. Local exports do not publish files.
- No backend, accounts, analytics integration, payment integration or live extraction added.

## Prioritised next actions
### P0
- None. All implemented flows passed the defined Chromium checks.

### P1: owner-supplied content
- Real recordings and checked transcripts; save/export them in the local editor.
- Actual decision rationales, three mistakes, lessons, original Flow text, build log and measured speed tests.
- Stock Screener analytics/pricing/dataset evidence; job-verification evaluation and report; SQL evaluation; project links/screenshots; pitch certificate; internship repository.
- Clyptus start date/contributions, personal voice/growth motivation, $3,000 answer, availability/travel preference, submission video/post.

### P2: verification and later visual edits
- Real-device microphone and Safari/Firefox checks; native-speaker validation of reference language samples.
- Owner visual edits using the preserved design lab, only when requested.

Suggested next material: a Stock Screener analytics export and pricing screenshot would strengthen the main case study without adding features.

## 2026-06 Content update (analytics, build log, narrative)
- Autopsy D-01..D-06 rewritten from user-supplied narrative; Free trial ~15 days, Pro ~$5/mo, Premium ~$20/mo, 17% annual discount; Razorpay chosen (Stripe/Juspay considered); no paid subscriptions yet.
- D-06 shows Cloudflare stats (equityiq.in, 3 Oct to 2 Nov 2026: 17.48k pageviews, 17.02k visits, 48.37k requests, 5xx 52.26%, bot signals) + Core Web Vitals (stockscreener.sbs). View figure discrepancy (17,000+ organic vs ~10,000/3-4 months) awaiting user confirmation.
- Proposal cards removed. Mistakes 1-2 titles filled; cost/change and mistake 3 Upload needed (full source narrative doc not supplied).
- Text-to-SQL and Secure Notes removed from projects; in-progress statement added. Build log from Out_Loud_Project_Build_Log.pdf. Voice limitations, typing vs talking (5m20s vs 1m30s, 80-90% estimate), $3,000, why voice/growth, availability, Bangalore travel added.
- Secret Layer unchanged; puzzle redesign proposal awaiting approval. /app/tests/portfolio_runtime.py PROJECTS list still includes removed project ids.

## 2026-06 Secret Layer redesign + traffic chart
- Plates are lossless PNGs (/app/backend/gen_lsb_plates.py): OU (blue), TL (red), OUD (green) in bit plane 0. Bench = channel picker + bit-plane slider. Text Clues removed. Answer checked by SHA-256 only; Show the method sets channel/plane, never prints the answer. Master plate passphrase is now outloud (spaces ignored).
- D-06 has a CSS bar chart of Cloudflare pageviews by country (top 10).
- R-01 spoken record and Bharat origin updated from user-pasted narrative.
- Pending phase 2: user will supply a tailored résumé for Print summary plus remaining data (mistake 3, costs/changes, pricing & payment reasons). Note: the answer phrase matches the site brand name.
