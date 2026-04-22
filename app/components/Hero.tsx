import type { ElementType, ReactNode } from "react";

import styles from "./hero.module.css";

type HeroProps = {
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  mediaClassName?: string;
  top?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  titleAs?: ElementType;
  afterTitle?: ReactNode;
  intro?: ReactNode;
  afterIntro?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
};

export default function Hero({
  className,
  containerClassName = "container",
  contentClassName,
  mediaClassName,
  top,
  eyebrow,
  title,
  titleAs: TitleTag = "h1",
  afterTitle,
  intro,
  afterIntro,
  actions,
  media,
}: HeroProps) {
  const sectionClassName = [styles.hero, className].filter(Boolean).join(" ");
  const innerClassName = [
    styles.inner,
    containerClassName,
    media ? styles.split : "",
  ]
    .filter(Boolean)
    .join(" ");
  const contentClasses = [styles.content, contentClassName]
    .filter(Boolean)
    .join(" ");
  const mediaClasses = [styles.media, mediaClassName].filter(Boolean).join(" ");

  return (
    <section className={sectionClassName}>
      <div className={innerClassName}>
        <div className={contentClasses}>
          {top}
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          {title ? <TitleTag className={styles.title}>{title}</TitleTag> : null}
          {afterTitle}
          {intro ? <p className={styles.intro}>{intro}</p> : null}
          {afterIntro}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>

        {media ? <div className={mediaClasses}>{media}</div> : null}
      </div>
    </section>
  );
}
