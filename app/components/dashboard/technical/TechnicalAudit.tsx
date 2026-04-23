import type { ClientConfig } from "@/lib/types";
import styles from "./technical.module.css";

export function TechnicalAudit({ client }: { client: ClientConfig }) {
  return (
    <div className={styles.stub}>
      <p className={styles.stubTitle}>Technical audit</p>
      <p className={styles.stubHint}>
        Run a crawl via the API route to populate broken links, missing meta
        descriptions, redirect chains, and mobile viewport checks for{" "}
        <strong>{client.domain}</strong>.
      </p>
      <p className={styles.stubHint}>
        Results will be cached to{" "}
        <code>data/cache/{client.slug}-technical.json</code>.
      </p>
    </div>
  );
}
