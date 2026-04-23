import { getAllClients } from "@/lib/getClient";
import { getAnalytics } from "@/lib/ga4";
import { ClientCard } from "@/app/components/ClientCard";

import styles from "./clients.module.css";

export default async function DashboardIndex() {
  const clients = getAllClients();

  const clientsWithData = await Promise.all(
    clients.map(async (client) => {
      const analytics = await getAnalytics(client);
      return { client, analytics };
    })
  );

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Client dashboard</h1>
          <p className={styles.subtitle}>
            MJBlount Web Design · {clients.length} active client{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {clientsWithData.map(({ client, analytics }) => (
            <ClientCard
              key={client.slug}
              client={client}
              sessions={analytics.summary.sessions}
              trend={analytics.summary.trend}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
