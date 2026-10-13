// api/_rag.js — the building blocks of RAG (the leading underscore stops Vercel
// from exposing this file as a public route).
//
//   embed()      turns text into a vector (a list of numbers that captures meaning)
//   loadIndex()  loads the precomputed vectors for every chunk of your content
//   search()     finds the chunks whose vectors are closest to the question's vector

import fs from "node:fs";
import path from "node:path";

export const EMBED_MODEL = "gemini-embedding-001";
export const EMBED_DIMS = 768; // smaller vectors = smaller file, still plenty for ~20 chunks

// 1) EMBED -------------------------------------------------------------------
// taskType matters: store chunks as RETRIEVAL_DOCUMENT, questions as RETRIEVAL_QUERY.
export async function embed(text, taskType) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      taskType,
      outputDimensionality: EMBED_DIMS,
    }),
    signal: AbortSignal.timeout(Number(process.env.EMBED_TIMEOUT_MS ?? 5000)), // a one-sentence embedding should take well under a second
  });
  if (!response.ok) {
    const err = new Error(`Embedding HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }
  const data = await response.json();
  return normalize(data.embedding.values);
}

// Scale a vector to length 1. Then "dot product" == "cosine similarity" (-1..1, higher = closer in meaning).
// Needed because only the full 3072-dim output comes pre-normalized from the API.
export function normalize(v) {
  const len = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / len);
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

// 2) INDEX -------------------------------------------------------------------
// Created by scripts/build-embeddings.mjs. Returns null if it doesn't exist yet,
// so the chatbot still works (without retrieval) before you've built it.
export function loadIndex() {
  const file = path.join(process.cwd(), "api", "_data", "embeddings.json");
  if (!fs.existsSync(file)) return null;

  const index = JSON.parse(fs.readFileSync(file, "utf8"));
  if (index.model !== EMBED_MODEL || index.dims !== EMBED_DIMS) {
    console.warn("embeddings.json was built with a different model/size: rebuild it.");
    return null;
  }
  // Re-normalize: vectors were rounded when saved to keep the file small
  index.chunks.forEach((c) => (c.vector = normalize(c.vector)));
  return index;
}

// 3) SEARCH ------------------------------------------------------------------
// Compare the question's vector with every chunk, return the k closest.
export function search(queryVector, index, k) {
  if (queryVector.length !== index.dims) throw new Error("Vector size mismatch");
  return index.chunks
    .map((c) => ({ id: c.id, text: c.text, score: dot(queryVector, c.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}