import Image from "next/image";
import Link from "next/link";

import styles from "./site-frame.module.css";

export function SiteHeader() {
  return (
    <nav className={styles.nav}>
      <Link
        href="/"
        aria-label="Matt Blount Web Design home"
        className={styles.brand}
      >
        <Image
          src="/logo.svg"
          alt="Matt Blount Web Design"
          width={40}
          height={38}
        />
      </Link>

      <div className={styles.navLinks}>
        <Link href="/projects" className={styles.navLink}>
          Work
        </Link>
        <Link href="/about" className={styles.navLink}>
          About
        </Link>
        <Link href="/blog" className={styles.navLink}>
          Blog
        </Link>
      </div>

      <Link href="/contact" className="button-nav">
        Start a project
      </Link>
    </nav>
  );
}

export function SiteCta() {
  return (
    <section className={styles.ctaSection}>
      <h2 className={styles.ctaTitle}>Ready to build something?</h2>

      <p className={styles.ctaText}>
        Let&apos;s talk about your project. No obligation, just a conversation.
      </p>

      <Link href="/contact" className="button-primary">
        Book a free call
      </Link>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>&copy; 2026 Matt Blount Web Design · Cambridge, UK</span>

      <div className={styles.footerLinks}>
        <a
          href="https://instagram.com/mattblount.webdesign"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          Instagram
        </a>
        <a
          href="https://linkedin.com/in/matt-blount-19124b119"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}

export function SiteFrame({
  children,
  includeCta = false,
}: Readonly<{
  children: React.ReactNode;
  includeCta?: boolean;
}>) {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <main className={styles.main}>{children}</main>
      {includeCta ? <SiteCta /> : null}
      <SiteFooter />
    </div>
  );
}
