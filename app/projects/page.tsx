import type { Metadata } from "next";

import Hero from "@/app/components/Hero";
import { ProjectCard } from "@/app/components/ProjectCard";
import { SiteFrame } from "@/app/components/SiteFrame";
import { client } from "@/sanity/lib/client";
import { projectsArchiveQuery } from "@/sanity/schemaTypes/queries";

import styles from "./projects.module.css";

type ArchiveProject = {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  description?: string;
  mainImage?: unknown;
  tags?: string[];
  completedAt?: string;
  projectUrl?: string;
};

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of website design and development projects by Matt Blount Web Design.",
};

export default async function ProjectsPage() {
  const projects: ArchiveProject[] = await client.fetch(projectsArchiveQuery);

  return (
    <SiteFrame includeCta>
      <div className={styles.page}>
        <Hero
          className={styles.hero}
          title="Work"
          intro="A growing archive of projects spanning strategy, design, and front-end development. Each one is focused on clarity, speed, and making the business behind it look sharp online."
        />

        <section className={`container ${styles.gridSection}`}>
          {projects.length ? (
            <div className={styles.grid}>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              Projects will appear here once they&apos;re added in Sanity.
            </div>
          )}
        </section>
      </div>
    </SiteFrame>
  );
}
