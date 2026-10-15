
import fs from "node:fs";
import path from "node:path";

export const EMBED_MODEL = "gemini-embedding-001";
export const EMBED_DIMS = 768; // smaller vectors = smaller file, still plenty for ~20 chunks


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

export function normalize(v) {
  const len = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / len);
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export function loadIndex() {
  const file = path.join(process.cwd(), "api", "_data", "embeddings.json");
  if (!fs.existsSync(file)) return null;

  const index = JSON.parse(fs.readFileSync(file, "utf8"));
  if (index.model !== EMBED_MODEL || index.dims !== EMBED_DIMS) {
    console.warn("embeddings.json was built with a different model/size: rebuild it.");
    return null;
  }
  index.chunks.forEach((c) => (c.vector = normalize(c.vector)));
  return index;
}
export function search(queryVector, index, k) {
  if (queryVector.length !== index.dims) throw new Error("Vector size mismatch");
  return index.chunks
    .map((c) => ({ id: c.id, text: c.text, score: dot(queryVector, c.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}