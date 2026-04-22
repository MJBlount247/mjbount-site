import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Hero from "@/app/components/Hero";
import { SiteFrame } from "@/app/components/SiteFrame";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  postBySlugQuery,
  postSlugsQuery,
} from "@/sanity/schemaTypes/queries";

import styles from "../post.module.css";

type TextSpan = {
  _key: string;
  _type: "span";
  text: string;
};

type PortableBlock = {
  _key: string;
  _type: "block";
  style?: string;
  listItem?: "bullet" | "number";
  children?: TextSpan[];
};

type TextBlock = {
  _key: string;
  _type: "textBlock";
  heading?: string;
  body?: PortableBlock[];
};

type ImageBlock = {
  _key: string;
  _type: "imageBlock";
  alt?: string;
  asset?: unknown;
};

type PostPageData = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: unknown;
  category?: string;
  date?: string;
  publishedAt?: string;
  content?: Array<TextBlock | ImageBlock>;
};

type RouteParams = {
  params: Promise<{ slug: string }>;
};

function getBlockText(block: PortableBlock) {
  return block.children?.map((child) => child.text).join("") ?? "";
}

function renderPortableBlocks(blocks?: PortableBlock[]) {
  if (!blocks?.length) {
    return null;
  }

  const elements: React.ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const text = getBlockText(block);

    if (block.listItem) {
      const listType = block.listItem;
      const listItems: PortableBlock[] = [block];

      while (index + 1 < blocks.length) {
        const nextBlock = blocks[index + 1];

        if (nextBlock.listItem !== listType) {
          break;
        }

        listItems.push(nextBlock);
        index += 1;
      }

      const ListTag = listType === "number" ? "ol" : "ul";

      elements.push(
        <ListTag key={block._key}>
          {listItems.map((item) => (
            <li key={item._key}>{getBlockText(item)}</li>
          ))}
        </ListTag>,
      );
      continue;
    }

    if (!text.trim()) {
      continue;
    }

    switch (block.style) {
      case "h2":
        elements.push(<h2 key={block._key}>{text}</h2>);
        break;
      case "h3":
        elements.push(<h3 key={block._key}>{text}</h3>);
        break;
      case "h4":
        elements.push(<h4 key={block._key}>{text}</h4>);
        break;
      default:
        elements.push(<p key={block._key}>{text}</p>);
        break;
    }
  }

  return elements;
}

function formatPostDate(post: Pick<PostPageData, "date" | "publishedAt">) {
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

async function getPost(slug: string) {
  return client.fetch<PostPageData | null>(postBySlugQuery, { slug });
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(postSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description:
      post.excerpt ||
      `Read ${post.title} on the Matt Blount Web Design blog.`,
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = formatPostDate(post);

  return (
    <SiteFrame includeCta>
      <article className={styles.page}>
        <Hero
          className={styles.header}
          top={
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/blog" className="breadcrumb-link">
                Blog
              </Link>
              <span className="breadcrumb-separator">→</span>
              <span className="breadcrumb-current">{post.title}</span>
            </nav>
          }
          eyebrow={formattedDate}
          title={post.title}
          intro={post.excerpt}
          media={
            post.mainImage ? (
              <section className={styles.heroImageSection}>
                <div className={styles.heroImageWrap}>
                  <Image
                    src={urlFor(post.mainImage).width(1800).height(1000).fit("crop").url()}
                    alt={post.title}
                    width={1800}
                    height={1000}
                    className={styles.heroImage}
                  />
                </div>
              </section>
            ) : null
          }
        />

        <section className={styles.contentSection}>
          <div className={`container-narrow ${styles.contentInner}`}>
            <div className={styles.content}>
              {post.content?.map((block) => {
                if (block._type === "textBlock") {
                  return (
                    <section key={block._key} className={styles.textBlock}>
                      {block.heading ? (
                        <h2 className={styles.textBlockHeading}>{block.heading}</h2>
                      ) : null}
                      <div className={styles.textBlockBody}>
                        {renderPortableBlocks(block.body)}
                      </div>
                    </section>
                  );
                }

                if (block._type === "imageBlock" && block.asset) {
                  return (
                    <figure key={block._key} className={styles.imageBlock}>
                      <div className={styles.contentImageWrap}>
                        <Image
                          src={urlFor(block).width(1400).fit("max").url()}
                          alt={block.alt || post.title}
                          width={1400}
                          height={900}
                          className={styles.contentImage}
                        />
                      </div>
                      {block.alt ? (
                        <figcaption className={styles.imageCaption}>
                          {block.alt}
                        </figcaption>
                      ) : null}
                    </figure>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </section>
      </article>
    </SiteFrame>
  );
}
