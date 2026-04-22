import fs from "fs";
import path from "path";

import type { ClientConfig } from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "clients");

export function getClient(slug: string): ClientConfig {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ClientConfig;
}

export function getAllClients(): ClientConfig[] {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as ClientConfig;
  });
}
