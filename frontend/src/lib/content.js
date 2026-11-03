export { OWNER_NAME, DECISIONS, PROJECTS, SKILL_GROUPS } from "./profile-data";
export const CHAPTERS = [
  ["hero", "Intro", "Intro"], ["autopsy", "Autopsy", "The Autopsy"],
  ["bharat", "Bharat", "Voice-First Bharat"], ["secret", "Secret", "The Secret Layer"],
  ["receipts", "Receipts", "Voice Receipts"], ["work", "Work", "Projects & Skills"],
  ["about", "About", "About Me"], ["contact", "Contact", "Contact Me"],
].map(([id, short, full], i) => ({ id, short, full, no: `0${i}` }));
export const HERO = {
  sub: "I’m Ansik Aryan Samal, an AI Engineer Intern and full-stack developer in Hyderabad. I build AI tools, data applications and client products from requirements to launch.",
  playerLabel: "Voice intro",
};
export const HERO_PHRASES = ["I build AI tools.", "From idea to launch.", "Code. Data. Product."];
export const PROJECT_CATS = ["All", "Product", "AI & Data", "Security"];
export const VOICE_SAMPLES = [
  { id: "hindi", label: "Hindi", transcript: "Mera naam Ramesh hai. Main das saal se mistri ka kaam kar raha hoon, Hyderabad mein. Rozana paanch sau rupaye leta hoon.", gloss: "My name is Ramesh. I have worked as a mason for ten years in Hyderabad. I charge five hundred rupees per day.", result: { name: "Ramesh", role: "Mason", experience: "10 years", city: "Hyderabad", wage: "INR 500/day", skills: "Not stated", availability: "Not stated", languages: "Hindi" } },
  { id: "telugu", label: "Telugu · beta", transcript: "Naa peru Suresh. Nenu aidu years nundi electrician ga panichestunnanu, Hyderabad lo.", gloss: "My name is Suresh. I have worked as an electrician for five years in Hyderabad.", result: { name: "Suresh", role: "Electrician", experience: "5 years", city: "Hyderabad", wage: "Not stated", skills: "Not stated", availability: "Not stated", languages: "Telugu" } },
  { id: "odia", label: "Odia · beta", transcript: "Mo naa Bijay. Mu pancha barsa dhari mason kama karuchi, Bhubaneswar re.", gloss: "My name is Bijay. I have worked as a mason for five years in Bhubaneswar.", result: { name: "Bijay", role: "Mason", experience: "5 years", city: "Bhubaneswar", wage: "Not stated", skills: "Not stated", availability: "Not stated", languages: "Odia" } },
];
export const GENERIC_RESULT = Object.fromEntries(["name", "role", "experience", "city", "wage", "skills", "availability", "languages"].map((key) => [key, "Not stated"]));
export const PLATES = [
  { id: "plate-01", label: "Plate 01", src: "/clues/plate-01.jpg", alt: "Grayscale concrete texture.", riddle: "I am a ring with nothing inside.", strong: "Look for a round outline on Plate 01." },
  { id: "plate-02", label: "Plate 02", src: "/clues/plate-02.jpg", alt: "Grayscale brushed metal texture.", riddle: "Two upright sides joined by a curve at the bottom.", strong: "Look for a U-shaped curve on Plate 02." },
  { id: "plate-03", label: "Plate 03", src: "/clues/plate-03.jpg", alt: "Grayscale slate texture.", riddle: "I stand straight and hold my arms out flat.", strong: "Look for a vertical line with a crossbar on Plate 03." },
];
export const SECRET = {
  answer: "out", story: "", howTo: "", hints: [
    "Each plate hides one letter as a faint change in brightness.",
    "Adjust the threshold to separate the letter from the texture.",
    "Use Auto levels on each plate and read the letters in order.",
  ],
  feedbackEmpty: "Enter an answer first.", feedbackWrong: "Not quite. Try another threshold or reveal a hint.",
  feedbackCorrect: "Solved. The word is OUT.", spoilerAnswer: "The hidden word is OUT.",
  solveExplain: "O, U and T are embedded as brightness changes in the three plates.",
  unlockBody: "Upload needed.", note: "Images are processed locally. The passphrase is a puzzle, not encryption security.",
};