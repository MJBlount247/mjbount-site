import { client } from '@/sanity/lib/client';
import { customTemplateQuery } from '@/sanity/schemaTypes/queries';
import HeroBlock from '../components/blocks/HeroBlock'
import RecentProjectsBlock from '../components/blocks/RecentProjectsBlock'
import RecentPostsBlock from '../components/blocks/RecentPostsBlock'
import TwoColumnBlock from '../components/blocks/twocolumnBlock'
import CtaBlock from '../components/blocks/CtaBlock'

type TemplateBlock = {
  _key: string
  _type: string
  eyebrow?: string
  heading?: string
  text?: string
  count?: number
  showViewAll?: boolean
  categoryFilter?: string
  theme?: 'light' | 'dark' | 'accent'
  primaryCta?: {
    label?: string
    href?: string
    openInNewTab?: boolean
  }
  secondaryCta?: {
    label?: string
    href?: string
    openInNewTab?: boolean
  }
  cta?: {
    label?: string
    href?: string
    openInNewTab?: boolean
  }
  image?: unknown
  layout?: 'textImage' | 'imageImage' | 'textText'
  leftHeading?: string
  leftText?: Array<{
    children?: Array<{
      text?: string
    }>
  }>
  leftImage?: {
  asset?: {
    _ref?: string
  }
  alt?: string
}
  rightHeading?: string
  rightText?: Array<{
    children?: Array<{
      text?: string
    }>
  }>
  rightImage?: {
  asset?: {
    _ref?: string
  }
  alt?: string
}
}

type TemplatePageData = {
  pageBuilder?: TemplateBlock[]
}

export default async function TemplatePage() {
  const page = await client.fetch<TemplatePageData>(customTemplateQuery);

  return (
     <main>
      {page.pageBuilder?.map((block) => {
        switch (block._type) {
          case 'heroBlock':
            return <HeroBlock key={block._key} block={block} />
          case 'recentProjectsBlock':
            return <RecentProjectsBlock key={block._key} block={block} />
          case 'recentPostsBlock':
            return <RecentPostsBlock key={block._key} block={block} />
          case 'twoColumnBlock':
            return <TwoColumnBlock key={block._key} block={block} />
          case 'ctaBlock':
            return <CtaBlock key={block._key} block={block} />
          default:
            return <div key={block._key}>{block._type}</div>
        }
      })}
    </main>
  );
}
