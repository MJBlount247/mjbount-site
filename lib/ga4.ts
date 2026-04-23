import type { AnalyticsData, ClientConfig, DailyMetric, TopPage, TrafficSource } from "./types";

async function fetchFromGA4(client: ClientConfig, days: number): Promise<AnalyticsData> {
  const { BetaAnalyticsDataClient } = await import("@google-analytics/data");

  let analyticsClient: InstanceType<typeof BetaAnalyticsDataClient>;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    analyticsClient = new BetaAnalyticsDataClient({ credentials });
  } else {
    analyticsClient = new BetaAnalyticsDataClient();
  }
  const property = `properties/${client.ga4_property_id}`;
  const dateRange = { startDate: `${days}daysAgo`, endDate: "today" };

  const [[dailyRes], [summaryRes], [sourcesRes], [pagesRes]] = await Promise.all([
    analyticsClient.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
    analyticsClient.runReport({
      property,
      dateRanges: [dateRange, { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
    }),
    analyticsClient.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 6,
    }),
    analyticsClient.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }, { name: "averageSessionDuration" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 6,
    }),
  ]);

  const daily: DailyMetric[] = (dailyRes.rows ?? []).map((row) => ({
    date: row.dimensionValues?.[0].value ?? "",
    sessions: Number(row.metricValues?.[0].value ?? 0),
    users: Number(row.metricValues?.[1].value ?? 0),
    pageviews: Number(row.metricValues?.[2].value ?? 0),
  }));

  const cur = summaryRes.rows?.[0];
  const prev = summaryRes.rows?.[1];
  const curSessions = Number(cur?.metricValues?.[0].value ?? 0);
  const prevSessions = Number(prev?.metricValues?.[0].value ?? 1);

  const sources: TrafficSource[] = (sourcesRes.rows ?? []).map((row) => ({
    source: row.dimensionValues?.[0].value ?? "(direct)",
    medium: row.dimensionValues?.[1].value ?? "(none)",
    sessions: Number(row.metricValues?.[0].value ?? 0),
  }));

  const topPages: TopPage[] = (pagesRes.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0].value ?? "/",
    title: row.dimensionValues?.[1].value ?? "",
    pageviews: Number(row.metricValues?.[0].value ?? 0),
    avgDurationSeconds: Math.round(Number(row.metricValues?.[1].value ?? 0)),
  }));

  return {
    summary: {
      sessions: curSessions,
      users: Number(cur?.metricValues?.[1].value ?? 0),
      pageviews: Number(cur?.metricValues?.[2].value ?? 0),
      bounceRate: Number(cur?.metricValues?.[3].value ?? 0) * 100,
      avgSessionDurationSeconds: Math.round(Number(cur?.metricValues?.[4].value ?? 0)),
      trend: prevSessions > 0 ? Math.round(((curSessions - prevSessions) / prevSessions) * 100) : 0,
    },
    daily,
    sources,
    topPages,
    period: {
      startDate: formatDateOffset(-days + 1),
      endDate: formatDateOffset(0),
      days,
    },
  };
}

function formatDateOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export async function getAnalytics(client: ClientConfig, days = 30): Promise<AnalyticsData> {
  return fetchFromGA4(client, days);
}
