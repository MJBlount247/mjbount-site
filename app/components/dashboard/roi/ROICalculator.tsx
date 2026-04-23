"use client";

import { useState } from "react";
import type { ClientConfig, ROIConfig } from "@/lib/types";
import { calculateROI } from "@/lib/roi";
import { ConversionTable } from "./ConversionTable";
import styles from "./roi.module.css";

export function ROICalculator({ client }: { client: ClientConfig }) {
  const initial = client.roi;

  const [config, setConfig] = useState<ROIConfig | null>(initial ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!config) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>ROI not configured</p>
        <p className={styles.emptyHint}>
          Add an <code>roi</code> key to{" "}
          <code>data/clients/{client.slug}.json</code> with the following shape:
        </p>
        <pre className={styles.snippet}>{JSON.stringify(
          {
            roi: {
              close_rate: 0.6,
              build_cost: 1200,
              amortise_months: 12,
              monthly_retainer: 83,
              conversion_types: [
                { name: "Table bookings", ga4_event: "generate_lead", value: 55 },
                { name: "Online orders", ga4_event: "order_click", value: 28 },
                { name: "Catering enquiries", ga4_event: "catering_enquiry", value: 380 },
              ],
            },
          },
          null,
          2
        )}</pre>
      </div>
    );
  }

  const counts: Record<string, number> = {};
  config.conversion_types.forEach((ct) => { counts[ct.ga4_event] = 0; });
  const result = calculateROI(config, counts);

  const update = (key: keyof ROIConfig, value: number) =>
    setConfig((prev) => prev ? { ...prev, [key]: value } : prev);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/clients/${client.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roi: config }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.calculator}>
      <section className={styles.inputs}>
        <h3 className={styles.sectionTitle}>Inputs</h3>
        <div className={styles.inputGrid}>
          <label className={styles.field}>
            <span>Close rate (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={Math.round(config.close_rate * 100)}
              onChange={(e) => update("close_rate", Number(e.target.value) / 100)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span>Build cost (£)</span>
            <input
              type="number"
              min={0}
              step={50}
              value={config.build_cost}
              onChange={(e) => update("build_cost", Number(e.target.value))}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span>Amortise over (months)</span>
            <input
              type="number"
              min={1}
              max={60}
              value={config.amortise_months}
              onChange={(e) => update("amortise_months", Number(e.target.value))}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span>Monthly retainer (£)</span>
            <input
              type="number"
              min={0}
              step={10}
              value={config.monthly_retainer}
              onChange={(e) => update("monthly_retainer", Number(e.target.value))}
              className={styles.input}
            />
          </label>
        </div>
      </section>

      <ConversionTable conversions={config.conversion_types} counts={counts} closeRate={config.close_rate} />

      <section className={styles.outputs}>
        <h3 className={styles.sectionTitle}>Results</h3>
        <div className={styles.outputGrid}>
          <div className={styles.outputCard}>
            <span className={styles.outputLabel}>Monthly cost</span>
            <span className={styles.outputValue}>£{Math.round(result.monthlyCost).toLocaleString()}</span>
          </div>
          <div className={styles.outputCard}>
            <span className={styles.outputLabel}>Est. revenue</span>
            <span className={styles.outputValue}>£{Math.round(result.estimatedRevenue).toLocaleString()}</span>
          </div>
          <div className={styles.outputCard}>
            <span className={styles.outputLabel}>ROI multiplier</span>
            <span className={styles.outputValue}>{result.roiMultiplier.toFixed(1)}×</span>
          </div>
          <div className={styles.outputCard}>
            <span className={styles.outputLabel}>Cost per lead</span>
            <span className={styles.outputValue}>£{Math.round(result.costPerLead).toLocaleString()}</span>
          </div>
        </div>
        <p className={`${styles.verdict} ${styles[`verdict_${result.verdictLevel}`]}`}>
          {result.verdict}
        </p>
        <p className={styles.caveat}>Revenue estimates use GA4 conversion counts × close rate × value. Counts will populate once GA4 goals are configured.</p>
      </section>

      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
        {saved ? "Saved" : saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
