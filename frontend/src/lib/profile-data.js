export const MISSING = "Upload needed.";
export const OWNER_NAME = "Ansik Aryan Samal";
export const SUMMARY = "I build AI tools and full-stack applications with Python, JavaScript and SQL. My work spans a client stock screener, job authenticity checks and secure financial APIs. I’m an AI Engineer Intern at Clyptus Software Solutions in Hyderabad, pursuing Data Science and Artificial Intelligence with IIT Roorkee and Masai School.";
export const LINKS = {
  linkedin: "https://linkedin.com/in/ansik-aryan-1aa731250",
  github: "https://github.com/Kiyotaka-Ayanak0ji",
  other: "https://personalportfolio-theta-sable.vercel.app",
};
export const DECISIONS = [
  { title: "Scope and audience", context: "A client needed a customisable stock screener for Indian markets.", decision: "Built live prices, watchlists, portfolio tracking and real-time analysis for NSE and BSE stocks.", result: "5,300+ stocks covered, as reported in the résumés.", evidence: "Dataset count or product screenshot", source: "All three résumés, Stock Screener; delivery plan §5.1" },
  { title: "Plans and pricing", context: "The screener included free and paid subscription plans.", decision: "Defined Free, Pro at $20/month and Premium at $40/month, with discounted yearly rates.", result: "Plans and pricing documented in the résumés. Conversion and revenue figures: Upload needed.", evidence: "Pricing page screenshot", source: "All three résumés, Stock Screener; delivery plan §5.1" },
  { title: "Feature gating", context: "Access to screener features varied by subscription plan.", decision: "Tied stock search, watchlist count and automatic price refresh to each plan.", result: "Plan-based access described in the résumés. User response: Upload needed.", evidence: "Feature matrix or product screenshot", source: "All three résumés, Stock Screener; delivery plan §5.1" },
  { title: "Payments approach", context: "The client product needed a pricing and payment integration approach.", decision: "Selected the payment integration approach and wrote the project documentation.", result: "Approach selected; provider, integration details and payment outcomes: Upload needed.", evidence: "Payment documentation", source: "All three résumés, Stock Screener; delivery plan §5.1" },
  { title: "Launch", context: "The client screener moved from requirements to launch.", decision: "Launched the product on a custom domain through Cloudflare.", result: "Custom-domain launch reported in the résumés. Launch channels and first-week activity: Upload needed.", evidence: "Live product link or launch record", source: "All three résumés, Stock Screener; delivery plan §5.1" },
  { title: "Traffic", context: "The résumés report traffic over the first 3 to 4 months.", decision: MISSING, result: "About 10,000 views in 3 to 4 months. Views are not sign-ups or paying customers.", evidence: "Analytics export with date range and traffic sources", source: "All three résumés, Stock Screener; delivery plan §9.2 (evidence open)" },
].map((d, i) => ({ id: `D-0${i + 1}`, reason: MISSING, lesson: MISSING, evidenceOk: false, ...d }));

export const PROPOSALS = [
  { id: "H1", title: "Type versus Talk on campus", hypothesis: "Test whether a Hinglish and regional-language challenge encourages students to try voice dictation.", test: "Two-week trial at two or three colleges, with a tracked link and shareable result card.", metric: "Result-card share rate; installs per 100 participants.", kill: "Fewer than 5 installs per 100 participants (illustrative threshold)." },
  { id: "H2", title: "Write it by voice for freshers", hypothesis: "Test voice dictation for cover letters and LinkedIn summaries.", test: "Two-week trial through one placement cell and one bootcamp community.", metric: "Share of sign-ups who dictate within 24 hours.", kill: "Below 30% first-day activation (illustrative threshold)." },
  { id: "H3", title: "A creator build-by-talking template", hypothesis: "Test whether a short creator demonstration brings activated users to Wispr Flow.", test: "Brief five micro-creators on one 60-second format for a two-week trial.", metric: "Cost per activated user.", kill: "Above a cost ceiling agreed before the test. Ceiling: Upload needed." },
];

export const PROJECTS = [
  { id: "stock-screener", title: "Stock Screener SaaS", cat: "Product", summary: "A client product taken from requirements to a custom-domain launch.", work: "Built a customisable screener with live prices, watchlists, portfolio tracking and real-time analysis. Defined subscription plans, feature access, the payment approach and project documentation.", tools: "React.js, Tailwind CSS, Node.js, Flask, Axios, MongoDB", metric: "Résumé-reported: 5,300+ NSE and BSE stocks; about 10,000 views in 3 to 4 months.", detail: "Free, Pro ($20/month) and Premium ($40/month), with discounted yearly rates. Stock search, watchlist count and automatic refresh tied to each plan. Launched through Cloudflare.", evidence: "Analytics, pricing screenshot and dataset count", source: "All three résumés; delivery plan §5.1, §9.2" },
  { id: "sql-copilot", title: "Text-to-SQL Analytics Copilot", cat: "AI & Data", summary: "Plain-English data questions with query safety guardrails.", work: "Built schema retrieval, SQL generation, sqlglot AST validation and read-only execution, returning tables, Plotly charts and query explanations.", tools: "Python, sqlglot, FastAPI, DuckDB, PostgreSQL, Chroma, pgvector, Plotly, Streamlit", metric: "Résumé-reported: evaluated on 100 question-to-expected-result pairs. Zero safety violations is a target, not a reported result.", detail: "Added database-error-driven self-correction and a bank of checked question-to-SQL pairs for few-shot examples and regression tests. Execution accuracy, safety violations and median latency are evaluation measures; results: Upload needed.", evidence: "Evaluation report and query test set", source: "Data Science résumé, Projects" },
  { id: "job-verification", title: "Job and Company Verification", cat: "AI & Data", summary: "Job-link checks using company reviews, online presence and posting warning signs.", work: "Built a Flask API, a nine-signal weighted scoring system, a unit test suite and a 39-page ReportLab report. Rebuilt the classifier around an in-house machine learning model.", tools: "Python, Flask, React.js, TypeScript, Supabase, Tailwind CSS, TanStack, Firecrawl", metric: "Résumé-reported: authenticity scores from 0 to 100; 95% accuracy on unseen data.", detail: "Bulk self-training on batches of 30 to 40 company links, with predictions checked through Firecrawl. Applied feature engineering learned during the Data Science course. Deployed on Render, Railway and Vercel.", evidence: "Unseen-data evaluation, test suite and report", source: "All three résumés, Projects" },
  { id: "finance-api", title: "Finance Data Processing Backend", cat: "Product", summary: "REST APIs for users, transactions and financial reporting.", work: "Implemented Viewer, Analyst and Admin permissions. Added income, expense, balance and spending-trend endpoints, with schema and query optimisation.", tools: "Node.js, Express.js, PostgreSQL", detail: "Dashboard summaries use optimised database structures and queries. No latency benchmark was supplied.", evidence: "API documentation and performance measurements", source: "All three résumés, Projects" },
  { id: "secure-notes", title: "Secure Notes Sharing", cat: "Security", status: "In progress", summary: "Notes shared through restricted links with user-defined expiry.", work: "Building note access controls and sharing privileges. Developed an in-house URL shortener for compact note-sharing links.", tools: "", evidence: "Repository and implementation details", source: "Software Developer and AI Architect résumés, Projects" },
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
  autopsy: { projectName: "Stock Screener SaaS", role: "Requirements, full-stack development, plans, payment approach, documentation and launch", decisions: DECISIONS, mistakes: { happened: "", cost: "", change: "" }, additionalMistakes: [{ happened: "", cost: "", change: "" }, { happened: "", cost: "", change: "" }] },
  bharat: { origin: "At NEC E-Summit 2024 at IIT Bombay, I pitched a job-matching app for daily-wage and off-season workers. Our team’s pitch ranked 4th in India, as reported in my résumés. The idea included regional-language support, salary-negotiation help and planned government welfare tie-ups for fair wages.", users: "Daily-wage and off-season workers.", languages: LANGUAGES, learned: "" },
  secret: { story: "During my cybersecurity internship at Edunet Foundation, I studied bit-level image steganography and built a GUI to hide and retrieve data. This puzzle applies that technique in the browser.", message: "", grant: "" },
  receipts: Array.from({ length: 4 }, (_, i) => ({ id: `R-0${i + 1}`, title: ["The Autopsy", "Voice-First Bharat", "The Secret Layer", "Build and refinement"][i], said: "", transcribed: "", built: "", evidence: "" })),
  speedTests: Array.from({ length: 3 }, () => ({ prompt: "", words: "", typing: "", speaking: "" })),
  buildLog: "", voiceLimit: "", speedMethod: "",
  projects: PROJECTS, skills: SKILL_GROUPS,
  about: { role: "AI Engineer Intern & Full-stack Developer", bio: SUMMARY, resume: "", ...LINKS, whyVoice: "", whyGrowth: "" },
  contact: { email: "aryanansik@gmail.com", location: "Hyderabad, Telangana, India", profiles: "", publish: true, availability: "", travel: "", video: "", post: "" },
};