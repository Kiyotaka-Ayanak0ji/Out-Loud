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
  headlineTop: "I build",
  headlineAccent: "out loud.",
  sub: "[Two-line first-person pitch — placeholder. The real intro will be recorded and written here.]",
  playerLabel: "Sample intro — 10 seconds",
  transcriptTag: "Sample — no recording yet",
  transcript:
    "[Transcript of the sample clip appears here. The real intro transcript will replace it once recorded.]",
};

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

export const SECRET = {
  answer: "out",
  intro:
    "Three images in this chapter each hide a letter. Find all three, then type the word below.",
  feedbackEmpty: "Type your guess first.",
  feedbackWrong: "Not quite — try again.",
  feedbackHint: "Still not it — hint: the word is hiding in plain sight, in the site's name.",
  feedbackCorrect: "Unlocked — the word was OUT.",
  spoilerAnswer: "Spoiler — the hidden word is OUT.",
  unlockBody:
    "[Bonus story placeholder — the unlocked story and the answer to the big question arrive in the next phase, once real material is supplied.]",
  note:
    "The passphrase is part of the puzzle, not security. The hidden-image steganography decoder arrives in a later phase, after this demo is approved.",
};
