import { defineField, defineType } from 'sanity'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image Block',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Short description for accessibility and screen readers.',
    }),
  ],
})
