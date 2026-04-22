import type { DailyMetric } from "@/lib/types";
import { chartMax } from "@/lib/analytics";

import styles from "./traffic-chart.module.css";

type TrafficChartProps = {
  daily: DailyMetric[];
};

export function TrafficChart({ daily }: TrafficChartProps) {
  const max = chartMax(daily);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Sessions — last {daily.length} days</h2>
      <div className={styles.chart}>
        {daily.map((day) => {
          const heightPct = Math.max((day.sessions / max) * 100, 2);
          const label = day.date.slice(5); // "MM-DD"
          return (
            <div key={day.date} className={styles.barGroup} title={`${label}: ${day.sessions} sessions`}>
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
