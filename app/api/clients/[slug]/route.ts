import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import type { ROIConfig } from "@/lib/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const clientPath = path.join(process.cwd(), "data", "clients", `${slug}.json`);

  if (!fs.existsSync(clientPath)) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  let body: { roi?: ROIConfig };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const current = JSON.parse(fs.readFileSync(clientPath, "utf-8"));
  const updated = { ...current, ...body };
  fs.writeFileSync(clientPath, JSON.stringify(updated, null, 2));

  return NextResponse.json({ ok: true });
}
