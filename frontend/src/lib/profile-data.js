export const MISSING = "Upload needed.";
export const OWNER_NAME = "Ansik Aryan Samal";
export const SUMMARY = "Computer Science graduate (B.Tech, 2025, CGPA 7.83) and AI Engineer Intern at Clyptus Software Solutions, Hyderabad. I work in Python, SQL and C++ across software development, data science and machine learning. I built a job authenticity tool with 95% accuracy on unseen data and secure REST APIs with role-based access control, and took a client product from requirements to launch. I’m completing a Data Science and Artificial Intelligence program with IIT Roorkee and Masai School.";
export const LINKS = {
  linkedin: "https://linkedin.com/in/ansik-aryan-1aa731250",
  github: "https://github.com/Kiyotaka-Ayanak0ji",
  other: "https://personalportfolio-theta-sable.vercel.app",
};
export const TRAFFIC_STATS = [
  ["Pageviews", "17.48k"], ["Visits", "17.02k"], ["Requests", "48.37k"], ["Data transfer", "581.25 MB"],
  ["Top request countries", "United States 9.11k, France 6.39k, Netherlands 6.19k, Singapore 5.29k, Japan 4.08k"],
  ["Devices", "Desktop 17k, Tablet 270, Mobile 210"],
];
export const COUNTRY_PAGEVIEWS = [["France", 5860], ["Singapore", 2360], ["Netherlands", 1710], ["South Korea", 1500], ["Hong Kong", 1170], ["Australia", 1010], ["Japan", 920], ["India", 720], ["Poland", 700], ["United States", 640]];
export const DECISIONS = [
  { title: "Scope and audience",
    context: "A freelance client wanted a stock screener: a personalised utility for the client, and a product for investment enthusiasts. Building it also meant learning AI and real-time screening of public market data.",
    decision: "Started with a prototype, then ran about 12 iterations across the frontend, backend, authentication and security. Developed with Lovable and added database indexes for performance, without a caching layer.",
    reason: "Iterating in small steps let me turn stakeholder requirements into working features and fix problems as they surfaced.",
    result: "A customisable screener covering 5,300+ NSE and BSE stocks, with live prices, watchlists, portfolio tracking and real-time analysis. I aim to open-source it.",
    lesson: "Working directly with the client taught me to think like a forward-deployed engineer: collaborate with stakeholders, pin down requirements and document every decision." },
  { title: "Plans and pricing",
    context: "The first idea was Free, about $20 and about $40 with unlimited use.",
    decision: "Final plans: Free, Pro at about $5/month and Premium at about $20/month, with a possible $40 Premium+ tier. Free first unlocked Pro access for 30 days, later about 15 days by client decision. Annual billing averages a 17% discount. Pro adds selected tools and custom features; Pro and Premium add PDF watchlist export and share links with configurable access; Premium adds a portfolio dashboard.",
    reason: "Unlimited use was unsustainable because of computation and server load, and it undercut the product’s value.",
    result: "One lead registered and tried the app. No paid subscriptions yet, because the application is still incomplete.",
    lesson: "Price according to value, costs, effort and user needs. Avoid overvaluing or undervaluing the work." },
  { title: "Feature gating",
    context: "Features included watchlist sharing and export, advanced filters, a portfolio dashboard, automatic refresh, favourites, guided onboarding and monthly Premium reports. Smart email alerts follow each user’s habits, watchlists and marked stocks, and OAuth simplifies sign-in.",
    decision: "Put the portfolio dashboard and automatic refresh in Premium+. Required registration, with a trial of about 15 days.",
    reason: "A survey of competitors shaped the split. Unauthorised guest usage raised API and server load, so access had to be restricted.",
    result: "Plan-based access with registration-gated trials.",
    lesson: "Clarify requirements and feature behaviour early to avoid defects and instability." },
  { title: "Payments approach",
    context: "Subscription revenue was meant to cover compute and infrastructure and to recognise the development effort.",
    decision: "Chose Razorpay. Its merchant verification is complete and approved, and it handles currency conversion: about ₹1,800 to ₹1,900 for a $20 plan. Rejected manual bank transfers. PayPal remains a later option.",
    reason: "Stripe meant a waitlist, request screening and approval timing that did not fit early development in India. Juspay’s fees and limited time ruled it out. Manual bank transfers carried security and scam risks.",
    result: "No paid subscriptions yet, because development is incomplete. Lovable cloud hosting is now inactive, and the app runs standalone on a Hostinger domain.",
    lesson: "Handle payment infrastructure and financial information carefully." },
  { title: "Launch",
    context: "The screener moved from requirements to a public custom domain.",
    decision: "Launched on a custom domain through Cloudflare, then iterated on branding and logo, SEO and discoverability, speed and a fluid interface.",
    reason: "A product has to be found and feel fast before anyone stays to use it.",
    result: "Cloudflare Analytics recorded 17,000+ organic views, primarily from the United States and other regions.",
    lesson: "Running costs go beyond compute: microservices, paid APIs, infrastructure and development subscriptions all add up." },
  { title: "Traffic",
    context: "Cloudflare Analytics for equityiq.in, 3 October to 2 November 2026.",
    decision: "Tracked pageviews, visits, requests and country breakdowns to understand where attention came from.",
    reason: "Traffic shows reach, and reach has to turn into sustained use.",
    result: "17.48k pageviews and 17.02k visits in 30 days.",
    lesson: "Views alone do not establish sustained product use.", stats: TRAFFIC_STATS, chart: COUNTRY_PAGEVIEWS },
].map((d, i) => ({ id: `D-0${i + 1}`, evidenceOk: false, ...d }));

export const MISTAKES = [
  { happened: "Neglecting cloud infrastructure and current technologies.", cost: "Gaps in cloud and scaling knowledge made deployment and maintenance harder, and limited how well I could turn requirements into infrastructure decisions.", change: "I’m studying cloud technologies, engaging with difficult topics instead of avoiding them, and building comfort with deployment and scaling." },
  { happened: "Thinking only like a developer.", cost: "Limited market and business awareness contributed to interview rejections at Goldman Sachs, Amazon and Uber. My technical work was not consistently connected to real needs.", change: "I tie features to business requirements, and I’m continuing the IIT Roorkee Data Science and AI program to strengthen my product and business perspective." },
  { happened: "Neglecting networking and spending too much time on unproductive activities.", cost: "Procrastination and sedentary habits made it harder to enter professional life, and led to missed opportunities, criticism and a weaker support network.", change: "I work regularly on projects, learn useful skills, attend technology events, read, follow current affairs when my schedule permits, monitor relevant jobs and attend interviews." },
];

export const IN_PROGRESS = "I’m currently working on a Text-to-SQL Analytics Copilot and a Secure Note-Sharing Application.";

export const TALK = {
  typing: "5m 20s", voice: "1m 30s", typingSec: 320, voiceSec: 90,
  points: [
    ["Real projects", "I dictate project material with Wispr Flow, then use AI to organise it for Emergent. This document alone would have taken about half a day to type. Development of this portfolio, started on 1 November, dropped from 4+ days to about 2 to 3 days."],
    ["Benefits", "Voice helps with long documents, prompts and substantial writing. It reduces reliance on keyboard access and typing speed, and it is the better choice when volume and speed matter."],
    ["Trade-offs", "After two to three days of use, I noticed that typing still gives more precise control. The right choice depends on the task and the environment."],
    ["Regional languages", "Regional-language support can lower the English-proficiency barrier for many users."],
  ],
  saving: "My estimate from personal use: voice saves me 80 to 90% of writing time.",
};

export const BUILD_LOG = [
  "01 Ideation. Asked for 10 to 15 project ideas that solve real problems, each with problem, solution, existing solutions, gaps and MVP.",
  "02 Simplified plan. Condensed the Out Loud concept and delivery plan into a buildable spec, with a prerequisites and requirements report.",
  "03 First demo. Built the single-page structure: Hero, Autopsy, Voice-First Bharat, Secret Layer, Voice Receipts, Projects and Skills, About and Contact, with marked placeholders and a global animation toggle.",
  "04 Design concepts. Requested three or four small design models before building, then chose one independent visual direction.",
  "05 Refinement. Fixed the title glitch with a typing animation, added dark and light themes, replaced the word hunt with a three-image puzzle and removed carousels and marquees.",
  "06 Private tools. Added the Content Setup tool, Voice Intro recording, print summary and in-browser steganography decoder.",
  "07 Content refresh. Filled sections from the résumés and reference, moved audio and transcripts to a private editor, changed the font and removed promotional labels.",
].join("\n");

export const VOICE_LIMITS = "Automatic corrections can change intended wording, and reviewing a long transcript takes time. Accuracy depends on comfort with pronunciation, intonation, sentence formation and punctuation, and background noise reduces it. Passwords, bank details and confidential messages are unsuitable for dictation.";

const FLOW = [
  "The client initially asked me to build a tool. I approached the requirement differently and developed a complete product end to end: cloud hosting, authentication, multi-user support, administrative access, user and analytics visibility, portfolio dashboards, subscription-based feature restrictions and role- and privilege-based access control. As admin, I could monitor users and application analytics; users reached dashboards and features according to their subscription tier and permissions. The client was satisfied, although I believe there was still room for improvement. The project is a starting point for my freelancing and software development career. Manual development, problem-solving and independent technical understanding will continue to remain valuable.",
  "In 2024, I served as an event manager for my college’s E-Cell initiative. During this period, we pitched the idea of developing a regional voice-based system that could assist daily-wage workers with everyday communication and information requirements.",
  "Replace the simple word hunt with a three-image puzzle that teaches the visitor how to uncover the hidden word. Use grayscale or real-world images. The letters must be recoverable through the method explained by the hints, not merely overlaid visibly. Add a concise story that gives context and explains how to begin. Provide progressive hints: a broad observation, the technique to try, then a stronger hint for each image.",
  "Build a polished, mobile-first, single-page portfolio web app called Out Loud. It should feel memorable, easy to explore, and understandable in about three minutes. Make the design custom and engaging rather than a generic résumé template. Design mobile first, then adapt to larger screens. Use subtle purposeful motion and respect reduced-motion settings.",
];

export const PROJECTS = [
  { id: "stock-screener", title: "EquityIQ Stock Screener", cat: "Product", image: "/projects/equityiq.jpg", summary: "A client product taken from requirements to a custom-domain launch.", work: "Built a customisable screener with live prices, watchlists, portfolio tracking and real-time analysis. Defined subscription plans, feature access, the payment approach and project documentation.", tools: "React.js, Tailwind CSS, Node.js, Flask, Axios, MongoDB", metric: "5,300+ NSE and BSE stocks. 17,000+ organic views.", detail: "Free, Pro (about $5/month) and Premium (about $20/month), with an average 17% annual discount. Portfolio dashboard and automatic refresh in Premium+. Razorpay payments. Launched through Cloudflare.", links: [["Live app", "https://calm-white-cloud.lovable.app/"]] },
  { id: "job-verification", title: "TrustHire: Job and Company Verification", cat: "AI & Data", image: "/projects/trusthire.jpg", summary: "Job-link checks using company reviews, online presence and posting warning signs.", work: "Built a Flask API, a nine-signal weighted scoring system, a unit test suite and a 39-page ReportLab report. Rebuilt the classifier around an in-house machine learning model.", tools: "Python, Flask, React.js, TypeScript, Supabase, Tailwind CSS, TanStack, Firecrawl", metric: "Authenticity scores from 0 to 100; 95% accuracy on unseen data.", detail: "Bulk self-training on batches of 30 to 40 company links, with predictions checked through Firecrawl. Deployed on Render, Railway and Vercel.", links: [["Live app", "https://trust-hire.lovable.app/"]] },
  { id: "finance-api", title: "Finance Data Processing Backend", cat: "Product", art: "finance", summary: "Secure REST APIs for users, transactions and dashboard reports.", work: "Implemented Viewer, Analyst and Admin permissions. Added income, expense, balance and spending-trend endpoints, and optimised schemas and queries so dashboard summaries load quickly.", tools: "Node.js, Express.js, PostgreSQL", links: [["GitHub", "https://github.com/Kiyotaka-Ayanak0ji/Data_Processing_Backend"], ["Postman API docs", "https://documenter.getpostman.com/view/53009591/2sBXwqtBGr"]] },
  { id: "image-messaging", title: "Secure Image Messaging", cat: "Security", art: "image", summary: "Text messages encoded into images and decoded by the receiver.", work: "Built a React and Flask app using pixel-based message encoding, with a responsive interface, dark mode and client-side routing.", tools: "React, Flask, Tailwind CSS", links: [["Live app", "https://steganography-project-updated-mwskcqpo9.vercel.app/"], ["GitHub", "https://github.com/Kiyotaka-Ayanak0ji/Steganography_Project_Updated"]] },
  { id: "price-prediction", title: "Stock Price Prediction", cat: "AI & Data", art: "chart", summary: "Price-trend estimation from historical and real-time market data.", work: "Cleaned market data, engineered features and used statistical and machine learning techniques to estimate price trends.", tools: "Python, Pandas, Scikit-learn, Yahoo Finance API", metric: "5,000+ data points analysed per stock.", links: [["GitHub", "https://github.com/Kiyotaka-Ayanak0ji/Stock_Price_Prediction"]] },
].map((p) => ({ link: "", evidenceOk: false, ...p }));

export const SKILL_GROUPS = [
  ["Programming & scripting", "Python, SQL, Bash and shell scripting, JavaScript, TypeScript, Java, C++, C"],
  ["Back end & APIs", "Flask, FastAPI, Node.js, Express.js, RESTful APIs, WebSockets, Passport.js, bcrypt, JWT, role-based access control"],
  ["Front end", "React.js, HTML, CSS, Tailwind CSS, responsive design, PWAs"],
  ["Databases & SQL", "PostgreSQL, MySQL, MongoDB, Supabase, Redis, DuckDB, data modelling, query optimisation, SQL for retrieval, cleaning and reporting"],
  ["Generative AI & AI tools", "Prompt engineering (one-shot, few-shot, chain-of-thought, role-based), RAG, embeddings, vector search, LLM evaluation, agentic workflows, MCP; Claude Code, Cursor, Codex, ChatGPT, Lovable, Emergent, Replit, Perplexity"],
  ["AI & machine learning", "Scikit-learn, regression, classification, feature engineering, Hugging Face inference models"],
  ["Data science & analytics", "Pandas, NumPy, Matplotlib, Seaborn, Plotly, EDA, data cleaning, statistical and trend analysis, Power BI, Tableau, Microsoft Excel, dashboards and metrics reporting"],
  ["Automation & DevOps", "n8n, workflow automation, CI/CD concepts, Docker, Git, GitHub, Postman; deployment on Railway, Render, Vercel and Cloudflare"],
  ["Systems & cloud", "Linux/Unix, operating systems and networking fundamentals, debugging, root cause analysis, unit testing, AWS fundamentals, cloud deployment basics"],
  ["CS fundamentals", "Data structures and algorithms, OOP, SOLID principles, SDLC"],
  ["Professional skills", "Analytical thinking, problem solving, technical documentation, clear communication, collaboration, customer-focused mindset, adaptability, leadership"],
  ["Currently working on", "Advanced RAG, advanced machine learning, model fine-tuning, generative AI, cloud fundamentals, CI/CD, low-level design, caching"],
].map(([name, items], i) => ({ id: `sg-${i + 1}`, name, items }));

export const EXPERIENCE = [
  { org: "Clyptus Software Solutions Pvt Ltd", role: "AI Engineer Intern", dates: "Present", text: "Hyderabad." },
  { org: "NxtWave Disruptive Technologies", role: "Associate Aptitude Instructor", dates: "24 August 2026 to 13 October 2026", text: "Trained to teach quantitative aptitude and maths modules to computer science learners accurately and clearly, following company guidelines and ethics. Worked in a corporate setting with limited resources, stayed punctual and raised issues early with the team." },
  { org: "Edunet Foundation (IBM SkillBuild)", role: "Cybersecurity Intern", dates: "15 January 2025 to 26 February 2025", text: "Learned core cybersecurity concepts, network security and threat mitigation. Studied bit-level image steganography and built an interactive GUI that encodes and decodes hidden data in image files." },
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
  "In preparation: Oracle AI, Microsoft Fabric Analytics Engineer, Anthropic, and Google AI and Cloud certifications.",
];
export const ACHIEVEMENTS = [
  "Event Manager, Entrepreneurship Cell (E-Cell), IARE, for the National Entrepreneurship Challenge (NEC) E-Summit 2024 at IIT Bombay. The team’s startup pitch ranked 4th in India.",
  "Pitched a job-matching app for daily-wage and off-season workers, with regional-language support, salary-negotiation help and planned tie-ups with government welfare schemes for fair wages.",
  "Selected through the University of Hyderabad entrance examination: 162nd in the Common Rank List and 4th in the Armed Personnel Category.",
  "95.2 percentile in JEE Mains 2021.",
  "Qualified for the final mock interview round in LEEE 2023.",
];
export const LANGUAGES = "English (professional), Hindi (native), Telugu (conversational), Odia (conversational).";
export const BASE_PROFILE = {
  intro: { audio: null, transcript: "" },
  autopsy: { projectName: "EquityIQ Stock Screener", role: "Requirements, full-stack development, plans, payment approach, documentation and launch", decisions: DECISIONS, mistakes: MISTAKES[0], additionalMistakes: MISTAKES.slice(1) },
  bharat: { origin: "In 2024, I served as event manager for my college’s E-Cell initiative. We pitched a regional voice-based system to help daily-wage workers with everyday communication and information needs. At NEC E-Summit 2024 at IIT Bombay, I pitched a job-matching app for daily-wage and off-season workers. Our team’s pitch ranked 4th in India. The idea included regional-language support, salary-negotiation help and planned government welfare tie-ups for fair wages.", users: "Daily-wage and off-season workers.", languages: LANGUAGES, learned: "" },
  secret: { story: "During my cybersecurity internship at Edunet Foundation, I studied bit-level image steganography and built a GUI to hide and retrieve data. This puzzle applies that technique in the browser.", message: "", grant: "$3,000 is about ₹2,80,000 in India. I would spend about 40 to 50% on a new smartphone, wired earphones and essential accessories. If my Wispr Flow work needs one, I would add a high-end laptop. Otherwise, I would save the remainder toward a better future device." },
  receipts: Array.from({ length: 4 }, (_, i) => ({ id: `R-0${i + 1}`, title: ["The Autopsy", "Voice-First Bharat", "The Secret Layer", "Build prompt"][i], said: "", transcribed: "", flow: FLOW[i], built: "", evidence: "" })),
  speedTests: Array.from({ length: 3 }, () => ({ prompt: "", words: "", typing: "", speaking: "" })),
  buildLog: BUILD_LOG, voiceLimit: VOICE_LIMITS, speedMethod: "",
  projects: PROJECTS, skills: SKILL_GROUPS,
  about: { role: "AI Engineer Intern & Full-stack Developer", bio: SUMMARY, resume: "", ...LINKS, whyVoice: "Voice can give people in underserved areas access to technology in their own regional languages, from remote South Africa to rural India. That idea started with our 2024 Bharat pitch for daily-wage workers. Using Wispr Flow myself, voice now saves me 80 to 90% of my writing time.", whyGrowth: "I want to join Wispr Flow’s Growth team to bring voice-first tools to the people who need them most, and to help more users discover what voice can do for their work." },
  contact: { email: "aryanansik@gmail.com", location: "Hyderabad, Telangana, India", profiles: "", publish: true, availability: "Available during November 2026, subject to organisational needs, and immediately if required.", travel: "Willing to travel to or relocate to Bangalore for interviews, internships and full-time roles.", video: "", post: "" },
};
