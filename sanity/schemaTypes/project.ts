import { defineArrayMember, defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Design', value: 'design' },
          { title: 'Development', value: 'development' },
          { title: 'E-Commerce', value: 'ecommerce' },
          { title: 'WordPress', value: 'wordpress' },
          { title: 'Next.js', value: 'nextjs' },
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Project Content',
      type: 'array',
      of: [
        defineArrayMember({ type: 'projectTextBlock' }),
        defineArrayMember({ type: 'projectAccordionTextBlock' }),
        defineArrayMember({ type: 'imageBlock' }),
        defineArrayMember({ type: 'block' }),
        defineArrayMember({ type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'projectUrl',
      title: 'Live Site Link',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Link Text',
          type: 'string',
          description: 'The text shown on the site, for example "Acme Studio".',
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'completedAt',
      title: 'Completion Date',
      type: 'date',
    }),
  ],
})
