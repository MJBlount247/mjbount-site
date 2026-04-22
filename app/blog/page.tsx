import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import Hero from "@/app/components/Hero";
import { SiteFrame } from "@/app/components/SiteFrame";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { postsArchiveQuery } from "@/sanity/schemaTypes/queries";

import styles from "./blog.module.css";

type ArchivePost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: unknown;
  category?: string;
  date?: string;
  publishedAt?: string;
};

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts, tutorials, and notes on web design, development, and building better websites.",
};

function formatPostDate(post: ArchivePost) {
  const value = post.date ?? post.publishedAt;

  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogArchivePage() {
  const posts: ArchivePost[] = await client.fetch(postsArchiveQuery);

  return (
    <SiteFrame includeCta>
      <div className={styles.page}>
        <Hero
          className={styles.hero}
          title="Blog"
          intro="Writing about websites, design decisions, development process, and the practical details that shape better digital work."
        />

        <section className={`container ${styles.gridSection}`}>
          {posts.length ? (
            <div className={styles.grid}>
              {posts.map((post) => {
                const formattedDate = formatPostDate(post);

                return (
                  <article key={post._id} className={styles.card}>
                    <Link href={`/blog/${post.slug}`} className={styles.imageLink}>
                      {post.mainImage ? (
                        <Image
                          src={urlFor(post.mainImage).width(1200).height(800).fit("crop").url()}
                          alt={post.title}
                          width={1200}
                          height={800}
                          className={styles.image}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          Post image coming soon
                        </div>
                      )}
                    </Link>

                    <div className={styles.content}>
                      <div className={styles.metaRow}>
                        {post.category ? (
                          <span className={styles.tag}>{post.category}</span>
                        ) : null}
                        {formattedDate ? (
                          <span className={styles.date}>{formattedDate}</span>
                        ) : null}
                      </div>

                      <h2 className={styles.postTitle}>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      {post.excerpt ? (
                        <p className={styles.excerpt}>{post.excerpt}</p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              Blog posts will appear here once they&apos;re added in Sanity.
            </div>
          )}
        </section>
      </div>
    </SiteFrame>
  );
}
