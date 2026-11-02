export const CHAPTERS = [
  { id: "hero", no: "00", short: "Intro", full: "Intro" },
  { id: "autopsy", no: "01", short: "Autopsy", full: "The Autopsy" },
  { id: "bharat", no: "02", short: "Bharat", full: "Voice-First Bharat" },
  { id: "secret", no: "03", short: "Secret", full: "The Secret Layer" },
  { id: "receipts", no: "04", short: "Receipts", full: "Voice Receipts" },
  { id: "work", no: "05", short: "Work", full: "Projects & Skills" },
  { id: "about", no: "06", short: "About", full: "About Me" },
  { id: "contact", no: "07", short: "Contact", full: "Contact Me" },
];

export const OWNER_NAME = "Ansik Aryan Samal";

export const HERO = {
  badge: "Built by voice",
  sub: "[Two-line first-person pitch — placeholder. The real intro will be recorded and written here.]",
  playerLabel: "Voice intro — your recording",
  transcriptTag: "Voice recording needed",
  transcript:
    "[Transcript appears once the intro is recorded — add yours in Content Setup.]",
};

export const HERO_PHRASES = ["I build out loud.", "Proof over promises.", "Made by voice."];

export const DECISIONS = Array.from({ length: 6 }, (_, i) => ({
  id: `D-0${i + 1}`,
  title: `[Decision ${String(i + 1).padStart(2, "0")} — title placeholder]`,
  context: "[What was true when this call was made.]",
  decision: "[What was chosen.]",
  reason: "[Why it was chosen over the alternatives.]",
  outcome: "[Result placeholder — not measured yet.]",
  lesson: "[What carried forward.]",
}));

export const PROPOSALS = Array.from({ length: 3 }, (_, i) => ({
  id: `P-0${i + 1}`,
  title: `[Growth experiment ${i + 1} — title placeholder]`,
  hypothesis: "[Hypothesis placeholder — what we believe.]",
  test: "[Test placeholder — how it gets checked cheaply.]",
  kill: "[Kill criterion placeholder — when to stop.]",
}));

export const VOICE_SAMPLES = [
  {
    id: "electrician",
    label: "Sample · Electrician · Hindi",
    transcript:
      "[Sample transcript] Main ek electrician hoon. Paanch saal se residential wiring aur repair ka kaam kar raha hoon. Hindi mein hi baat karna aasaan hai.",
    result: {
      role: "Electrician — residential wiring",
      experience: "5 years",
      skills: "Wiring, fault repair, panel fitting",
      languages: "Hindi",
      conf: [82, 64],
    },
  },
  {
    id: "nurse",
    label: "Sample · Nurse · Telugu",
    transcript:
      "[Sample transcript] Nenu staff nurse. General ward lo moodu years pani chesanu. Patient care, vitals monitoring, IV procedures chestanu.",
    result: {
      role: "Staff nurse — general ward",
      experience: "3 years",
      skills: "Patient care, vitals monitoring, IV procedures",
      languages: "Telugu, English",
      conf: [78, 58],
    },
  },
  {
    id: "driver",
    label: "Sample · Driver · Odia",
    transcript:
      "[Sample transcript] Mu driver, chara barsa ru passenger van chalai. Route planning au customer handling bhal bhabe jani.",
    result: {
      role: "Passenger van driver",
      experience: "4 years",
      skills: "Route planning, customer handling",
      languages: "Odia, Hindi",
      conf: [75, 52],
    },
  },
];

export const GENERIC_RESULT = {
  role: "[Not stated]",
  experience: "[Not stated]",
  skills: "[Not stated]",
  languages: "[Not stated]",
  conf: null,
  note: "Predictable sample demo — this build does not parse free text. Load a sample to see a filled profile.",
};

export const RECEIPTS = Array.from({ length: 3 }, (_, i) => ({
  id: `R-0${i + 1}`,
  title: `[Receipt ${i + 1} — title placeholder]`,
  audio: "Clip placeholder · up to 20 seconds",
  transcript: "[The text that was spoken — placeholder.]",
  change: "[The project change this recording produced — placeholder.]",
}));

export const PROJECTS = [
  {
    id: "p1",
    title: "[Project A — title placeholder]",
    cat: "Voice",
    overview: "[One-line overview of the project.]",
    work: "[What you built, shipped or ran.]",
    tools: ["[Tool]", "[Tool]", "[Tool]"],
  },
  {
    id: "p2",
    title: "[Project B — title placeholder]",
    cat: "Voice",
    overview: "[One-line overview of the project.]",
    work: "[What you built, shipped or ran.]",
    tools: ["[Tool]", "[Tool]", "[Tool]"],
  },
  {
    id: "p3",
    title: "[Project C — title placeholder]",
    cat: "Product",
    overview: "[One-line overview of the project.]",
    work: "[What you built, shipped or ran.]",
    tools: ["[Tool]", "[Tool]", "[Tool]"],
  },
  {
    id: "p4",
    title: "[Project D — title placeholder]",
    cat: "Craft",
    overview: "[One-line overview of the project.]",
    work: "[What you built, shipped or ran.]",
    tools: ["[Tool]", "[Tool]", "[Tool]"],
  },
];

export const PROJECT_CATS = ["All", "Voice", "Product", "Craft"];

export const SKILL_GROUPS = ["A", "B", "C", "D"].map((g) => ({
  id: `sg-${g.toLowerCase()}`,
  name: `[Skill group ${g} placeholder]`,
  items: ["[Skill]", "[Skill]", "[Skill]", "[Skill]"],
}));

export const PLATES = [
  {
    id: "plate-01",
    label: "Plate 01",
    src: "/clues/plate-01.jpg",
    alt: "Grayscale plate one — a weathered concrete wall with fine film grain.",
    riddle: "I am the first shape you learn to draw — a ring with nothing inside.",
    strong: "Plate 01's ghost is the roundest shape on the wall — it curves around the darkest patch.",
  },
  {
    id: "plate-02",
    label: "Plate 02",
    src: "/clues/plate-02.jpg",
    alt: "Grayscale plate two — a brushed metal surface with fine scratches.",
    riddle: "Open at the bottom, I hold water; close me and I am only a letter.",
    strong: "On Plate 02 the ghost opens downward — a smile hidden in the scratches.",
  },
  {
    id: "plate-03",
    label: "Plate 03",
    src: "/clues/plate-03.jpg",
    alt: "Grayscale plate three — dark slate with faint chalk dust.",
    riddle: "I stand straight and hold my arms out flat.",
    strong: "Plate 03's ghost leans on a straight vertical spine in the dust.",
  },
];

export const SECRET = {
  answer: "out",
  story:
    "They say the word hides where nobody sizes the type. Three plates on this bench came off the same roll of film — and each swallowed a letter before it dried. Read them in order, first to third, and the word says itself.",
  howTo: "Start on Plate 01. Push the levels slider and watch the grain give the letter back.",
  hints: [
    "Broad look: the letters are not stickers printed on these photos — they are brightness ghosts living inside the grain itself.",
    "Technique: drag the levels slider to force every pixel toward pure black or pure white — the ghost separates from the noise.",
    "Strong: each ghost sits roughly 8% brighter than its surroundings. Past the middle of the slider, it snaps into view.",
  ],
  feedbackEmpty: "Type your guess first.",
  feedbackWrong: "Not quite — study the plates again, or take another hint.",
  feedbackCorrect: "Solved — the word was OUT.",
  spoilerAnswer: "Spoiler — the hidden word is OUT.",
  solveExplain:
    "O was recovered from Plate 01, U from Plate 02 and T from Plate 03 — each a faint brightness signature pulled from the grain with the levels tool on this bench.",
  unlockBody:
    "[Bonus story placeholder — the unlocked story and the answer to the big question arrive in the next phase, once real material is supplied.]",
  note:
    "The passphrase is part of the puzzle, not security. The plates are prepared at build time and the deciphering runs entirely in your browser — nothing is uploaded.",
  textRoute: "Solve by ear — text route",
};
