import fs from "fs";
import path from "path";

import type { ClientConfig } from "./types";

export function getClient(slug: string): ClientConfig {
  const file = path.join(process.cwd(), "data", "clients", `${slug}.json`);
  return JSON.parse(fs.readFileSync(file, "utf-8")) as ClientConfig;
}

export function getAllClients(): ClientConfig[] {
  const dir = path.join(process.cwd(), "data", "clients");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as ClientConfig);
}

type LogoContext = "dark" | "light" | "icon";

export function getLogo(client: ClientConfig, context: LogoContext): string {
  const base = `/clients/${client.slug}/`;
  const map: Record<LogoContext, { file: string }> = {
    dark: client.brand.logo.full_orange_on_black,
    light: client.brand.logo.icon_orange_on_white,
    icon: client.brand.logo.icon_white_on_black,
  };
  return base + map[context].file;
}
