import Image from "next/image";
import Link from "next/link";

import Hero from "../Hero";
import { urlFor } from "@/sanity/lib/image";

type LinkValue = {
  label?: string;
  href?: string;
  openInNewTab?: boolean;
};

type HeroBlockProps = {
  block: {
    eyebrow?: string;
    heading?: string;
    text?: string;
    primaryCta?: LinkValue;
    secondaryCta?: LinkValue;
    image?: unknown;
  };
};

function renderCta(link?: LinkValue, className?: string) {
  if (!link?.label || !link.href) {
    return null;
  }

  return (
    <Link
      href={link.href}
      className={className}
      target={link.openInNewTab ? "_blank" : undefined}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
    >
      {link.label}
    </Link>
  );
}

export default function HeroBlock({ block }: HeroBlockProps) {
  return (
    <Hero
      eyebrow={block.eyebrow}
      title={block.heading}
      titleAs="h1"
      intro={block.text}
      actions={
        <>
          {renderCta(block.primaryCta, "button-primary")}
          {renderCta(block.secondaryCta, "button-secondary")}
        </>
      }
      media={
        block.image ? (
          <Image
            src={urlFor(block.image).width(1600).height(1200).fit("crop").url()}
            alt={block.heading || "Hero image"}
            width={1600}
            height={1200}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : null
      }
    />
  );
}
