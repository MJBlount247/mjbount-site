import styles from "./metric-card.module.css";

type MetricCardProps = {
  label: string;
  value: string;
  subtext?: string;
  trend?: string;
  trendUp?: boolean;
};

export function MetricCard({ label, value, subtext, trend, trendUp }: MetricCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      <div className={styles.footer}>
        {subtext && <span className={styles.subtext}>{subtext}</span>}
        {trend && (
          <span className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
    </div>
  );
}
