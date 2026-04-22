import { type SchemaTypeDefinition } from 'sanity'

import { project } from './project'
import { post } from './post'
import { settings } from './settings'

import { page } from './documents/page'

import { textBlock } from './objects/textBlock'
import { imageBlock } from './objects/imageBlock'
import { projectTextBlock } from './objects/projectTextBlock'
import { projectAccordionTextBlock } from './objects/projectAccordionTextBlock'
import { seo } from './objects/seo'
import { link } from './objects/links'

import { heroBlock } from './objects/heroBlock'
import { recentProjectsBlock } from './objects/recentprojectsBlock'
import { recentPostsBlock } from './objects/recentpostsBlock'
import { twoColumnBlock } from './objects/twocolumnsBlock'
import { ctaBlock } from './objects/ctaBlock'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    project,
    post,
    settings,
    page,

    // shared objects
    seo,
    link,

    // content blocks
    textBlock,
    imageBlock,
    projectTextBlock,
    projectAccordionTextBlock,
    heroBlock,
    recentProjectsBlock,
    recentPostsBlock,
    twoColumnBlock,
    ctaBlock,
  ],
}
