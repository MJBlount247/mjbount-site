import Image from "next/image";
import type { ReactNode } from "react";

import { urlFor } from "@/sanity/lib/image";

import styles from "./project-body.module.css";

type Span = {
  _key: string;
  _type: "span";
  text: string;
};

type PortableBlock = {
  _key: string;
  _type: "block";
  style?: string;
  listItem?: "bullet" | "number";
  children?: Span[];
};

type LegacyImageBlock = {
  _key: string;
  _type: "image";
  asset?: unknown;
};

type ProjectImageBlock = {
  _key: string;
  _type: "imageBlock";
  asset?: unknown;
  alt?: string;
};

type ProjectTextBlock = {
  _key: string;
  _type: "projectTextBlock";
  heading?: string;
  body?: PortableBlock[];
};

type ProjectAccordionTextBlock = {
  _key: string;
  _type: "projectAccordionTextBlock";
  heading?: string;
  headingBackgroundColor?: "green" | "charcoal" | "sand" | "slate";
  body?: PortableBlock[];
  openByDefault?: boolean;
};

type BodyItem =
  | PortableBlock
  | LegacyImageBlock
  | ProjectImageBlock
  | ProjectTextBlock
  | ProjectAccordionTextBlock;

function getBlockText(block: PortableBlock) {
  return block.children?.map((child) => child.text).join("") ?? "";
}

function renderPortableBlocks(blocks: PortableBlock[]) {
  const elements: ReactNode[] = [];

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
        <ListTag key={block._key} className={styles.list}>
          {listItems.map((listItem) => (
            <li key={listItem._key} className={styles.listItem}>
              {getBlockText(listItem)}
            </li>
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
        elements.push(
          <h2 key={block._key} className={styles.headingTwo}>
            {text}
          </h2>,
        );
        break;
      case "h3":
        elements.push(
          <h3 key={block._key} className={styles.headingThree}>
            {text}
          </h3>,
        );
        break;
      case "blockquote":
        elements.push(
          <blockquote key={block._key} className={styles.blockquote}>
            {text}
          </blockquote>,
        );
        break;
      default:
        elements.push(
          <p key={block._key} className={styles.paragraph}>
            {text}
          </p>,
        );
        break;
    }
  }

  return elements;
}

function renderImage(item: LegacyImageBlock | ProjectImageBlock, fallbackAlt: string) {
  if (!item.asset) {
    return null;
  }

  const alt = item._type === "imageBlock" ? item.alt || fallbackAlt : fallbackAlt;

  return (
    <figure key={item._key} className={styles.imageWrap}>
      <Image
        src={urlFor(item).width(1600).fit("max").url()}
        alt={alt}
        width={1600}
        height={1000}
        className={styles.image}
      />
    </figure>
  );
}

export function ProjectBody({
  body,
  title,
}: {
  body?: BodyItem[];
  title: string;
}) {
  if (!body?.length) {
    return null;
  }

  const elements: ReactNode[] = [];

  for (let index = 0; index < body.length; index += 1) {
    const item = body[index];

    if (item._type === "image" || item._type === "imageBlock") {
      const image = renderImage(item, title);
      if (image) {
        elements.push(image);
      }
      continue;
    }

    if (item._type === "projectTextBlock") {
      const bodyContent = item.body?.length ? renderPortableBlocks(item.body) : [];

      if (!item.heading && !bodyContent.length) {
        continue;
      }

      elements.push(
        <section key={item._key} className={styles.textSection}>
          {item.heading ? <h2 className={styles.sectionHeading}>{item.heading}</h2> : null}
          {bodyContent.length ? <div className={styles.sectionBody}>{bodyContent}</div> : null}
        </section>,
      );
      continue;
    }

    if (item._type === "projectAccordionTextBlock") {
      const bodyContent = item.body?.length ? renderPortableBlocks(item.body) : [];

      if (!item.heading && !bodyContent.length) {
        continue;
      }

      elements.push(
        <details
          key={item._key}
          className={styles.accordion}
          data-colour={item.headingBackgroundColor || "green"}
          open={item.openByDefault}
        >
          <summary className={styles.accordionSummary}>
            <span className={styles.accordionHeading}>{item.heading || "More details"}</span>
            <span className={styles.accordionArrow} aria-hidden="true" />
          </summary>

          {bodyContent.length ? <div className={styles.accordionBody}>{bodyContent}</div> : null}
        </details>,
      );
      continue;
    }

    if (item._type === "block") {
      const legacyBlocks: PortableBlock[] = [item];

      while (index + 1 < body.length && body[index + 1]._type === "block") {
        legacyBlocks.push(body[index + 1] as PortableBlock);
        index += 1;
      }

      const renderedBlocks = renderPortableBlocks(legacyBlocks);
      elements.push(...renderedBlocks);
    }
  }

  if (!elements.length) {
    return null;
  }

  return <div className={styles.content}>{elements}</div>;
}
