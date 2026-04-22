import Image from 'next/image'

import { urlFor } from '@/sanity/lib/image'

import styles from './twocolumnBlock.module.css'

type TextChild = {
  text?: string
}

type TextBlock = {
  children?: TextChild[]
}

type ImageValue = {
  asset?: unknown
}

type TwoColumnBlockProps = {
  block: {
    layout?: 'textImage' | 'imageImage' | 'textText'
    leftHeading?: string
    leftText?: TextBlock[]
    leftImage?: ImageValue
    rightHeading?: string
    rightText?: TextBlock[]
    rightImage?: ImageValue
    theme?: 'light' | 'dark'
  }
}

function getParagraphText(blocks?: TextBlock[]) {
  return blocks?.map((block) => block.children?.map((child) => child.text ?? '').join('')).join(' ') ?? ''
}

function renderImage(image?: ImageValue, alt?: string) {
  if (!image?.asset) {
    return null
  }

  return (
    <div className={styles.imageWrap}>
      <Image
        src={urlFor(image).width(1200).height(900).fit('crop').url()}
        alt={alt || 'Two column block image'}
        width={1200}
        height={900}
        className={styles.image}
      />
    </div>
  )
}

export default function TwoColumnBlock({ block }: TwoColumnBlockProps) {
  const leftText = getParagraphText(block.leftText)
  const rightText = getParagraphText(block.rightText)
  const sectionClassName = `${styles.section} ${block.theme === 'dark' ? styles.dark : styles.light}`

  return (
    <section className={sectionClassName}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.column}>
          {block.leftImage ? renderImage(block.leftImage, block.leftHeading || block.rightHeading) : null}
          {block.leftHeading ? <h3 className={styles.heading}>{block.leftHeading}</h3> : null}
          {leftText ? <p className={styles.text}>{leftText}</p> : null}
        </div>

        <div className={styles.column}>
          {block.rightImage ? renderImage(block.rightImage, block.rightHeading || block.leftHeading) : null}
          {block.rightHeading ? <h3 className={styles.heading}>{block.rightHeading}</h3> : null}
          {rightText ? <p className={styles.text}>{rightText}</p> : null}
        </div>
      </div>
    </section>
  )
}
