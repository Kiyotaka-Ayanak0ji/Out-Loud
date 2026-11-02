# Out Loud — PRD

## Original problem statement
Build a polished, mobile-first portfolio web app called **Out Loud** — memorable, explorable in ~3 minutes. Build ONLY the first demo: one scrolling page with 8 sections (Hero / The Autopsy / Voice-First Bharat / The Secret Layer / Voice Receipts / Projects & Skills / About Me / Contact Me), clearly-marked placeholders everywhere, no backend, no invented facts, global animation toggle (motion-only, respects OS reduced-motion by default), trust + accessibility rules (Evidence needed badges, no data collection, keyboard operable, transcripts for audio). Stop after the demo and wait for approval before adding real content, evidence-backed Autopsy, voice recordings or the steganography decoder.

## User decisions (from conversation)
- Hero audio: real short placeholder audio clip (generated TTS sample) + animated waveform + visible transcript labelled "Sample — no recording yet"; no autoplay.
- Easter egg hidden word: **OUT** (3 clue images hide O, U, T).
- Owner name "Ansik Aryan Samal" may be used sparingly (About + Contact rows only); everything else stays placeholder.
- Design round: user reviewed 4 skeleton directions (design-lab.html, still served at /design-lab.html) then asked for a fresh, unique, premium, modern-professional direction not bound to the original brief's palette → design_agent produced "Swiss Tactical Modern" system (Syne / Plus Jakarta Sans / JetBrains Mono, ink #0A0D14 base, indigo #6366F1 primary, emerald/tangerine/amber chapter accents).

## Architecture
- Frontend-only React (CRA + craco) + Tailwind; NO backend calls (privacy rule: nothing stored or sent). FastAPI backend from template left untouched.
- `src/context/motion-context.js` — global motion state (default = !prefers-reduced-motion), sets `data-motion="off"` on <html>.
- `src/lib/scroll.js` — lenis smooth scrolling (created only when motion on); anchor scrolling falls back to native.
- `src/lib/content.js` — ALL copy/data centralized for easy later editing (single content source).
- `src/lib/media.js` — generated artwork URLs (hero wave, 3 clue letters, 4 project thumbs).
- Components: Nav (+ MotionToggle, mobile overlay), Hero (masked line-by-line reveal, real <audio> player, waveform, transcript), Marquee (slow editorial loop), Autopsy (6 expandable decision cards + mistakes panel + 3 "Proposal" cards), BharatDemo (3 sample chips, editable transcript, deterministic sample results, mic permission flow with granted/denied/unsupported states), SecretLayer (clue tracker, answer check, retry feedback, hint after 2 attempts, always-visible spoiler, reset), Receipts (3 placeholder cards), ProjectsSkills (filter tabs + placeholder cards + skill groups), AboutMe, ContactMe, Footer.
- Audio asset: `/audio/intro-sample.mp3` generated via emergentintegrations OpenAI TTS (tts-1-hd, voice "fable") — clearly labelled sample.
- Favicon/logo: original "O + sound arcs" SVG mark.

## Implemented (2026-11-02)
- All 8 sections in order, mobile-first (390px) → desktop, no horizontal overflow.
- Verified: nav links scroll to sections; decision cards expand/collapse; sample→"Build my profile" produces editable labelled sample result; empty-input error feedback; mic button requests permission only on click with clear feedback; easter egg accepts "out" (case-insensitive), retry feedback, hint, spoiler, reset; animation toggle flips motion site-wide with content/controls fully usable in both modes; audio plays on click.
- Honesty: every personal field is [bracketed placeholder]; "Evidence needed" tags; "Not measured" notes; receipts marked placeholder; no metrics claimed anywhere.

## Prioritized backlog
- P0 (after approval): real personal content, résumé-based About, real decision cards with evidence, real voice recordings + receipts.
- P1: hidden-image steganography decoder (PNG LSB, browser-based) in Secret Layer; real intro recording replacing TTS sample.
- P2: evidence drawer per decision card; print view; language switcher for hero pitch.

## Next tasks
1. Fill placeholders from résumé + project materials (content.js is the single edit point).
2. Add steganography decoder phase.
3. Replace sample audio with the real voice note.
