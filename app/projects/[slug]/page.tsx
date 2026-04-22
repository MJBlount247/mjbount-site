import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Hero from "@/app/components/Hero";
import { ProjectBody } from "@/app/components/ProjectBody";
import { SiteFrame } from "@/app/components/SiteFrame";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  projectBySlugQuery,
  projectSlugsQuery,
} from "@/sanity/schemaTypes/queries";

import styles from "../projects.module.css";

type ProjectPageData = {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  description?: string;
  mainImage?: unknown;
  tags?: string[];
  body?: Array<
    | {
        _key: string;
        _type: "block";
        style?: string;
        listItem?: "bullet" | "number";
        children?: Array<{
          _key: string;
          _type: "span";
          text: string;
        }>;
      }
    | {
        _key: string;
        _type: "image";
        asset?: unknown;
      }
    | {
        _key: string;
        _type: "imageBlock";
        asset?: unknown;
        alt?: string;
      }
    | {
        _key: string;
        _type: "projectTextBlock";
        heading?: string;
        body?: Array<{
          _key: string;
          _type: "block";
          style?: string;
          listItem?: "bullet" | "number";
          children?: Array<{
            _key: string;
            _type: "span";
            text: string;
          }>;
        }>;
      }
    | {
        _key: string;
        _type: "projectAccordionTextBlock";
        heading?: string;
        headingBackgroundColor?: "green" | "charcoal" | "sand" | "slate";
        openByDefault?: boolean;
        body?: Array<{
          _key: string;
          _type: "block";
          style?: string;
          listItem?: "bullet" | "number";
          children?: Array<{
            _key: string;
            _type: "span";
            text: string;
          }>;
        }>;
      }
  >;
  projectUrl?: {
    label?: string;
    url?: string;
  };
  completedAt?: string;
};

type RouteParams = {
  params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
  return client.fetch<ProjectPageData | null>(projectBySlugQuery, { slug });
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(projectSlugsQuery);

  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description:
      project.description ||
      `Case study for ${project.title} by Matt Blount Web Design.`,
  };
}

export default async function ProjectPage({ params }: RouteParams) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <SiteFrame includeCta>
      <div className={styles.page}>
        <Hero
          className={styles.projectHero}
          top={
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/projects" className="breadcrumb-link">
                Projects
              </Link>

              <span className="breadcrumb-separator">→</span>

              <span className="breadcrumb-current">{project.title}</span>
            </nav>
          }
          title={project.title}
          afterTitle={
            project.tags?.length ? (
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null
          }
          intro={project.description}
          afterIntro={
            <div className={styles.heroSiteLink}>
              <p className={styles.metaValue}>
                {project.projectUrl?.url ? (
                  <a
                    href={project.projectUrl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.metaLink}
                  >
                    {project.projectUrl.label || project.client || project.title}
                    <span className="breadcrumb-separator"> →</span>
                  </a>
                ) : (
                  "Private launch"
                )}
              </p>
            </div>
          }
          media={
            <div className={styles.heroImageSection}>
              <div className={styles.heroImageWrap}>
                {project.mainImage ? (
                  <Image
                    src={urlFor(project.mainImage).width(1800).height(1125).fit("crop").url()}
                    alt={project.title}
                    width={1800}
                    height={1125}
                    className={styles.heroImage}
                  />
                ) : (
                  <div className={styles.heroImagePlaceholder}>
                    Project imagery coming soon
                  </div>
                )}
              </div>
            </div>
          }
        />

        <section className={`container-narrow ${styles.contentSection}`}>
          <ProjectBody body={project.body} title={project.title} />
        </section>
      </div>
    </SiteFrame>
  );
}
