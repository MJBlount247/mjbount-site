import fs from "fs";
import path from "path";

import type { CachedSummary } from "./types";

const CACHE_DIR = path.join(process.cwd(), "data", "cache");

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function getCachedSummary(slug: string): CachedSummary | null {
  ensureCacheDir();
  const cachePath = path.join(CACHE_DIR, `${slug}-summary.json`);
  if (!fs.existsSync(cachePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(cachePath, "utf-8")) as CachedSummary;
  } catch {
    return null;
  }
}

export function writeSummaryCache(slug: string, summary: string): CachedSummary {
  ensureCacheDir();
  const cache: CachedSummary = { summary, generatedAt: new Date().toISOString() };
  fs.writeFileSync(
    path.join(CACHE_DIR, `${slug}-summary.json`),
    JSON.stringify(cache, null, 2)
  );
  return cache;
}
