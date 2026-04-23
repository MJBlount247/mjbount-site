import type { ConversionType } from "@/lib/types";
import styles from "./roi.module.css";

interface ConversionTableProps {
  conversions: ConversionType[];
  counts: Record<string, number>;
  closeRate: number;
}

export function ConversionTable({ conversions, counts, closeRate }: ConversionTableProps) {
  return (
    <section>
      <h3 className={styles.sectionTitle}>Conversions</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Type</th>
            <th className={`${styles.th} ${styles.right}`}>GA4 event</th>
            <th className={`${styles.th} ${styles.right}`}>Count</th>
            <th className={`${styles.th} ${styles.right}`}>Value (£)</th>
            <th className={`${styles.th} ${styles.right}`}>Est. revenue</th>
          </tr>
        </thead>
        <tbody>
          {conversions.map((ct, i) => {
            const count = counts[ct.ga4_event] ?? 0;
            const revenue = count * closeRate * ct.value;
            return (
              <tr key={i} className={styles.row}>
                <td className={styles.td}>{ct.name}</td>
                <td className={`${styles.td} ${styles.right} ${styles.mono}`}>{ct.ga4_event}</td>
                <td className={`${styles.td} ${styles.right}`}>{count}</td>
                <td className={`${styles.td} ${styles.right}`}>£{ct.value}</td>
                <td className={`${styles.td} ${styles.right}`}>£{Math.round(revenue).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
