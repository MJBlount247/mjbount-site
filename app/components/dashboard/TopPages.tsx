import type { TopPage } from "@/lib/types";
import { formatDuration, formatNumber, topPagesWithPercent } from "@/lib/analytics";

import styles from "./top-pages.module.css";

type TopPagesProps = {
  pages: TopPage[];
  totalPageviews: number;
};

export function TopPages({ pages, totalPageviews }: TopPagesProps) {
  const withPct = topPagesWithPercent(pages, totalPageviews);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Top pages</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Page</th>
            <th className={`${styles.th} ${styles.right}`}>Views</th>
            <th className={`${styles.th} ${styles.right}`}>Share</th>
            <th className={`${styles.th} ${styles.right}`}>Avg time</th>
          </tr>
        </thead>
        <tbody>
          {withPct.map((page, i) => (
            <tr key={i} className={styles.row}>
              <td className={styles.td}>
                <span className={styles.pagePath}>{page.path}</span>
                <span className={styles.pageTitle}>{page.title}</span>
              </td>
              <td className={`${styles.td} ${styles.right} ${styles.mono}`}>
                {formatNumber(page.pageviews)}
              </td>
              <td className={`${styles.td} ${styles.right}`}>
                <div className={styles.pctWrap}>
                  <div className={styles.pctBar} style={{ width: `${page.percent}%` }} />
                  <span className={styles.pctLabel}>{page.percent}%</span>
                </div>
              </td>
              <td className={`${styles.td} ${styles.right} ${styles.mono}`}>
                {formatDuration(page.avgDurationSeconds)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
