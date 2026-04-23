"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { AnalyticsData, CachedSummary, ClientConfig, ModuleDef, SpeedData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { SlidePanel } from "./SlidePanel";
import { TrafficPanel } from "./traffic/TrafficPanel";
import { ROICalculator } from "./roi/ROICalculator";
import { TechnicalAudit } from "./technical/TechnicalAudit";
import { SpeedScore } from "./speed/SpeedScore";
import { SEOAudit } from "./seo/SEOAudit";
import { StrategicAudit } from "./strategic/StrategicAudit";
import { SiteMaintenance } from "./maintenance/SiteMaintenance";

import styles from "./dashboard-shell.module.css";

interface DashboardShellProps {
  client: ClientConfig;
  analytics: AnalyticsData;
  speedData: SpeedData | null;
  cachedSummary: CachedSummary | null;
  hasApiKey: boolean;
  logoUrl: string;
  modules: ModuleDef[];
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function DashboardShell({
  client,
  analytics,
  speedData,
  cachedSummary,
  hasApiKey,
  logoUrl,
  modules,
}: DashboardShellProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(cachedSummary?.summary ?? null);
  const [summaryDate, setSummaryDate] = useState<string | null>(cachedSummary?.generatedAt ?? null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const alertCount = modules.filter((m) => m.status === "issue" || m.status === "warning").length;
  const activeModuleDef = modules.find((m) => m.id === activeModule);

  const handleRefreshSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch(`/api/ai-summary/${client.slug}`, { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as CachedSummary;
        setSummary(data.summary);
        setSummaryDate(data.generatedAt);
      }
    } finally {
      setSummaryLoading(false);
    }
  }, [client.slug]);

  function getPanelContent() {
    switch (activeModule) {
      case "traffic":    return <TrafficPanel analytics={analytics} />;
      case "roi":        return <ROICalculator client={client} />;
      case "technical":  return <TechnicalAudit client={client} />;
      case "speed":      return <SpeedScore client={client} initialData={speedData} />;
      case "seo":        return <SEOAudit client={client} />;
      case "strategic":  return <StrategicAudit client={client} />;
      default:           return null;
    }
  }

  return (
    <div className={styles.shell}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className={styles.topBar}>
        <Link href="/dashboard" className={styles.backLink}>
          ← All clients
        </Link>

        <div className={styles.brand}>
          <div className={styles.logoWrap} style={{ background: client.brand.secondary }}>
            <Image
              src={logoUrl}
              alt={client.client}
              width={160}
              height={40}
              className={styles.logo}
            />
          </div>
          <div className={styles.clientInfo}>
            <span className={styles.clientName}>{client.client}</span>
            <span className={styles.clientDomain}>{client.domain}</span>
          </div>
        </div>

        <div className={styles.topBarActions}>
          {alertCount > 0 && (
            <span className={styles.alertBadge}>
              {alertCount} {alertCount === 1 ? "issue" : "issues"}
            </span>
          )}
          <span className={styles.lastUpdated}>Updated just now</span>
          <Link href={`/dashboard/${client.slug}/export`} className={styles.exportBtn}>
            Export report →
          </Link>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className={styles.main}>
        {/* AI overview */}
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>AI overview</p>

          {summaryLoading ? (
            <p className={styles.summaryPlaceholder}>Generating summary…</p>
          ) : summary ? (
            <>
              <p className={styles.summaryText}>{summary}</p>
              <div className={styles.summaryMeta}>
                <span>
                  Generated {summaryDate ? relativeDate(summaryDate) : ""} by Claude
                </span>
                <button className={styles.refreshBtn} onClick={handleRefreshSummary}>
                  Refresh
                </button>
              </div>
            </>
          ) : hasApiKey ? (
            <button className={styles.generateBtn} onClick={handleRefreshSummary}>
              Generate AI summary
            </button>
          ) : (
            <p className={styles.summaryPlaceholder}>
              Add <code>ANTHROPIC_API_KEY</code> to your environment to enable summaries.
            </p>
          )}
        </section>

        {/* Module grid */}
        <div className={styles.moduleGrid}>
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              title={mod.title}
              status={mod.status}
              metric={mod.metric}
              metricLabel={mod.metricLabel}
              findings={mod.findings}
              onExpand={() => setActiveModule(mod.id)}
            />
          ))}
        </div>

        {/* Site maintenance — always visible */}
        <SiteMaintenance client={client} />
      </main>

      {/* ── Slide panel ──────────────────────────────────────────── */}
      <SlidePanel
        isOpen={activeModule !== null}
        title={activeModuleDef?.title ?? ""}
        onClose={() => setActiveModule(null)}
      >
        {getPanelContent()}
      </SlidePanel>
    </div>
  );
}
