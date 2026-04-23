import { notFound } from "next/navigation";

import { getClient, getLogo } from "@/lib/getClient";
import { getAnalytics } from "@/lib/ga4";
import { getSpeedScore } from "@/lib/pagespeed";
import { getCachedSummary } from "@/lib/cache";
import { lightenHex } from "@/lib/analytics";
import { calculateROI } from "@/lib/roi";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";

import type { ModuleDef, ModuleStatus } from "@/lib/types";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let client;
  try {
    client = getClient(slug);
  } catch {
    notFound();
  }

  const siteUrl = `https://${client.domain}`;

  const [analytics, speedData, cachedSummary] = await Promise.all([
    getAnalytics(client),
    getSpeedScore(siteUrl),
    Promise.resolve(getCachedSummary(slug)),
  ]);

  // ── Compute module statuses ────────────────────────────────────────────────

  const trafficStatus: ModuleStatus =
    analytics.summary.trend >= 5
      ? "good"
      : analytics.summary.trend >= -5
      ? "info"
      : "warning";

  const trafficMetric = `${analytics.summary.sessions.toLocaleString()} sessions`;
  const trafficFindings = [
    `${analytics.summary.trend >= 0 ? "+" : ""}${analytics.summary.trend.toFixed(0)}% vs previous period`,
    analytics.sources[0]
      ? `Top source: ${analytics.sources[0].source}`
      : "",
  ].filter(Boolean);

  let roiStatus: ModuleStatus = "info";
  let roiMetric = "Not configured";
  let roiFindings: string[] = ["Add an roi key to the client JSON to enable."];
  if (client.roi) {
    const result = calculateROI(client.roi, {});
    roiStatus =
      result.verdictLevel === "good"
        ? "good"
        : result.verdictLevel === "warning"
        ? "warning"
        : "issue";
    roiMetric = `${result.roiMultiplier.toFixed(1)}× ROI`;
    roiFindings = [result.verdict];
  }

  let speedStatus: ModuleStatus = "info";
  let speedMetric = "No data";
  let speedFindings: string[] = ["PageSpeed data will be fetched on next load."];
  if (speedData) {
    speedStatus =
      speedData.mobile.score >= 90
        ? "good"
        : speedData.mobile.score >= 50
        ? "warning"
        : "issue";
    speedMetric = `${speedData.mobile.score} mobile`;
    speedFindings = [
      `Desktop: ${speedData.desktop.score}`,
      `LCP: ${speedData.mobile.lcp}`,
    ];
  }

  const modules: ModuleDef[] = [
    {
      id: "traffic",
      title: "Traffic & behaviour",
      status: trafficStatus,
      metric: trafficMetric,
      metricLabel: `Last ${analytics.period.days} days`,
      findings: trafficFindings,
    },
    {
      id: "roi",
      title: "ROI calculator",
      status: roiStatus,
      metric: roiMetric,
      metricLabel: "Estimated return",
      findings: roiFindings,
    },
    {
      id: "technical",
      title: "Technical audit",
      status: "info",
      metric: "Not run",
      metricLabel: "On demand",
      findings: ["Trigger a crawl to surface issues."],
    },
    {
      id: "speed",
      title: "Site speed",
      status: speedStatus,
      metric: speedMetric,
      metricLabel: "PageSpeed score",
      findings: speedFindings,
    },
    {
      id: "seo",
      title: "SEO / AEO audit",
      status: "info",
      metric: "Not configured",
      metricLabel: "Search Console",
      findings: ["Connect Search Console to see impressions and clicks."],
    },
    {
      id: "strategic",
      title: "Strategic audit",
      status: "info",
      metric: "Not run",
      metricLabel: "On demand",
      findings: ["Run on demand to analyse conversion, brand, and content."],
    },
  ];

  // ── CSS variables from theme ───────────────────────────────────────────────

  const theme = client.dashboard.theme_override;
  const bg = theme.dashboard_background;

  const cssVars = {
    "--brand-primary":    client.brand.primary,
    "--brand-secondary":  client.brand.secondary,
    "--brand-accent":     client.brand.accent,
    "--dash-accent":      theme.chart_color_primary,
    "--dash-accent2":     theme.chart_color_secondary,
    "--dash-bg":          bg,
    "--dash-card-bg":     lightenHex(bg, 10),
    "--dash-border":      lightenHex(bg, 22),
    "--dash-text-primary": theme.dashboard_text,
    "--dash-text-muted":  lightenHex(bg, 90),
    "--dash-radius":      theme.card_radius,
  } as React.CSSProperties;

  const logoUrl = getLogo(client, "dark");
  const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div style={{ ...cssVars, minHeight: "100vh", background: "var(--dash-bg)" }}>
      <DashboardShell
        client={client}
        analytics={analytics}
        speedData={speedData}
        cachedSummary={cachedSummary}
        hasApiKey={hasApiKey}
        logoUrl={logoUrl}
        modules={modules}
      />
    </div>
  );
}
