import type { ClientConfig } from "@/lib/types";
import styles from "./seo.module.css";

export function SEOAudit({ client }: { client: ClientConfig }) {
  return (
    <div className={styles.stub}>
      <p className={styles.stubTitle}>SEO / AEO audit</p>
      <p className={styles.stubHint}>
        Connect Google Search Console to surface impressions, clicks, average
        position, and crawl errors for <strong>{client.domain}</strong>.
      </p>
      <p className={styles.stubHint}>
        Claude will also assess AEO readiness — structured answers, FAQ schema,
        and entity clarity — for AI search visibility.
      </p>
    </div>
  );
}
