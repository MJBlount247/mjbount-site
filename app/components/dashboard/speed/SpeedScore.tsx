"use client";

import { useCallback, useEffect, useState } from "react";
import type { ClientConfig, SpeedData, SpeedMetrics, SpeedOpportunity } from "@/lib/types";

// Parse a PageSpeed displayValue string back to a raw number for threshold comparisons.
// CLS is unitless ("0.12"), time values end in " s" or " ms".
function parseCwvRaw(key: CWVKey, display: string): number {
  const s = display.trim();
  if (key === "cls") return parseFloat(s) || 0;
  const lower = s.toLowerCase();
  if (lower.endsWith(" s"))  return (parseFloat(s) || 0) * 1000;
  if (lower.endsWith(" ms")) return parseFloat(s) || 0;
  return 0;
}
import styles from "./speed.module.css";

function resolveUrl(domain: string, path: string): string {
  if (path.startsWith("http")) return path;
  return `https://${domain}${path}`;
}

function scoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function ScoreRing({ score }: { score: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const fill = (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <svg className={styles.ring} viewBox="0 0 88 88" width={88} height={88}>
      <circle cx={44} cy={44} r={radius} fill="none" stroke="var(--dash-border)" strokeWidth={8} />
      <circle
        cx={44} cy={44} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeDasharray={`${fill} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text
        x={44} y={44}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={22}
        fontWeight={800}
      >
        {score}
      </text>
    </svg>
  );
}

function SubScore({ label, score }: { label: string; score: number }) {
  return (
    <div className={styles.subScore}>
      <span className={styles.subScoreLabel}>{label}</span>
      <span className={styles.subScoreValue} style={{ color: scoreColor(score) }}>{score}</span>
    </div>
  );
}

function DeviceCard({ label, metrics }: { label: string; metrics: SpeedMetrics }) {
  return (
    <div className={styles.deviceCard}>
      <span className={styles.deviceLabel}>{label}</span>
      <ScoreRing score={metrics.score} />
      <div className={styles.subScores}>
        <SubScore label="SEO" score={metrics.seo} />
        <SubScore label="Accessibility" score={metrics.accessibility} />
        <SubScore label="Best Practices" score={metrics.bestPractices} />
      </div>
    </div>
  );
}

type CWVKey = "lcp" | "cls" | "inp" | "fcp" | "ttfb" | "speedIndex";

const CWV_KEYS: CWVKey[] = ["lcp", "cls", "inp", "fcp", "ttfb", "speedIndex"];

const CWV_CONFIG: Record<CWVKey, { label: string; target: string; good: number; poor: number }> = {
  lcp:        { label: "LCP",         target: "≤ 2.5s",  good: 2500, poor: 4000 },
  cls:        { label: "CLS",         target: "≤ 0.1",   good: 0.1,  poor: 0.25 },
  inp:        { label: "INP",         target: "≤ 200ms", good: 200,  poor: 500 },
  fcp:        { label: "FCP",         target: "≤ 1.8s",  good: 1800, poor: 3000 },
  ttfb:       { label: "TTFB",        target: "≤ 800ms", good: 800,  poor: 1800 },
  speedIndex: { label: "Speed Index", target: "≤ 3.4s",  good: 3400, poor: 5800 },
};

function cwvColor(raw: number, good: number, poor: number): string {
  if (raw <= good) return "#22c55e";
  if (raw <= poor) return "#f59e0b";
  return "#ef4444";
}

function CWVCard({ metricKey, metrics }: { metricKey: CWVKey; metrics: SpeedMetrics }) {
  const cfg = CWV_CONFIG[metricKey];
  const raw = parseCwvRaw(metricKey, metrics[metricKey]);
  const color = cwvColor(raw, cfg.good, cfg.poor);
  const barWidth = Math.min((raw / cfg.poor) * 100, 100);

  return (
    <div className={styles.cwvCard}>
      <span className={styles.cwvLabel}>{cfg.label}</span>
      <span className={styles.cwvValue} style={{ color }}>{metrics[metricKey]}</span>
      <span className={styles.cwvTarget}>{cfg.target}</span>
      <div className={styles.cwvBar}>
        <div className={styles.cwvBarFill} style={{ width: `${barWidth}%`, background: color }} />
      </div>
    </div>
  );
}

function OpportunityRow({ opportunity }: { opportunity: SpeedOpportunity }) {
  const isRed = opportunity.savingsMs > 1000;
  const savingsSec = (opportunity.savingsMs / 1000).toFixed(1);

  return (
    <div className={styles.opportunityRow}>
      <span className={`${styles.dot} ${isRed ? styles.dotRed : styles.dotAmber}`} />
      <div className={styles.opportunityText}>
        <span className={styles.opportunityTitle}>{opportunity.title}</span>
        <span className={styles.opportunityDesc}>{opportunity.description}</span>
      </div>
      <span
        className={styles.opportunitySaving}
        style={{ color: isRed ? "#ef4444" : "#f59e0b" }}
      >
        -{savingsSec}s
      </span>
    </div>
  );
}

function EmptyState({ url, onRetry }: { url: string; onRetry: () => void }) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>PageSpeed data unavailable</p>
      <p className={styles.emptyHint}>
        Check your <code>PAGESPEED_API_KEY</code> and that the PageSpeed
        Insights API is enabled in your Google Cloud project.
      </p>
      <p className={styles.emptyUrl}>{url}</p>
      <button className={styles.retryBtn} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function SpeedScore({
  client,
  initialData,
}: {
  client: ClientConfig;
  initialData: SpeedData | null;
}) {
  const pages = client.website.key_pages;
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<SpeedData | null>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (index: number) => {
    const fullUrl = resolveUrl(client.domain, pages[index].url);
    setLoading(true);
    try {
      const res = await fetch(`/api/speed?url=${encodeURIComponent(fullUrl)}`);
      const json = (await res.json()) as SpeedData;
      setData(res.ok ? json : null);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [client.domain, pages]);

  // Auto-fetch tab 0 on mount when the server-side prefetch returned null
  useEffect(() => {
    if (!initialData) {
      fetchPage(0);
    }
  }, [initialData, fetchPage]);

  async function handleTabClick(index: number) {
    if (index === activeTab) return;
    setActiveTab(index);
    await fetchPage(index);
  }

  const currentPageUrl = resolveUrl(client.domain, pages[activeTab]?.url ?? "/");

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {pages.map((page, i) => (
          <button
            key={page.url}
            className={`${styles.tab} ${i === activeTab ? styles.tabActive : ""}`}
            onClick={() => handleTabClick(i)}
          >
            {page.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Fetching scores…</div>
      ) : !data ? (
        <EmptyState url={currentPageUrl} onRetry={() => fetchPage(activeTab)} />
      ) : (
        <>
          <div className={styles.deviceGrid}>
            {(["mobile", "desktop"] as const).map((device) => (
              <DeviceCard key={device} label={device} metrics={data[device]} />
            ))}
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Core Web Vitals — Mobile</h3>
            <div className={styles.cwvGrid}>
              {CWV_KEYS.map((key) => (
                <CWVCard key={key} metricKey={key} metrics={data.mobile} />
              ))}
            </div>
          </div>

          {data.mobile.opportunities.length > 0 && (
            <div>
              <h3 className={styles.sectionTitle}>Biggest opportunities</h3>
              <div className={styles.opportunities}>
                {data.mobile.opportunities.map((opp, i) => (
                  <OpportunityRow key={i} opportunity={opp} />
                ))}
              </div>
            </div>
          )}

          <a
            href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(currentPageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fullReportLink}
          >
            View full PageSpeed report →
          </a>
        </>
      )}
    </div>
  );
}
