# Aarya Manandhar — Portfolio & Copilot Architecture

A personal portfolio, live showcase, and resilient AI Copilot built with React 19, TypeScript, Vite, Tailwind CSS, and a hand-crafted serverless Retrieval-Augmented Generation (RAG) backend deployed on Vercel.

---

## Architecture & Request Flow

The portfolio chatbot avoids heavy dependencies like FAISS, LangChain, or external vector databases. Instead, it runs as a lightweight Vercel serverless function using pre-embedded 768-dimensional normalized vectors in JSON, cosine similarity, a multi-stage defensive gate, and a graceful fallback chain.

```
                           Visitor Question
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │  Rate Limiter (IP-based)  │ ──► [429 Too Many Requests]
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Canned Small-Talk Filter  │ ──► [Instant Canned Reply]
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Cheap Portfolio Anchor    │
                    │ (Pronouns, keywords, JD)  │ ──► No ──► [no-match] (0 API Quota)
                    └─────────────┬─────────────┘
                                  │ Yes
                                  ▼
                    ┌───────────────────────────┐
                    │ Vector Retrieval (Cosine) │
                    │ (gemini-embedding-001)    │
                    └─────────────┬─────────────┘
                                  │
                     Top Chunk Score >= 0.58 ?
                                  │
                       ┌──────────┴──────────┐
                   Yes │                     │ No (and not JD/command)
                       ▼                     ▼
             ┌───────────────────┐    ┌────────────────────┐
             │ Context Injection │    │ [no-match]         │
             │   into Prompt     │    │ (0 LLM call used)  │
             └─────────┬─────────┘    └────────────────────┘
                       │
                       ▼
             ┌───────────────────┐
             │    Gemini API     │
             │  (Flash-Lite/LOW) │
             └─────────┬─────────┘
                       │
             ┌─────────┴─────────────────────┐
             │ Success                       │ Timeout / Error / Budget Exceeded
             ▼                               ▼
  ┌───────────────────────┐       ┌───────────────────────┐
  │ Leak Guard Regex      │       │ Best Retrieved Chunk  │ (source: "retrieval")
  │ & Link Sanitizer      │       └───────────┬───────────┘
  └──────────┬────────────┘                   │ If unavailable
             │ Passes                         ▼
             ▼                    ┌───────────────────────┐
      [rag / llm Reply]           │ Fuse.js Fuzzy Matcher │ (source: "static")
             │ Leak detected      └───────────┬───────────┘
             ▼                                │ If no match
      [guarded Fallback]                      ▼
                                  ┌───────────────────────┐
                                  │ Hand-written Fallback │ (source: "fallback")
                                  └───────────────────────┘
```

---

## Fallback & Defense Tiers

| Source | Description |
| :--- | :--- |
| `rag` | Semantic vector search retrieved relevant chunks; Gemini generated a grounded answer. |
| `llm` | Handled direct site actions, job description screening, or questions requiring broader context. |
| `retrieval` | Gemini timed out or hit budget limits; returns the highest-scoring chunk directly. |
| `static` | Retrieval failed or was unavailable; Fuse.js fuzzy searches curated question patterns. |
| `fallback` | Clean, polite hand-written message directing the visitor to contact Aarya directly. |
| `no-match` | Question has no portfolio anchor or relevance; deflected early without consuming LLM quota. |
| `guarded` | Output contained system prompt keywords or internal IDs; intercepted and sanitized. |

---

## Test & Hardening Benchmarks

The assistant is evaluated with two automated suites against prompt injection, jailbreaks, data leaks, and functional accuracy.

### 1. Attack Suite (`scripts/attacks.mjs`) — 60 / 60 Passed (100%)
* **Total test cases**: 60 (5 controls + 55 adversarial attacks)
* **Categories tested**: Direct override, fake system lines, end-of-context injections, instruction templates, payload splitting, system prompt extraction, persona adoption (DAN/pirate), phishing link injection, token flooding, off-topic requests, multi-turn escalation, and secret/API-key probing.
* **Early Deflection**: **27 of 55 attacks** were blocked at the retrieval/anchor filter stage, never touching Gemini and using 0 generation tokens.
* **System Prompt Resilience**: **28 of 55 attacks** reached Gemini and were deflected by prompt constraints without breaking persona, leaking instructions, or hallucinating.
* **Leak & Secret Protection**: 0 API key leaks (`KEY_PATTERN`), 0 prompt instruction disclosures (`LEAK_MARKERS`).

### 2. Functional Suite (`scripts/functional.mjs`) — 34 / 34 Passed (100%)
* **Factual Accuracy**: 10/10 (graduation timeline, Nabil Bank internship, tech stack, project architectures).
* **Honesty & Boundaries**: 4/4 (accurately admits when skills like Kubernetes are not in context).
* **Job Description Screening**: Evaluates full job descriptions against verified skills with matching percentages and gap analysis.
* **Copilot Actions**: Generates and executes site navigation tags (`[ACTION:navigate:*]`) and theme toggling (`[ACTION:theme:toggle]`).
* **Link Safety**: Strips unapproved domains and image tags while preserving official contact channels and resume downloads.

### 3. Latency & Budget Optimization
* **Model Configuration**: Defaulted to `gemini-3.5-flash-lite` with `THINKING_LEVEL="LOW"`.
* **Latency**: Reduced average response latency from ~7–9s down to **~1.2s – 2.5s**.
* **Daily Budget Guard**: In-memory rate limiting (8 requests/min, 60 requests/day per IP) combined with a hard in-code budget cap of 400 Gemini calls per day.

---

## Engineering Log (Self-Learning)

* **2026-10-12**: Implemented initial vector embeddings pipeline using `gemini-embedding-001` (768 dimensions) and cosine similarity in pure Node.js (`api/_rag.js`). Replaced heavy vector DB dependencies with a static `embeddings.json` index.
* **2026-10-15**: Designed and implemented the 60-case prompt injection suite (`attacks.mjs`). Introduced two-phase defense: cheap anchor heuristic to reject off-topic noise before embedding, and semantic similarity filtering (`MIN_SCORE = 0.58`) to block prompt injection before calling Gemini.
* **2026-10-22**: Added Fuse.js fuzzy matching backup tier and link sanitizer. Prevented unauthorized link exfiltration and Markdown image SSRF attacks.
* **2026-10-27**: Built the functional validation suite (`functional.mjs`) covering accuracy, JD fit evaluation, and graduation timeline switches (scheduled for Nov 2026).
* **2026-11-18**: Upgraded model to `gemini-3.5-flash-lite` with `THINKING_LEVEL="LOW"` to address reasoning model latency spikes, slashing response times by over 60%.
* **2026-11-20**:
  * Fixed pronoun matching in `hasPortfolioAnchor` so natural queries like *"Does he know Kubernetes?"* route to RAG instead of triggering premature `no-match`.
  * Hoisted `isSiteCommand` parsing before the cheap anchor filter, ensuring *"Toggle dark mode"* executes reliably.
  * Added instant theme toggle handler in `ChatWidget.tsx` for zero-latency local execution on suggestion chips.
  * Rebuilt embeddings index with updated Nabil Bank AI Developer internship context.

---

## Local Development & Testing

### Prerequisites
* Node.js 20+
* Google Gemini API Key

### Setup
```bash
# Clone the repository
git clone https://github.com/Aarya-Manandhar/portfolio.git
cd portfolio

# Install dependencies
npm install

# Configure environment variables
# Create .env.local with:
# GEMINI_API_KEY="your-api-key"
```

### Running Tests
```bash
# Rebuild vector embeddings from portfolio-qa.json
node --env-file=.env.local scripts/build-embeddings.mjs

# Run functional test suite (34 tests)
node --env-file=.env.local scripts/functional.mjs

# Run prompt injection & security suite (60 tests)
node --env-file=.env.local scripts/attacks.mjs

# Production TypeScript and Vite build check
npm run build
```

---

## License
MIT © [Aarya Manandhar](https://aaryamanandhar.com.np)
