import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import { getClient } from "@/lib/getClient";
import { getAnalytics } from "@/lib/ga4";
import { writeSummaryCache } from "@/lib/cache";
import { formatNumber, formatPercent, formatDuration } from "@/lib/analytics";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let client;
  try {
    client = getClient(slug);
  } catch {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 503 });
  }

  const analytics = await getAnalytics(client);
  const { summary, sources, topPages } = analytics;

  const topSource = sources[0]
    ? `${sources[0].source} / ${sources[0].medium} (${sources[0].sessions} sessions)`
    : "unknown";

  const topPage = topPages[0]
    ? `${topPages[0].title || topPages[0].path} (${topPages[0].pageviews} pageviews)`
    : "unknown";

  const prompt = `You are an agency analytics assistant writing a plain-English executive summary for an internal dashboard.

Client: ${client.client} (${client.domain})
Business: ${client.business.description}
Period: last ${analytics.period.days} days

Analytics snapshot:
- Sessions: ${formatNumber(summary.sessions)} (${summary.trend >= 0 ? "+" : ""}${summary.trend.toFixed(0)}% vs previous period)
- Unique users: ${formatNumber(summary.users)}
- Pageviews: ${formatNumber(summary.pageviews)}
- Bounce rate: ${formatPercent(summary.bounceRate)}
- Avg session duration: ${formatDuration(summary.avgSessionDurationSeconds)}
- Top traffic source: ${topSource}
- Most visited page: ${topPage}

Write 2–3 sentences summarising performance and the single most important thing to action. Be direct. No bullet points, no headers. Write for the agency owner, not the client.`;

  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const cached = writeSummaryCache(slug, text);
  return NextResponse.json(cached);
}
