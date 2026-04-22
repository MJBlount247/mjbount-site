import Link from "next/link";

import Hero from "@/app/components/Hero";
import { ProjectCard } from "@/app/components/ProjectCard";
import { SiteCta, SiteFooter, SiteHeader } from "@/app/components/SiteFrame";
import { client } from "@/sanity/lib/client";
import { homeProjectsQuery } from "@/sanity/schemaTypes/queries";

import styles from "./page.module.css";

type Project = {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  description?: string;
  mainImage?: unknown;
  tags?: string[];
};

export default async function Home() {
  const projects: Project[] = await client.fetch(homeProjectsQuery);

  return (
    <main className={styles.page}>
      <SiteHeader />

      <Hero
        className={styles.section}
        eyebrow="Web Designer & Developer · Cambridge, UK"
        title={
          <>
            Websites that help
            <br />
            <span className={styles.heroTitleMuted}>small businesses grow</span>
          </>
        }
        intro="I design and build fast, professional websites focused on clean design, strong performance, and real results for your business."
        actions={
          <>
            <Link href="/contact" className="button-primary">
              Start a project
            </Link>

            <Link href="/projects" className={styles.textLink}>
              See my work
            </Link>
          </>
        }
      />

      <section className={`container-narrow ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Recent work</p>

          <Link href="/projects" className={styles.textLink}>
            All projects →
          </Link>
        </div>

        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>

      <SiteCta />
      <SiteFooter />
    </main>
  );
}
