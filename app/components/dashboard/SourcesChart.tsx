import type { TrafficSource } from "@/lib/types";
import { formatNumber, sourcesWithPercent } from "@/lib/analytics";

import styles from "./sources-chart.module.css";

type SourcesChartProps = {
  sources: TrafficSource[];
};

const SOURCE_LABELS: Record<string, string> = {
  "(direct)": "Direct",
  "google": "Google",
  "instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "tripadvisor.com": "Tripadvisor",
};

function sourceLabel(source: string, medium: string): string {
  const base = SOURCE_LABELS[source] ?? source;
  if (medium === "cpc") return `${base} (Paid)`;
  if (medium === "organic") return `${base} (Organic)`;
  return base;
}

export function SourcesChart({ sources }: SourcesChartProps) {
  const withPct = sourcesWithPercent(sources);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Traffic sources</h2>
      <ul className={styles.list}>
        {withPct.map((s, i) => (
          <li key={i} className={styles.row}>
            <span className={styles.name}>{sourceLabel(s.source, s.medium)}</span>
            <div className={styles.barTrack}>
              <div className={styles.bar} style={{ width: `${s.percent}%` }} />
            </div>
            <span className={styles.count}>{formatNumber(s.sessions)}</span>
            <span className={styles.pct}>{s.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
