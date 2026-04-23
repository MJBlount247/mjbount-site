import type { AnalyticsSummary, DailyMetric, TopPage, TrafficSource } from "./types";

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function sourcesWithPercent(sources: TrafficSource[]): Array<TrafficSource & { percent: number }> {
  const total = sources.reduce((sum, s) => sum + s.sessions, 0);
  return sources.map((s) => ({
    ...s,
    percent: total > 0 ? Math.round((s.sessions / total) * 100) : 0,
  }));
}

export function topPagesWithPercent(pages: TopPage[], totalPageviews: number): Array<TopPage & { percent: number }> {
  return pages.map((p) => ({
    ...p,
    percent: totalPageviews > 0 ? Math.round((p.pageviews / totalPageviews) * 100) : 0,
  }));
}

export function chartMax(daily: DailyMetric[]): number {
  return Math.max(...daily.map((d) => d.sessions), 1);
}

export function trendLabel(trend: AnalyticsSummary["trend"]): string {
  if (trend > 0) return `+${trend.toFixed(0)}%`;
  return `${trend.toFixed(0)}%`;
}

export function lightenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
