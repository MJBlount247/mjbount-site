import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";

import styles from "./project-card.module.css";

type ProjectCardProps = {
  project: {
    _id: string;
    title: string;
    slug: string;
    client?: string;
    description?: string;
    mainImage?: unknown;
    tags?: string[];
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <div>
          <h2 className={styles.title}>
            <Link href={href}>{project.title}</Link>
          </h2>

          {project.client || project.description ? (
            <p className={styles.meta}>{project.description}</p>
          ) : null}

         
        </div>

        <Link href={href} className="button-secondary">
          View project →
        </Link>
      </div>

      <Link href={href} className={styles.imageLink}>
        {project.mainImage ? (
          <Image
            src={urlFor(project.mainImage).width(1200).height(800).fit("crop").url()}
            alt={project.title}
            width={1200}
            height={800}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder}>Project preview coming soon</div>
        )}
      </Link>
    </article>
  );
}
