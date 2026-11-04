export const BONUS = {
  clip: "/audio/bonus-clip.mp3",
  transcript: "/audio/bonus-transcript.txt",
  riddles: [
    { id: "r1", hash: "a0561fd649cdb6baa784055f051bad796ea0afef17fca38219549deeba4e8c1a", text: "Every request asks for me, but only the right role receives me. I am granted, revoked, logged and audited, and when I am refused, a server answers 403. Two pairs of twins live inside my six letters. What am I?", hints: ["Think about what role-based access control actually controls.", "Identity and ___ Management."] },
    { id: "r2", hash: "251fecd592e56e6c4a95121752f4a73bb802dffc1cc4bce6100206ee2b7cb650", text: "I have no length, no width and no depth, yet every line is built from me. Teachers make me, debaters argue me, scorers count me, and in a number I divide the whole from the part. What am I?", hints: ["Geometry begins with me.", "Computers handle fractions with floating ___ arithmetic."] },
  ],
  finalHash: "e7bc6d57f0f9ff80f923e280986051041bd89937ae026a582cf47b3c34e41145",
  linkedin: "https://linkedin.com/in/ansik-aryan-1aa731250",
  xHandles: "@WisprFlow @emergentlabs",
};

export const caption = (url, x = false) => x
  ? `I found the whisper and reached the Access Point in the Secret Layer of Out Loud by Ansik Aryan Samal. ${BONUS.xHandles} #OutLoud`
  : `I found the whisper and reached the Access Point in the Secret Layer of Out Loud, the portfolio of Ansik Aryan Samal. Tag: @Ansik Aryan Samal @Wispr Flow @Emergent #OutLoud #VoiceFirst ${url}`;
