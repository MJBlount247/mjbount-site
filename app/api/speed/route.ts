import { NextRequest, NextResponse } from "next/server";
import { getSpeedScore } from "@/lib/pagespeed";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }

  console.log(`[speed] fetching: ${url}`);
  const data = await getSpeedScore(url);
  if (!data) {
    return NextResponse.json({ error: "PageSpeed request failed" }, { status: 502 });
  }

  return NextResponse.json(data);
}
