import type { ClientConfig } from "@/lib/types";
import styles from "./strategic.module.css";

export function StrategicAudit({ client }: { client: ClientConfig }) {
  return (
    <div className={styles.stub}>
      <p className={styles.stubTitle}>Strategic audit</p>
      <p className={styles.stubHint}>
        Trigger an on-demand crawl to let Claude analyse{" "}
        <strong>{client.domain}</strong> for conversion quality, brand
        messaging, competitive positioning, and content gaps.
      </p>
      <p className={styles.stubHint}>
        Results cached to{" "}
        <code>data/cache/{client.slug}-strategic.json</code> with a timestamp.
        Sections are scored 0–100 with top 3 recommended actions.
      </p>
    </div>
  );
}
