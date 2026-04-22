import type { AnalyticsData, DailyMetric, TopPage, TrafficSource } from "./types";

// Generates mock analytics data shaped like a real Cambridge pizzeria.
// Replace this function body with real GA4 Data API calls once
// GOOGLE_APPLICATION_CREDENTIALS is configured.
function buildMockData(slug: string, days: number): AnalyticsData {
  const seed = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = (min: number, max: number, offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor(min + ((x - Math.floor(x)) * (max - min)));
  };

  // Daily sessions with realistic restaurant traffic patterns (Thu–Sun peaks)
  const daily: DailyMetric[] = Array.from({ length: days }, (_, i) => {
    const dayOfWeek = (3 + i) % 7; // start mid-week
    const isWeekend = dayOfWeek >= 4; // Thu, Fri, Sat, Sun higher
    const base = isWeekend ? rng(38, 58, i) : rng(22, 38, i + 100);
    const sessions = base;
    return {
      date: formatDateOffset(i - days + 1),
      sessions,
      users: Math.floor(sessions * rng(72, 88, i + 200) / 100),
      pageviews: Math.floor(sessions * rng(270, 380, i + 300) / 100),
    };
  });

  const totalSessions = daily.reduce((s, d) => s + d.sessions, 0);
  const totalUsers = daily.reduce((s, d) => s + d.users, 0);
  const totalPageviews = daily.reduce((s, d) => s + d.pageviews, 0);

  // Compare to a synthetic previous period (slightly different seed)
  const prevSessions = Math.floor(totalSessions * rng(82, 118, 999) / 100);
  const trend = prevSessions > 0
    ? Math.round(((totalSessions - prevSessions) / prevSessions) * 100)
    : 0;

  const sources: TrafficSource[] = [
    { source: "google", medium: "organic", sessions: Math.floor(totalSessions * 0.31) },
    { source: "(direct)", medium: "(none)", sessions: Math.floor(totalSessions * 0.28) },
    { source: "google", medium: "cpc", sessions: Math.floor(totalSessions * 0.18) },
    { source: "instagram.com", medium: "referral", sessions: Math.floor(totalSessions * 0.12) },
    { source: "facebook.com", medium: "referral", sessions: Math.floor(totalSessions * 0.07) },
    { source: "tripadvisor.com", medium: "referral", sessions: Math.floor(totalSessions * 0.04) },
  ];

  const topPages: TopPage[] = [
    { path: "/", title: "Home", pageviews: Math.floor(totalPageviews * 0.34), avgDurationSeconds: 87 },
    { path: "/menu", title: "Menu", pageviews: Math.floor(totalPageviews * 0.28), avgDurationSeconds: 142 },
    { path: "/book", title: "Book a Table", pageviews: Math.floor(totalPageviews * 0.16), avgDurationSeconds: 203 },
    { path: "/about", title: "Our Story", pageviews: Math.floor(totalPageviews * 0.10), avgDurationSeconds: 95 },
    { path: "/events", title: "Private Events", pageviews: Math.floor(totalPageviews * 0.07), avgDurationSeconds: 118 },
    { path: "/contact", title: "Contact", pageviews: Math.floor(totalPageviews * 0.05), avgDurationSeconds: 64 },
  ];

  return {
    summary: {
      sessions: totalSessions,
      users: totalUsers,
      pageviews: totalPageviews,
      bounceRate: rng(44, 58, 500) + rng(0, 10, 501) / 10,
      avgSessionDurationSeconds: rng(85, 145, 600),
      trend,
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

export async function getAnalytics(slug: string, propertyId: string, days = 30): Promise<AnalyticsData> {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return buildMockData(slug, days);
  }

  // Real GA4 Data API implementation goes here.
  // Use the @google-analytics/data package or REST API with service account auth.
  // Return data shaped as AnalyticsData.
  return buildMockData(slug, days);
}
