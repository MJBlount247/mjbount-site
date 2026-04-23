"use client";

import type { ModuleStatus } from "@/lib/types";
import styles from "./module-card.module.css";

interface ModuleCardProps {
  title: string;
  status: ModuleStatus;
  metric?: string;
  metricLabel?: string;
  findings?: string[];
  onExpand: () => void;
}

const STATUS_LABEL: Record<ModuleStatus, string> = {
  good: "Good",
  warning: "Attention",
  issue: "Issue",
  info: "Info",
};

export function ModuleCard({
  title,
  status,
  metric,
  metricLabel,
  findings,
  onExpand,
}: ModuleCardProps) {
  return (
    <div
      className={`${styles.card} ${styles[`border_${status}`]}`}
      onClick={onExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onExpand()}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={`${styles.pill} ${styles[`pill_${status}`]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      {metric !== undefined && (
        <div className={styles.metric}>
          <span className={styles.metricValue}>{metric}</span>
          {metricLabel && <span className={styles.metricLabel}>{metricLabel}</span>}
        </div>
      )}

      {findings && findings.length > 0 && (
        <ul className={styles.findings}>
          {findings.slice(0, 2).map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}

      <button
        className={styles.expandBtn}
        onClick={(e) => {
          e.stopPropagation();
          onExpand();
        }}
      >
        View details →
      </button>
    </div>
  );
}
