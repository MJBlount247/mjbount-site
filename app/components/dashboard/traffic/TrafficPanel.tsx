import type { AnalyticsData } from "@/lib/types";
import { formatDuration, formatNumber, formatPercent, trendLabel } from "@/lib/analytics";
import { MetricCard } from "../MetricCard";
import { TrafficChart } from "./TrafficChart";
import { SourcesChart } from "./SourcesChart";
import { TopPages } from "./TopPages";

import styles from "./traffic-panel.module.css";

export function TrafficPanel({ analytics }: { analytics: AnalyticsData }) {
  const { summary, daily, sources, topPages, period } = analytics;
  const trendUp = summary.trend >= 0;
  const isEmpty = summary.sessions === 0;

  return (
    <div className={styles.panel}>
      <p className={styles.period}>
        {period.startDate} → {period.endDate}
      </p>

      {isEmpty && (
        <p className={styles.emptyNotice}>No data for this period</p>
      )}

      <div className={styles.metrics}>
        <MetricCard
          label="Sessions"
          value={formatNumber(summary.sessions)}
          trend={trendLabel(summary.trend)}
          trendUp={trendUp}
          subtext="vs previous period"
        />
        <MetricCard label="Users" value={formatNumber(summary.users)} />
        <MetricCard label="Pageviews" value={formatNumber(summary.pageviews)} />
        <MetricCard label="Bounce rate" value={formatPercent(summary.bounceRate)} />
        <MetricCard
          label="Avg session"
          value={formatDuration(summary.avgSessionDurationSeconds)}
        />
      </div>

      <TrafficChart daily={daily} />
      <SourcesChart sources={sources} />
      <TopPages pages={topPages} totalPageviews={summary.pageviews} />
    </div>
  );
}
