# Out Loud: Content Completion, "Find the Whisper" Puzzle and Bonus Unlock

This update fills the Out Loud portfolio with the supplied narrative, résumé and evidence report. It also rebuilds the Secret Layer as a two-stage puzzle: the first stage spells "Find the Whisper", and the second unlocks a Bonus Section with an AI-voiced clip, two riddles and a shareable card.
The visual style, navigation, themes, animation toggle and private editor stay as they are.

## Who it's for
- Hiring reviewers at Wispr Flow and Emergent, who need to understand Ansik's work, decisions and voice-first thinking within a few minutes.
- Curious visitors who enjoy solving puzzles and will share the result card on LinkedIn, X or Instagram.

## Core features and experience

### 1. Content as source of truth
- The supplied material is treated as final. All "Source: …", "Résumé-reported", "self-assessed", "awaiting confirmation" and similar meta labels are removed from the whole site.
- "Upload needed." markers stay only where material is still missing: voice intro, voice notes, recordings, submission video, challenge post and missing screenshots.
- **The Autopsy:** All six decisions are rewritten in full from the narrative, using Context, Decision, Reason, Outcome and Lesson:
  - **Scope and Audience:** 12 iterations, Lovable, database indexes, no caching layer, open-source aim, lessons from the forward-deployed-engineer role.
  - **Plans and Pricing:** the earlier Free / $20 / $40-unlimited idea and why unlimited access was dropped; final plans of Free (30 days, then about 15), Pro at about $5/month and Premium at about $20/month; a possible $40 Premium Plus tier; a 17% annual discount; watchlist PDF export and share links with their link controls; the Premium dashboard; about one lead.
  - **Feature Gating:** the full feature list, Smart Alerts, OAuth, the competitor survey, guest-access abuse and API load, and registration with a roughly 15-day trial.
  - **Payments Approach:** the Stripe waitlist and screening; Razorpay chosen, verified and approved, with currency conversion (about ₹1,800–1,900 for $20); Juspay fees; manual bank transfers rejected as a scam risk; PayPal as a later option; the Lovable cloud server now inactive and the site on a Hostinger domain; no paid subscriptions yet.
  - **Launch and Traffic:** 17,000+ organic views, mostly from the US; branding, SEO, speed and running costs. The Cloudflare country bar chart and the headline stats stay.
- **Mistakes and Changes:** All three entries are filled with Mistake, Cost and Change, including the Goldman Sachs, Amazon and Uber interviews and the networking and habits mistake.
- **Typing versus Talking:** One expanded section containing:
  - the full test passage, shown in a collapsible block
  - timings of 5m20s typing versus 1m30s voice, with the speed multiple and words-per-minute worked out from the passage word count
  - this document would have taken about half a day to type
  - project development cut from 4+ days to about 2–3 days, starting 1 November
  - benefits and trade-offs from 2–3 days of Wispr Flow use
  - regional-language support as a way past English-proficiency barriers
  - the personal 80–90% time-saving estimate
- **Voice Receipts:** The Evidence row is removed. "Flow text" is filled with the dictated passages for each card: Autopsy narrative, Bharat background, Secret Layer instructions and the build prompt. Recording and transcript stay "Upload needed."
- **Selected Work:** Live and repository links are added:
  - EquityIQ live app
  - TrustHire live app (the Job and Company Verification tool)
  - Finance backend GitHub repository and Postman documentation
  - Secure Image Messaging live app and GitHub repository
  - Stock Price Prediction GitHub repository
- **Project images:**
  - EquityIQ and TrustHire get real screenshots of their live landing pages.
  - The other three get minimal illustrations that match the theme, shown without any "screenshot" label.
- **About:**
  - The $3,000 plan is expanded: about ₹2,80,000; 40–50% on a smartphone, wired earphones and accessories; a possible high-end laptop for Wispr Flow work; the rest saved.
  - "Why voice. Why growth." is expanded: regional-language access from remote South Africa to rural India, the Bharat pitch, personal Wispr Flow results, and the motivation to join the Growth team.
  - Skills, summary and other details are refreshed from the new Data Science résumé.
- **Print résumé:** The Print button produces the new tailored Data Science résumé.
  - It shows email and professional links only. The phone number is hidden.
  - Stock Screener figures are aligned with the narrative: Pro about $5, Premium about $20, 17,000+ views.
  - It may run to two A4 pages.

### 2. Secret Layer: "Find the Whisper"
- Three static plates. Each hides one whole word in the lowest bit of one colour channel: FIND, THE, WHISPER, in order.
- The built-in image decoder (colour channel picker plus bit-plane slider) reveals each word. Brightness and contrast tools reveal nothing.
- Visitors join the words into a phrase and submit it. Spaces and capitals are ignored. The answer exists in the site only as a one-way check, never as readable text.
- Progressive hints and a "Show the method" option stay. Neither prints the answer.
- The separate passphrase "master plate" decoder is removed, so there is one decoder.

### 3. Bonus Section
- A correct phrase opens a small dialog: "Bonus Section Unlocked".
- **Bonus clip:** A short clip of about 20–30 seconds, read by an AI voice from a message written from Ansik's material. It is clearly labelled as an AI voice, not Ansik's. It has play and replay controls, never autoplays, and shows its transcript.
- **Two hard riddles:** Solving each one reveals a word, "Access" and "Point". Each riddle has its own hints and retry.
- **Final answer:** Visitors enter the combined answer. "Access Point" in any capitalisation succeeds.
- **Success:** A congratulations message plus a shareable card in the site's theme. The card carries the Out Loud logo, a "Found the Whisper. Reached the Access Point." line, and the site link.
  - Download the card as a PNG.
  - Copy a ready-made caption that tags Ansik, Wispr Flow and Emergent.
  - LinkedIn share opens the post composer. Tags must be selected by typing "@" because LinkedIn does not allow pre-filled tags.
  - X share opens a pre-filled post with the handles.
  - Instagram: download the card and copy the caption. On phones, the native share sheet is offered with the image attached.
- The $3,000 answer is removed from the Secret Layer and Bonus Section, because it already appears in About Me. The bonus story stays in the Bonus Section.

### 4. Polish and gap review
- A full pass over spacing, typography, copy consistency, mobile layout, both themes and the animations-off state.
- The final hand-off includes a short list of remaining gaps and suggested improvements.

## User flow
1. A visitor lands on the hero and moves through the Autopsy, Bharat demo, Secret Layer, Receipts, Work, About and Contact.
2. In the Secret Layer, they pick a plate, then a channel, and slide to the lowest bit plane to read a word. They repeat this for all three plates.
3. They type "Find the Whisper", and the Bonus Section Unlocked dialog opens.
4. They play the bonus clip, solve Riddle 1 (Access) and Riddle 2 (Point), and submit "Access Point".
5. They see the congratulations message, download the card and share it with the prepared caption.
6. A reviewer can press Print at any time to get the tailored résumé.

## UI/UX feel
- The existing look stays: dark ink and light themes, Space Grotesk, glass cards, indigo, teal, coral and amber accents.
- The unlock dialog and success card use the coral Secret Layer accent, with a light celebratory motion that respects the animation toggle.
- No new design concepts. New elements reuse the current card, button and field styles.

## Implementation phases
- **Phase 1 (MVP, built now):** everything above, including content completion, meta-label removal, project links and images, the expanded Typing versus Talking section, the Voice Receipts flow text, the "Find the Whisper" puzzle, the Bonus Section with the AI clip, riddles and share card, the tailored print résumé, the polish pass and the gap list.
- **Phase 2:** Ansik's own voice intro and transcript, submission video, challenge post, voice-receipt recordings, and real screenshots for the remaining projects when they become available.
- **Phase 3:** Optional speech-to-text in the private editor (the earlier paused request), plus any refinements from reviewer feedback.

## Assumptions
- The narrative is authoritative over the résumé wherever they conflict. This covers pricing and views on the site and in the printed résumé.
- The "awaiting confirmation" traffic note and the automated-traffic warning are removed. The Cloudflare country chart and core stats stay.
- The bonus clip uses OpenAI TTS (tts-1-hd, a warm English voice), generated once and shipped as a fixed audio file. It costs a small one-time amount from the Universal Key balance. The script is written by the builder from supplied material.
- The two riddles are written by the builder, aiming for "hard but fair".
- Share handles: Ansik's LinkedIn profile from the résumé; Wispr Flow as @WisprFlow and Emergent as @emergentlabs on X. These are editable if they differ.
- The Bharat background keeps the résumé spelling "E-Cell".
- The old one-page print summary is replaced by the full résumé.
- The private editor at #/setup stays as it is, local-only and unlinked.
