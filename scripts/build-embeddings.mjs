// scripts/build-embeddings.mjs — the INDEXING half of RAG. Run it whenever your content changes:
//
//   node --env-file=.env.local scripts/build-embeddings.mjs
//
// Reads api/_data/portfolio-qa.json, embeds every chunk once, saves api/_data/embeddings.json.
// This runs on your machine, not on every visitor request, so it costs almost nothing.

import fs from "node:fs";
import path from "node:path";
import { embed, EMBED_MODEL, EMBED_DIMS } from "../api/_rag.js";

const dataDir = path.join(process.cwd(), "api", "_data");
const qa = JSON.parse(fs.readFileSync(path.join(dataDir, "portfolio-qa.json"), "utf8"));
const delay = Number(process.env.EMBED_DELAY_MS ?? 700); // stay under free-tier rate limits
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing. Run with: node --env-file=.env.local scripts/build-embeddings.mjs");
  process.exit(1);
}

// CHUNKING: each JSON entry is one chunk (one topic, a few sentences).
// To add more knowledge (e.g. a case-study section), add another entry to the JSON and re-run.
const chunks = [];
for (const entry of qa.entries) {
  // We embed the question phrasings together with the answer, so a visitor's wording
  // can match even when it shares few words with the answer text itself.
  const textToEmbed = `${entry.questions.join("; ")}\n${entry.answer}`;
  const vector = await embed(textToEmbed, "RETRIEVAL_DOCUMENT");
  chunks.push({
    id: entry.id,
    text: entry.answer, // this is what gets sent to the LLM
    vector: vector.map((x) => Math.round(x * 1e5) / 1e5),
  });
  console.log(`embedded ${entry.id}`);
  await sleep(delay);
}

const out = { model: EMBED_MODEL, dims: EMBED_DIMS, builtAt: new Date().toISOString(), chunks };
fs.writeFileSync(path.join(dataDir, "embeddings.json"), JSON.stringify(out));
console.log(`\nDone: ${chunks.length} chunks -> api/_data/embeddings.json`);
