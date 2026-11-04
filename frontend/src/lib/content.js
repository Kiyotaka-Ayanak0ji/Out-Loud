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
export const VOICE_RECEIPTS = [
  { audio: "/audio/autopsy-clip.mp3", transcript: "/audio/autopsy-transcript.txt" },
  { audio: "/audio/bharat-clip.mp3", transcript: "/audio/bharat-transcript.txt" },
  { audio: "/audio/secret-layer-clip.mp3", transcript: "/audio/secret-layer-transcript.txt" },
  { audio: "/audio/build-prompt-clip.mp3", transcript: "/audio/build-prompt-transcript.txt" },
];
export const GENERIC_RESULT = Object.fromEntries(["name", "role", "experience", "city", "wage", "skills", "availability", "languages"].map((key) => [key, "Not stated"]));
export const PLATES = [
  { id: "plate-01", label: "Plate 01", src: "/clues/plate-01.png", alt: "Grayscale concrete texture.", channel: 2, strong: "Plate 01: the blue channel, plane 0." },
  { id: "plate-02", label: "Plate 02", src: "/clues/plate-02.png", alt: "Grayscale brushed metal texture.", channel: 0, strong: "Plate 02: the red channel, plane 0." },
  { id: "plate-03", label: "Plate 03", src: "/clues/plate-03.png", alt: "Grayscale weathered wood planks.", channel: 1, strong: "Plate 03: the green channel, plane 0." },
];
export const CHANNELS = ["Red", "Green", "Blue"];
export const SECRET = {
  answerHash: "2350a5a236b81fdcc0dc5187006274a31fc9401a9c3bf9f3bf8df302b3490eb1", story: "", howTo: "", hints: [
    "Brightness and contrast will not help. Each plate hides one word below what the eye can see.",
    "Each pixel value is a stack of eight bits. Look at one colour channel one bit plane at a time.",
    "The lowest plane carries the words, and each plate uses a different channel. Read the plates in order to form a phrase.",
  ],
  feedbackEmpty: "Enter an answer first.", feedbackWrong: "Not quite. Try another channel or plane, or reveal a hint.",
  feedbackCorrect: "Solved.", spoilerMethod: "Method shown. The bench now displays the right channel and plane for each plate.",
  solveExplain: "Each plate stores one word in the lowest bit of one colour channel. A change of 1 in a pixel value is invisible and survives any brightness tool, but the bit-plane view isolates it.",
  unlockBody: "Upload needed.", note: "Images are processed locally in your browser.",
};