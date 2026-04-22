import Image from "next/image";
import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

import styles from "./blocks.module.css";

type RecentPostsBlockProps = {
  block: {
    heading?: string;
    text?: string;
    count?: number;
    categoryFilter?: string;
  };
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: unknown;
  category?: string;
  date?: string;
  publishedAt?: string;
};

const recentPostsByConfigQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    ($category == "all" || category == $category)
  ] | order(date desc, publishedAt desc)[0...$count]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    category,
    date,
    publishedAt
  }
`;

function formatPostDate(post: Post) {
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

export default async function RecentPostsBlock({
  block,
}: RecentPostsBlockProps) {
  const count = block.count ?? 3;
  const category = block.categoryFilter ?? "all";

  const posts = await client.fetch<Post[]>(recentPostsByConfigQuery, {
    count,
    category,
  });

  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>{block.heading || "Recent Posts"}</h2>
        {block.text ? <p className={styles.intro}>{block.text}</p> : null}
      </div>

      {posts.length ? (
        <div className={styles.postsGrid}>
          {posts.map((post) => {
            const formattedDate = formatPostDate(post);

            return (
              <article key={post._id} className={styles.postCard}>
                <Link href={`/blog/${post.slug}`} className={styles.postImageLink}>
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).width(1200).height(800).fit("crop").url()}
                      alt={post.title}
                      width={1200}
                      height={800}
                      className={styles.postImage}
                    />
                  ) : (
                    <div className={styles.postImagePlaceholder}>
                      Post image coming soon
                    </div>
                  )}
                </Link>

                <div className={styles.postContent}>
                  <div className={styles.metaRow}>
                    {post.category ? (
                      <span className={styles.tag}>{post.category}</span>
                    ) : null}
                    {formattedDate ? (
                      <span className={styles.date}>{formattedDate}</span>
                    ) : null}
                  </div>

                  <h3 className={styles.postTitle}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {post.excerpt ? (
                    <p className={styles.excerpt}>{post.excerpt}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>No posts available yet.</div>
      )}
    </section>
  );
}
