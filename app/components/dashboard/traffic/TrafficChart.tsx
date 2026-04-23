import type { DailyMetric } from "@/lib/types";
import { chartMax } from "@/lib/analytics";

import styles from "./traffic-chart.module.css";

export function TrafficChart({ daily }: { daily: DailyMetric[] }) {
  const max = chartMax(daily);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Sessions — last {daily.length} days</h2>
      <div className={styles.chart}>
        {daily.map((day) => {
          const heightPct = Math.max((day.sessions / max) * 100, 2);
          const label = day.date.slice(5);
          return (
            <div
              key={day.date}
              className={styles.barGroup}
              title={`${label}: ${day.sessions} sessions`}
            >
              <div className={styles.barWrap}>
                <div className={styles.bar} style={{ height: `${heightPct}%` }} />
              </div>
              <span className={styles.barLabel}>{label.replace("-", "/")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
