import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getClient } from "@/lib/getClient";
import { getAnalytics } from "@/lib/ga4";
import { formatDuration, formatNumber, formatPercent, trendLabel } from "@/lib/analytics";
import { MetricCard } from "@/app/components/dashboard/MetricCard";
import { TrafficChart } from "@/app/components/dashboard/TrafficChart";
import { SourcesChart } from "@/app/components/dashboard/SourcesChart";
import { TopPages } from "@/app/components/dashboard/TopPages";
import { AISummary } from "@/app/components/dashboard/AISummary";

import styles from "./dashboard.module.css";

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

  const analytics = await getAnalytics(slug, client.ga4PropertyId, client.dashboard.reportingPeriodDays);
  const { summary, daily, sources, topPages, period } = analytics;
  const trendUp = summary.trend >= 0;

  const cssVars = {
    "--dash-accent": client.brand.primary,
    "--dash-bg": "#0f0f0f",
    "--dash-card-bg": "#141414",
    "--dash-border": "#242424",
    "--dash-text-primary": "#f0f0f0",
    "--dash-text-muted": "#6b6b6b",
  } as React.CSSProperties;

  return (
    <div className={styles.shell} style={cssVars}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← All clients</Link>

        <div className={styles.brandHeader}>
          <div className={styles.logoWrap} style={{ background: client.brand.primary }}>
            <Image
              src={client.logo.darkFull}
              alt={client.name}
              width={200}
              height={64}
              className={styles.logo}
            />
          </div>
          <div>
            <h1 className={styles.clientName}>{client.name}</h1>
            <p className={styles.periodLabel}>
              {period.startDate} → {period.endDate} · {period.days} days
            </p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.metrics}>
          <MetricCard
            label="Sessions"
            value={formatNumber(summary.sessions)}
            trend={trendLabel(summary.trend)}
            trendUp={trendUp}
            subtext="vs previous period"
          />
          <MetricCard
            label="Users"
            value={formatNumber(summary.users)}
          />
          <MetricCard
            label="Pageviews"
            value={formatNumber(summary.pageviews)}
          />
          <MetricCard
            label="Bounce rate"
            value={formatPercent(summary.bounceRate)}
          />
          <MetricCard
            label="Avg session"
            value={formatDuration(summary.avgSessionDurationSeconds)}
          />
        </div>

        <Suspense fallback={<div className={styles.summaryPlaceholder}>Generating summary…</div>}>
          <AISummary client={client} analytics={analytics} />
        </Suspense>

        <TrafficChart daily={daily} />

        <div className={styles.twoCol}>
          <SourcesChart sources={sources} />
          <TopPages pages={topPages} totalPageviews={summary.pageviews} />
        </div>
      </main>
    </div>
  );
}
