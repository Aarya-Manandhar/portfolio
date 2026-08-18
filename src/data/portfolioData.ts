import type { Project, SkillCategory, TechnicalNote } from '../types';

export const PERSONAL_INFO = {
  name: 'Aarya Manandhar',
  initials: 'AM',
  greeting: "Hi, I'm Aarya",
  positioning: 'Full-stack developer building AI tools, secure platforms, and Web3 systems.',
  bio: "I am a full-stack developer who enjoys architecting resilient software systems, ranging from NLP-driven spec analysis engines to decentralized account-abstraction security protocols. I specialize in turning complex requirements into clean, practical code with high reliability. Currently, I'm focusing on building AI developer tools, smart contract inheritance platforms, and secure web architectures.",
  statsBadge: '8 Projects Built',
  githubUser: 'Aarya-Manandhar',
  email: 'aaryamanandhar@gmail.com',
  githubUrl: 'https://github.com/Aarya-Manandhar',
  linkedinUrl: 'https://linkedin.com/in/aaryamanandhar',
  responsePledge: 'Usually replies within 24h',
  skillsQuickStrip: ['Python', 'React', 'Java', 'PHP', 'Web3'],
};

export const PROJECTS: Project[] = [
  {
    id: 'specsense-ai',
    name: 'SpecSense AI',
    shortDesc: 'AI-powered requirement specification analyzer that detects ambiguous and untestable language in real time.',
    fullDesc: 'SpecSense AI scans software requirement specifications (SRS) and user stories for subjective, vague, or non-verifiable terminology (e.g., "fast", "intuitive", "real-time"). It generates actionable suggestions and quality scores before development starts, reducing rework and misaligned expectations.',
    tech: ['Python', 'FastAPI', 'React', 'NLP', 'Tailwind CSS'],
    category: 'ai',
    iconName: 'Sparkles',
    featured: true,
    githubUrl: 'https://github.com/Aarya-Manandhar/specsense-ai',
    liveUrl: '#specsense-demo',
  },
  {
    id: 'deadmanswitch',
    name: 'DeadManSwitch',
    shortDesc: 'Trustless data inheritance system using smart contract account abstraction and client-side encryption.',
    fullDesc: 'A decentralized digital inheritance protocol that securely stores encrypted payload shards on IPFS. If the owner fails to send periodic heartbeat transactions, ERC-4337 account abstraction triggers trustless key reconstruction and payload delivery to designated beneficiaries.',
    tech: ['React', 'ethers.js', 'ERC-4337', 'MetaMask SDK', 'AES-GCM', 'IPFS'],
    category: 'web3',
    iconName: 'ShieldLock',
    githubUrl: 'https://github.com/Aarya-Manandhar/deadmanswitch',
  },
  {
    id: 'sajilogig',
    name: 'SajiloGig',
    shortDesc: 'Secure student freelancing platform with visual KYC verification and simulated escrow payment workflows.',
    fullDesc: 'A full-stack freelancing ecosystem engineered specifically for student developers. Features role-based access control (RBAC), multi-stage visual identity verification (KYC), milestone tracking, and a simulated escrow engine to guarantee payment release upon deliverable approval.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'HTML5/CSS3', 'RBAC', 'Escrow Engine'],
    category: 'fullstack',
    iconName: 'Briefcase',
    githubUrl: 'https://github.com/Aarya-Manandhar/sajilogig',
  },
  {
    id: 'baa-ko-achar',
    name: 'Baa-Ko-Achar',
    shortDesc: 'Full-stack e-commerce marketplace for local artisanal goods with digital Khalti payment gateway integration.',
    fullDesc: 'Custom e-commerce web application featuring dynamic inventory management, session security, shopping cart state management, and direct API integration with Khalti digital wallet for automated payment verification.',
    tech: ['PHP', 'JavaScript', 'HTML5/CSS3', 'Khalti API', 'MySQL'],
    category: 'fullstack',
    iconName: 'ShoppingBag',
    githubUrl: 'https://github.com/Aarya-Manandhar/baa-ko-achar',
  },
  {
    id: 'smart-tender',
    name: 'Smart-Tender',
    shortDesc: 'Transparent procurement and tender management platform for posting, bidding, and automated compliance.',
    fullDesc: 'Enterprise-grade tender management system handling multi-role workflows for government and vendor bidding. Built with strict audit trails, encrypted bid submissions, and automated deadline enforcement.',
    tech: ['Java', 'Servlets', 'MySQL', 'HTML5/CSS3', 'Role Security'],
    category: 'security',
    iconName: 'FileCheck',
    githubUrl: 'https://github.com/Aarya-Manandhar/smart-tender',
  },
  {
    id: 'qa-suite',
    name: 'QA Suite',
    shortDesc: 'Automated UI and API testing portfolio ensuring strict regression coverage across core platforms.',
    fullDesc: 'Comprehensive automated testing suite implementing Page Object Models in Playwright for frontend regression testing and Postman collections for REST API payload verification, schema validation, and security headers.',
    tech: ['JavaScript', 'Playwright', 'Postman', 'Jest', 'API Automation'],
    category: 'security',
    iconName: 'TestTube',
    githubUrl: 'https://github.com/Aarya-Manandhar/qa-suite',
  },
  {
    id: 'console-game',
    name: 'console-game',
    shortDesc: 'Console-based retro arcade games (Dodge the Car, Dino Game, Snake) engineered with modular C++ OOP patterns.',
    fullDesc: 'Performance-optimized C++ terminal games demonstrating object-oriented principles, memory management, frame-rate timing loops, and dynamic grid collision detection without external game libraries.',
    tech: ['C++', 'OOP', 'Data Structures', 'Terminal Graphics'],
    category: 'fullstack',
    iconName: 'Gamepad2',
    githubUrl: 'https://github.com/Aarya-Manandhar/console-game',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', deviconSlug: 'python', usedIn: 'SpecSense AI' },
      { name: 'Java', deviconSlug: 'java', usedIn: 'Smart-Tender' },
      { name: 'PHP', deviconSlug: 'php', usedIn: 'SajiloGig & Baa-Ko-Achar' },
      { name: 'JavaScript', deviconSlug: 'javascript', usedIn: 'QA Suite & SajiloGig' },
      { name: 'C++', deviconSlug: 'cplusplus', usedIn: 'console-game' },
      { name: 'TypeScript', deviconSlug: 'typescript' },
      { name: 'SQL', deviconSlug: 'mysql', usedIn: 'SajiloGig & Smart-Tender' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React', deviconSlug: 'react', usedIn: 'SpecSense AI & DeadManSwitch' },
      { name: 'Vite', deviconSlug: 'vitejs', usedIn: 'Portfolio' },
      { name: 'HTML5/CSS3', deviconSlug: 'html5', usedIn: 'Baa-Ko-Achar' },
      { name: 'Tailwind CSS', deviconSlug: 'tailwindcss', usedIn: 'SpecSense AI & Portfolio' },
      { name: 'State Management' },
    ],
  },
  {
    title: 'Web3 & Security',
    isWeb3Security: true,
    skills: [
      { name: 'ethers.js', deviconSlug: 'ethereum', usedIn: 'DeadManSwitch' },
      { name: 'ERC-4337 (Account Abstraction)', deviconSlug: 'ethereum', usedIn: 'DeadManSwitch' },
      { name: 'MetaMask SDK', deviconSlug: 'metamask', usedIn: 'DeadManSwitch' },
      { name: 'IPFS', deviconSlug: 'ipfs', usedIn: 'DeadManSwitch' },
      { name: 'AES-GCM Encryption', usedIn: 'DeadManSwitch' },
      { name: 'RBAC Security', usedIn: 'SajiloGig & Smart-Tender' },
    ],
  },
  {
    title: 'Testing & QA',
    skills: [
      { name: 'Playwright', deviconSlug: 'playwright', usedIn: 'QA Suite' },
      { name: 'Postman', deviconSlug: 'postman', usedIn: 'QA Suite' },
      { name: 'Jest', deviconSlug: 'jest', usedIn: 'QA Suite' },
      { name: 'API Payload Verification', usedIn: 'QA Suite' },
      { name: 'E2E Automation', usedIn: 'QA Suite' },
    ],
  },
  {
    title: 'Backend & Databases',
    skills: [
      { name: 'RESTful APIs', usedIn: 'SpecSense AI & QA Suite' },
      { name: 'PHP/Laravel', deviconSlug: 'laravel', usedIn: 'SajiloGig' },
      { name: 'Node.js', deviconSlug: 'nodejs', usedIn: 'QA Suite' },
      { name: 'FastAPI', deviconSlug: 'fastapi', usedIn: 'SpecSense AI' },
      { name: 'MySQL', deviconSlug: 'mysql', usedIn: 'SajiloGig, Baa-Ko-Achar & Smart-Tender' },
      { name: 'Database Modeling' },
    ],
  },
];

export const TECHNICAL_NOTES: TechnicalNote[] = [
  {
    id: 'simulated-escrow-tradeoffs',
    title: 'Why I Chose Simulated Escrow Over Mainnet Smart Contracts for SajiloGig',
    date: 'July 2026',
    readTime: '4 min read',
    summary: 'A deep dive into balancing cryptographic decentralization against student onboarding friction, gas cost volatile spikes, and fiat payment reality.',
    content: `When building SajiloGig—a freelancing platform tailored for student developers—escrow safety was the single most critical feature. The initial design temptation was to deploy Ethereum smart contracts to hold funds in escrow trustlessly.

### The Problem with On-Chain Escrow for Student Gigs
1. **Friction & Wallet Setup**: Over 85% of student clients in our target demographic had never set up a Web3 wallet or purchased crypto. Requiring gas tokens to fund a $15 graphic design gig created massive conversion drop-off.
2. **Gas Spikes**: On-chain tx fees could easily consume 20-40% of small student gig values during network congestion.

### The Simulated Escrow Solution
Instead of raw smart contracts, I built a state-machine backed simulated escrow engine in PHP with two-phase commit verification:
- Funds are locked in a isolated sub-account upon milestone approval.
- Cryptographic hash receipts are issued to both client and freelancer.
- Admin multi-sig dispute resolution is available if deliverables fail automated checks.

### Engineering Hindsight
With modern ERC-4337 paymasters now available, a hybrid model using gasless account abstraction allows instant fiat onramps while maintaining smart contract guarantee. That will be the v2 architecture.`,
    tags: ['Architecture', 'PHP', 'Web3', 'Security'],
  },
  {
    id: 'nlp-heuristics-specsense',
    title: 'Detecting Ambiguous Software Requirements with NLP Heuristics',
    date: 'May 2026',
    readTime: '5 min read',
    summary: 'How SpecSense AI parses natural language requirement documents to quantify vagueness before sprint planning.',
    content: `Software engineering teams waste thousands of hours building the wrong features because requirements use vague phrases like "the system should be fast" or "the UI must be intuitive".

### Key Parsing Rules & Taxonomy
SpecSense AI classifies ambiguity into three categories:
- **Subjective terms**: "Intuitive", "User-friendly", "Seamless", "Elegant". These cannot be measured objectively in QA.
- **Vague metrics**: "Fast", "High performance", "Real-time", "Scalable". These must be replaced with concrete SLAs (e.g., "< 200ms p95 latency").
- **Untestable qualifiers**: "Robust", "Secure", "Flexible". These require specific test vectors and threat models.

### Algorithmic Approach
By running tokenization and POS (Part-of-Speech) tag extraction alongside a customized heuristic rule tree, SpecSense flags untestable terms instantly and suggests quantifiable replacements directly inside the editor.`,
    tags: ['AI', 'Python', 'NLP', 'Software Engineering'],
  },
  {
    id: 'erc4337-data-inheritance',
    title: 'Decentralized Data Inheritance with ERC-4337 Account Abstraction',
    date: 'March 2026',
    readTime: '6 min read',
    summary: 'Combining AES-GCM client-side encryption, IPFS storage, and automated Web3 heartbeat triggers for DeadManSwitch.',
    content: `Traditional digital asset inheritance requires trusting a centralized custodian or sharing raw private keys. DeadManSwitch solves this through trustless client-side cryptography combined with Ethereum Account Abstraction (ERC-4337).

### Technical Workflow
1. **Client-Side Encryption**: Sensitive data (seed phrases, backup keys, documents) is encrypted locally using AES-256-GCM before ever leaving the user's browser.
2. **IPFS Sharding**: Encrypted payload shards are uploaded to decentralized IPFS nodes.
3. **Smart Contract Heartbeat**: The owner executes zero-value ping transactions periodically to renew their heartbeat timer.
4. **Automated Key Release**: If the timer elapses without a ping, the smart contract's Paymaster & UserOperation bundle triggers key release to the pre-configured beneficiary address.`,
    tags: ['Web3', 'ERC-4337', 'Cryptography', 'React'],
  },
];
