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

## Update 2026-11-02 (v2 — polish round)
- Fixed title glitch: the old headline component was defined inline in Hero, so every audio timeupdate re-render remounted it. Replaced with a self-contained Typewriter (own timer state, immune to parent re-renders) rotating three phrases: type → hold → erase → next. Static full phrase when motion off / reduced motion.
- Added dark/light themes: semantic CSS-variable tokens (`--c-*`) mapped through Tailwind (bg/surface/panel/fill/line/tx/acc/emer/tan/amb), applied to every section, card, control, tag and focus ring; inline pre-paint script in index.html prevents theme flash; choice persisted in localStorage; clearly labelled theme toggle in the nav, separate from the motion toggle.
- Rebuilt The Secret Layer as a deciphering bench: three grayscale real-world plates (concrete/metal/wood) with O, U, T genuinely embedded at build time as +30-luminance ghosts on contrast-flattened textures (gen_clue_plates.py); an in-browser canvas levels tool (slider + auto levels) recovers each letter — the method really works on the served pixels. Story, 3 progressive hints + per-plate strong hint, answer input, wrong-answer feedback, reset, spoiler, solve explanation, aria-live feedback, non-visual "solve by ear" riddle route.
- Finish pass: marquee removed, section dividers, consistent tokens in both themes, mobile input width fix, nowrap nav logo.

## Prioritized backlog
- P0 (after approval): real personal content, résumé-based About, real decision cards with evidence, real voice recordings + receipts.
- P1: hidden-image steganography decoder (PNG LSB, browser-based) in Secret Layer; real intro recording replacing TTS sample.
- P2: evidence drawer per decision card; print view; language switcher for hero pitch.

## Next tasks
1. Fill placeholders from résumé + project materials (content.js is the single edit point).
2. Add steganography decoder phase.
3. Replace sample audio with the real voice note.
