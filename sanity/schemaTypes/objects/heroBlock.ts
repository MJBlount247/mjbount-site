import {defineField, defineType} from 'sanity'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero Block',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'link',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'link',
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
        ],
      },
      initialValue: 'light',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'eyebrow',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Hero Block',
        subtitle,
        media,
      }
    },
  },
})