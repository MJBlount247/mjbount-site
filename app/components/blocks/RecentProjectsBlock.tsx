import Link from "next/link";

import { ProjectCard } from "@/app/components/ProjectCard";
import { client } from "@/sanity/lib/client";

import styles from "./blocks.module.css";

type RecentProjectsBlockProps = {
  block: {
    heading?: string;
    text?: string;
    count?: number;
    showViewAll?: boolean;
  };
};

type Project = {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  description?: string;
  mainImage?: unknown;
  tags?: string[];
};

const recentProjectsByCountQuery = `
  *[_type == "project" && defined(slug.current)] | order(completedAt desc)[0...$count]{
    _id,
    title,
    "slug": slug.current,
    client,
    description,
    mainImage,
    tags
  }
`;

export default async function RecentProjectsBlock({
  block,
}: RecentProjectsBlockProps) {
  const count = block.count ?? 3;
  const projects = await client.fetch<Project[]>(recentProjectsByCountQuery, {
    count,
  });

  return (
    <section className={`container-narrow ${styles.section}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>{block.heading || "Recent Projects"}</h2>
        {block.text ? <p className={styles.intro}>{block.text}</p> : null}
        {block.showViewAll ? (
          <div className={styles.actions}>
            <Link href="/projects" className="button-secondary">
              View all projects
            </Link>
          </div>
        ) : null}
      </div>

      {projects.length ? (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No projects available yet.</div>
      )}
    </section>
  );
}
