import Image from "next/image";
import Link from "next/link";

import type { ClientConfig } from "@/lib/types";
import { formatNumber, trendLabel } from "@/lib/analytics";

import styles from "./client-card.module.css";

type ClientCardProps = {
  client: ClientConfig;
  sessions: number;
  trend: number;
};

export function ClientCard({ client, sessions, trend }: ClientCardProps) {
  const href = `/dashboard/${client.slug}`;
  const trendUp = trend >= 0;

  return (
    <Link href={href} className={styles.card}>
      <div className={styles.logoWrap} style={{ background: client.brand.primary }}>
        <Image
          src={client.logo.darkFull}
          alt={client.name}
          width={180}
          height={60}
          className={styles.logo}
        />
      </div>
      <div className={styles.body}>
        <div>
          <p className={styles.name}>{client.name}</p>
          <p className={styles.tagline}>{client.tagline}</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatNumber(sessions)}</span>
            <span className={styles.statLabel}>sessions / 30d</span>
          </div>
          <span className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
            {trendUp ? "↑" : "↓"} {trendLabel(trend)} vs prev
          </span>
        </div>
      </div>
    </Link>
  );
}
