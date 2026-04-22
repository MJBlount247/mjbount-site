import Link from "next/link";

import styles from "./blocks.module.css";

type LinkValue = {
  label?: string;
  href?: string;
  openInNewTab?: boolean;
};

type CtaBlockProps = {
  block: {
    heading?: string;
    text?: string;
    cta?: LinkValue;
    theme?: "light" | "dark" | "accent";
  };
};

export default function CtaBlock({ block }: CtaBlockProps) {
  const themeClass =
    block.theme === "light"
      ? styles.ctaLight
      : block.theme === "accent"
        ? styles.ctaAccent
        : styles.ctaDark;

  return (
    <section className={`container ${styles.cta}`}>
      <div className={`${styles.ctaInner} ${themeClass}`}>
        {block.heading ? <h2 className={styles.heading}>{block.heading}</h2> : null}
        {block.text ? <p className={styles.intro}>{block.text}</p> : null}
        {block.cta?.label && block.cta?.href ? (
          <div className={styles.actions}>
            <Link
              href={block.cta.href}
              className={block.theme === "accent" ? "button-secondary" : "button-primary"}
              target={block.cta.openInNewTab ? "_blank" : undefined}
              rel={block.cta.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {block.cta.label}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
