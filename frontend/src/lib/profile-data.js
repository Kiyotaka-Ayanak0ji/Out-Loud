export const MISSING = "Upload needed.";
export const OWNER_NAME = "Ansik Aryan Samal";
export const SUMMARY = "I build AI tools and full-stack applications with Python, JavaScript and SQL. My work spans a client stock screener, job authenticity checks and secure financial APIs. I’m an AI Engineer Intern at Clyptus Software Solutions in Hyderabad, pursuing Data Science and Artificial Intelligence with IIT Roorkee and Masai School.";
export const LINKS = {
  linkedin: "https://linkedin.com/in/ansik-aryan-1aa731250",
  github: "https://github.com/Kiyotaka-Ayanak0ji",
  other: "https://personalportfolio-theta-sable.vercel.app",
};
const TRAFFIC_NOTE = "Figure awaiting confirmation: the source narrative states 17,000+ organic views; the résumés state about 10,000 views in 3 to 4 months.";
export const TRAFFIC_STATS = [
  ["Pageviews", "17.48k"], ["Visits", "17.02k"], ["Requests", "48.37k"], ["Data transfer", "581.25 MB"],
  ["Top request countries", "United States 9.11k, France 6.39k, Netherlands 6.19k, Singapore 5.29k, Japan 4.08k"],
  ["Devices (pageviews)", "Desktop 17k, Tablet 270, Mobile 210"],
  ["Status codes", "200 OK 17.61k; 525 Origin SSL Handshake 25.09k; 403 Forbidden 5.3k; 5xx rate 52.26%; cache hit rate 0.00%"],
  ["Automated traffic signals", "Top user agents include None (8k), curl (2.85k) and Go-http-client (2.13k); top paths include /.env, /.env.local and /wp-includes probes"],
  ["Core Web Vitals (stockscreener.sbs, 6 May to 5 June 2026)", "LCP 67% good, 33% poor; P50 1,224 ms, P75 21,912 ms (bold-moves.webp hero image); TTFB 459 ms; CLS 100% good; INP no data"],
];
export const COUNTRY_PAGEVIEWS = [["France", 5860], ["Singapore", 2360], ["Netherlands", 1710], ["South Korea", 1500], ["Hong Kong", 1170], ["Australia", 1010], ["Japan", 920], ["India", 720], ["Poland", 700], ["United States", 640]];
export const DECISIONS = [
  { title: "Scope and audience", context: "A freelance client project with a dual goal: a personalised stock screener for the client, and a product for investment enthusiasts.", decision: "Built it as an incremental prototype over about 12 iterations across the frontend, backend, authentication and security.", reason: "I wanted to learn AI by building a real-time screener end to end.", result: "Developed with Lovable, then worked on indexing and performance. Résumé-reported coverage: 5,300+ NSE and BSE stocks. Future ambition: open-source the project.", lesson: "Stakeholder collaboration, clear requirements and documentation matter as much as code. The project taught me to think like a forward-deployed engineer.", evidence: "Dataset count or product screenshot", source: "Source narrative; all three résumés" },
  { title: "Plans and pricing", context: "The screener needed plans that worked for the client and for individual investors.", decision: "Final plans: Free trial, Pro at about $5/month and Premium at about $20/month. The Free trial changed from 30 days to about 15 days. Annual billing carries an average 17% discount. Watchlist export and sharing apply to the paid plans, and Premium adds the portfolio dashboard.", reason: "Unlimited access and an earlier $40 tier were considered and not retained. Detailed reasoning: Upload needed.", result: "Final plan structure documented. No paid subscriptions yet.", lesson: MISSING, evidence: "Pricing page screenshot", source: "Source narrative" },
  { title: "Feature gating", context: "Stock search, watchlists, Smart Alerts, OAuth sign-in and automatic price refresh had to be split across plans.", decision: "Gated the portfolio dashboard and automatic refresh to Premium. Required registration, with limited trial access.", reason: "Competitor research shaped the split, and gating limited abuse and API load.", result: "Plan-based access is in place. User response: Upload needed.", lesson: MISSING, evidence: "Feature matrix or product screenshot", source: "Source narrative; all three résumés" },
  { title: "Payments approach", context: "The product needed a payment provider for subscriptions.", decision: "Selected Razorpay after considering Stripe and Juspay. Discarded manual bank transfers.", reason: "Detailed comparison: Upload needed.", result: "No paid subscriptions have occurred yet because development and deployment are incomplete.", lesson: MISSING, evidence: "Payment documentation", source: "Source narrative" },
  { title: "Launch", context: "The screener moved from requirements to a public custom domain.", decision: "Launched on a custom domain through Cloudflare.", reason: MISSING, result: "Cloudflare reports traffic on equityiq.in, with significant United States and international request volume.", lesson: "Launching exposed discoverability, performance, cost and sustainability as product problems, not only engineering ones.", evidence: "Cloudflare analytics exports", evidenceText: "Cloudflare analytics exports supplied", source: "Source narrative; Cloudflare exports; all three résumés" },
  { title: "Traffic", context: "Cloudflare analytics for equityiq.in, 3 October to 2 November 2026.", decision: MISSING, result: "Cloudflare shows 17.48k pageviews and 17.02k visits in 30 days. " + TRAFFIC_NOTE, lesson: "Raw views do not equal users. Bot filtering, performance and hosting cost decide whether traffic is sustainable.", stats: TRAFFIC_STATS, chart: COUNTRY_PAGEVIEWS, evidence: "Cloudflare analytics exports", evidenceText: "Cloudflare web, request and Core Web Vitals exports supplied. The exports do not separate organic from automated traffic", source: "Cloudflare exports; source narrative; all three résumés" },
].map((d, i) => ({ id: `D-0${i + 1}`, reason: MISSING, lesson: MISSING, evidenceOk: false, ...d }));

export const MISTAKES = [
  { happened: "I neglected cloud infrastructure and emerging technologies.", cost: MISSING, change: MISSING },
  { happened: "I thought only like a developer instead of connecting the work to business needs.", cost: MISSING, change: MISSING },
  { happened: MISSING, cost: MISSING, change: MISSING },
];

export const IN_PROGRESS = "I’m currently working on a Text-to-SQL Analytics Copilot and a Secure Note-Sharing Application.";

export const TALK = {
  typing: "5m 20s", voice: "1m 30s",
  saving: "My personal estimate: voice saves me 80 to 90% of writing time. This is a personal estimate, not a controlled measurement.",
  concept: MISSING, regional: MISSING,
};

export const BUILD_LOG = [
  "01 Ideation. Asked for 10 to 15 project ideas that solve real problems, each with problem, solution, existing solutions, gaps and MVP.",
  "02 Simplified plan. Condensed the Out Loud concept and delivery plan into a buildable spec, with a prerequisites and requirements report.",
  "03 First demo. Built the single-page structure: Hero, Autopsy, Voice-First Bharat, Secret Layer, Voice Receipts, Projects and Skills, About and Contact, with marked placeholders and a global animation toggle.",
  "04 Design concepts. Requested three or four small design models before building, then chose one independent visual direction.",
  "05 Refinement. Fixed the title glitch with a typing animation, added dark and light themes, replaced the word hunt with a three-image puzzle and removed carousels and marquees.",
  "06 Private tools. Added the Content Setup tool, Voice Intro recording, one-page print summary and in-browser steganography decoder.",
  "07 Source-of-truth refresh. Filled sections from the résumés and reference, moved audio and transcripts to a private editor, changed the font and removed promotional labels.",
].join("\n");

export const VOICE_LIMITS = "Automatic corrections can change what I meant. Dictated text still needs editing. Accuracy drops with less familiar languages and words. Background noise affects recognition. Sensitive information should not be spoken aloud.";

export const PROJECTS = [
  { id: "stock-screener", title: "Stock Screener SaaS (EquityIQ)", cat: "Product", summary: "A client product taken from requirements to a custom-domain launch.", work: "Built a customisable screener with live prices, watchlists, portfolio tracking and real-time analysis. Defined subscription plans, feature access, the payment approach and project documentation.", tools: "React.js, Tailwind CSS, Node.js, Flask, Axios, MongoDB", metric: "Résumé-reported: 5,300+ NSE and BSE stocks. Cloudflare: 17.48k pageviews, 3 October to 2 November 2026. View figure awaiting confirmation.", detail: "Free trial (about 15 days), Pro (about $5/month) and Premium (about $20/month), with an average 17% annual discount. Portfolio dashboard and automatic refresh are Premium. Payments through Razorpay; no paid subscriptions yet. Launched through Cloudflare.", evidence: "Pricing screenshot and dataset count", source: "All three résumés; source narrative; Cloudflare exports" },
  { id: "job-verification", title: "Job and Company Verification", cat: "AI & Data", summary: "Job-link checks using company reviews, online presence and posting warning signs.", work: "Built a Flask API, a nine-signal weighted scoring system, a unit test suite and a 39-page ReportLab report. Rebuilt the classifier around an in-house machine learning model.", tools: "Python, Flask, React.js, TypeScript, Supabase, Tailwind CSS, TanStack, Firecrawl", metric: "Résumé-reported: authenticity scores from 0 to 100; 95% accuracy on unseen data.", detail: "Bulk self-training on batches of 30 to 40 company links, with predictions checked through Firecrawl. Applied feature engineering learned during the Data Science course. Deployed on Render, Railway and Vercel.", evidence: "Unseen-data evaluation, test suite and report", source: "All three résumés, Projects" },
  { id: "finance-api", title: "Finance Data Processing Backend", cat: "Product", summary: "REST APIs for users, transactions and financial reporting.", work: "Implemented Viewer, Analyst and Admin permissions. Added income, expense, balance and spending-trend endpoints, with schema and query optimisation.", tools: "Node.js, Express.js, PostgreSQL", detail: "Dashboard summaries use optimised database structures and queries. No latency benchmark was supplied.", evidence: "API documentation and performance measurements", source: "All three résumés, Projects" },
  { id: "image-messaging", title: "Secure Image Messaging", cat: "Security", summary: "Text messages encoded into images and decoded by the receiver.", work: "Built a React and Flask app using pixel-based message encoding, with a responsive interface, dark mode and client-side routing.", tools: "React, Flask, Tailwind CSS", detail: "The résumés describe pixel-based encryption. Cryptographic design and security validation: Upload needed.", evidence: "Repository or demo", source: "Software Developer and AI Architect résumés, Projects" },
  { id: "price-prediction", title: "Stock Price Prediction", cat: "AI & Data", summary: "Price-trend estimation from historical and real-time market data.", work: "Cleaned market data, engineered features and used statistical and machine learning techniques to estimate price trends.", tools: "Python, Pandas, Scikit-learn, Yahoo Finance API", metric: "Résumé-reported: 5,000+ data points analysed per stock. Prediction accuracy: Upload needed.", evidence: "Dataset, evaluation and model notebook", source: "Software Developer and AI Architect résumés, Projects" },
].map((p) => ({ link: "", evidenceOk: false, ...p }));

export const SKILL_GROUPS = [
  ["Programming", "Python, JavaScript, TypeScript, SQL, Java, C++, C, Bash"],
  ["Web & APIs", "React.js, HTML, CSS, Tailwind CSS, HeadlessUI, TanStack, responsive design, client-side routing, PWAs, Node.js, Express.js, Flask, FastAPI, REST APIs, WebSockets, Passport.js, bcrypt, JWT, RBAC"],
  ["Databases", "PostgreSQL, MySQL, MongoDB, Supabase, Redis, DuckDB, data modelling, query optimisation, SQL reporting"],
  ["Generative AI", "OpenAI API, function calling, structured outputs, prompt engineering, RAG, embeddings, vector search, LLM evaluation, agentic workflows, n8n"],
  ["Machine learning", "Scikit-learn, regression, classification, feature engineering, reinforcement learning, Hugging Face inference models, Stable Diffusion"],
  ["Data & analytics", "Pandas, NumPy, Matplotlib, Seaborn, Plotly, EDA, data cleaning, statistical analysis, Power BI, Tableau, Microsoft Excel"],
  ["Engineering tools", "Git, GitHub, Postman, Docker, Linux/Unix, VS Code, Jupyter Notebook, MySQL Workbench, unit testing, debugging, root cause analysis, Railway, Render, Vercel, Cloudflare"],
  ["AI-assisted development", "Codex, Cursor, Claude Code, ChatGPT, Lovable, Emergent, Replit, Perplexity"],
  ["Foundations", "Data structures and algorithms, OOP, SOLID, SDLC, operating systems, networks, encryption, cybersecurity basics, OAuth 2.0 and SSO basics, API security and data privacy basics, AWS fundamentals"],
  ["Professional practice", "Requirements gathering, solution design, technical documentation, demos, stakeholder communication, analytical thinking, problem solving, teamwork, adaptability, leadership"],
  ["Currently learning", "Advanced RAG, advanced machine learning, model fine-tuning, LLMs, MCP, cloud deployment, CI/CD, low-level design, caching"],
].map(([name, items], i) => ({ id: `sg-${i + 1}`, name, items }));

export const EXPERIENCE = [
  { org: "Clyptus Software Solutions Pvt Ltd", role: "AI Engineer Intern", dates: "Present, as listed in the résumés", text: "Hyderabad. Start date and role-specific contributions: Upload needed." },
  { org: "NxtWave Disruptive Technologies", role: "Associate Aptitude Instructor", dates: "24 August 2026 to 13 October 2026", text: "Trained to teach quantitative aptitude and mathematics to computer science learners. Worked within company guidelines, raised issues early and managed limited resources." },
  { org: "Edunet Foundation (IBM SkillBuild)", role: "Cybersecurity Intern", dates: "15 January 2025 to 26 February 2025", text: "Studied network security, threat mitigation and image steganography. Built an interactive GUI for encoding and decoding hidden image data." },
];
export const EDUCATION = [
  "B.Tech, Computer Science and Engineering, Institute of Aeronautical Engineering (JNTUH), Dundigal, Hyderabad. 2021 to 2025. CGPA: 7.83/10.",
  "Intermediate (MPC), Trividyaa Junior College, Hyderabad. 2019 to 2021. 98%.",
  "Secondary School, St. Michael’s School, Old Alwal, Hyderabad. 2018 to 2019. 94%.",
];
export const CERTIFICATIONS = [
  "Data Science and Artificial Intelligence, IIT Roorkee and Masai School. Ongoing, 2026.",
  "Python, SQL and Problem Solving, HackerRank.",
  "Web Development (WD101) and Node Development (WD201), Pupilfirst, AICTE-based curriculum.",
  "SEBI Investor Awareness, SEBI/NISM, 2025.",
  "In preparation, not completed: Oracle AI, Microsoft Fabric Analytics Engineer, Anthropic, and Google AI and Cloud certifications.",
];
export const ACHIEVEMENTS = [
  "Event Manager, E-Cell, IARE, for NEC E-Summit 2024 at IIT Bombay. The team’s startup pitch ranked 4th in India.",
  "Selected through the University of Hyderabad entrance examination: 162nd in the Common Rank List and 4th in the Armed Personnel Category.",
  "95.2 percentile in JEE Mains 2021.",
  "Qualified for the final mock interview round in LEEE 2023.",
];
export const LANGUAGES = "English (professional), Hindi (native), Telugu (conversational), Odia (conversational).";
export const BASE_PROFILE = {
  intro: { audio: null, transcript: "" },
  autopsy: { projectName: "Stock Screener SaaS (EquityIQ)", role: "Requirements, full-stack development, plans, payment approach, documentation and launch", decisions: DECISIONS, mistakes: MISTAKES[0], additionalMistakes: MISTAKES.slice(1) },
  bharat: { origin: "In 2024, I served as event manager for my college’s E-Cell initiative. We pitched a regional voice-based system to help daily-wage workers with everyday communication and information needs. At NEC E-Summit 2024 at IIT Bombay, I pitched a job-matching app for daily-wage and off-season workers. Our team’s pitch ranked 4th in India, as reported in my résumés. The idea included regional-language support, salary-negotiation help and planned government welfare tie-ups for fair wages.", users: "Daily-wage and off-season workers.", languages: LANGUAGES, learned: "" },
  secret: { story: "During my cybersecurity internship at Edunet Foundation, I studied bit-level image steganography and built a GUI to hide and retrieve data. This puzzle applies that technique in the browser.", message: "", grant: "$3,000 is about ₹2,80,000 in India. I would spend about 40 to 50% on a new smartphone, wired earphones and essential accessories, and possibly a high-end laptop if my Wispr Flow work needs one. Otherwise, I would save the remainder toward a better future device." },
  receipts: Array.from({ length: 4 }, (_, i) => ({ id: `R-0${i + 1}`, title: ["The Autopsy", "Voice-First Bharat", "The Secret Layer", "Build and refinement"][i], said: "", transcribed: "", built: i ? "" : "The client initially asked me to build a tool. I approached the requirement differently and developed a complete product end to end: cloud hosting, authentication, multi-user support, administrative access, user and analytics visibility, portfolio dashboards, subscription-based feature restrictions and role- and privilege-based access control. As admin, I could monitor users and application analytics; users reached dashboards and features according to their subscription tier and permissions. The client was satisfied, although I believe there was still room for improvement. The project is a starting point for my freelancing and software development career. Manual development, problem-solving and independent technical understanding will continue to remain valuable.", evidence: "" })),
  speedTests: Array.from({ length: 3 }, () => ({ prompt: "", words: "", typing: "", speaking: "" })),
  buildLog: BUILD_LOG, voiceLimit: VOICE_LIMITS, speedMethod: "",
  projects: PROJECTS, skills: SKILL_GROUPS,
  about: { role: "AI Engineer Intern & Full-stack Developer", bio: SUMMARY, resume: "", ...LINKS, whyVoice: "Voice can give people in underserved areas access to technology in their own regional languages, from remote South Africa to rural India.", whyGrowth: "I want to join Wispr Flow’s Growth team to bring voice-first tools to those users." },
  contact: { email: "aryanansik@gmail.com", location: "Hyderabad, Telangana, India", profiles: "", publish: true, availability: "Available during November 2026, subject to organisational needs, and immediately if required.", travel: "Willing to travel to or relocate to Bangalore for interviews, internships and full-time roles.", video: "", post: "" },
};