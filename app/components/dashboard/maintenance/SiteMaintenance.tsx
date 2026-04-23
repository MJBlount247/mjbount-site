import type { ClientConfig, Plugin } from "@/lib/types";
import styles from "./maintenance.module.css";

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function PluginRow({ plugin }: { plugin: Plugin }) {
  const statusMap = {
    up_to_date:      { label: "Up to date",     cls: styles.statusGood },
    update_available:{ label: "Update available", cls: styles.statusWarning },
    critical_update: { label: "Critical update", cls: styles.statusIssue },
  };
  const { label, cls } = statusMap[plugin.status];
  return (
    <tr className={styles.row}>
      <td className={styles.td}>{plugin.name}</td>
      <td className={styles.tdRight}>
        <span className={`${styles.pill} ${cls}`}>{label}</span>
      </td>
    </tr>
  );
}

export function SiteMaintenance({ client }: { client: ClientConfig }) {
  const m = client.maintenance;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Site maintenance</h2>

      {!m ? (
        <p className={styles.empty}>
          Add a <code>maintenance</code> key to{" "}
          <code>data/clients/{client.slug}.json</code> to track WordPress, PHP,
          SSL and plugin status here.
        </p>
      ) : (
        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.cardLabel}>WordPress</span>
            <span className={styles.cardValue}>{m.wordpress_version}</span>
          </div>
          <div className={styles.card}>
            <span className={styles.cardLabel}>PHP</span>
            <span className={`${styles.cardValue} ${m.php_version === m.php_target ? styles.textGood : styles.textWarning}`}>
              {m.php_version}
              {m.php_version !== m.php_target && (
                <span className={styles.cardHint}> → {m.php_target}</span>
              )}
            </span>
          </div>
          <div className={styles.card}>
            <span className={styles.cardLabel}>SSL expiry</span>
            {(() => {
              const days = daysUntil(m.ssl_expiry);
              const cls = days > 30 ? styles.textGood : days > 7 ? styles.textWarning : styles.textIssue;
              return (
                <span className={`${styles.cardValue} ${cls}`}>
                  {m.ssl_expiry}
                  <span className={styles.cardHint}> ({days}d)</span>
                </span>
              );
            })()}
          </div>

          <div className={`${styles.card} ${styles.plugins}`}>
            <span className={styles.cardLabel}>Plugins</span>
            <table className={styles.pluginTable}>
              <tbody>
                {m.plugins.map((p, i) => <PluginRow key={i} plugin={p} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
