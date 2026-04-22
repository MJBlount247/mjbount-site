import {defineField, defineType} from 'sanity'

export const recentProjectsBlock = defineType({
  name: 'recentProjectsBlock',
  title: 'Recent Projects Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Recent Projects',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Intro Text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'count',
      title: 'Number of Projects',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
    defineField({
      name: 'showViewAll',
      title: 'Show View All Link',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      count: 'count',
    },
    prepare({title, count}) {
      return {
        title: title || 'Recent Projects Block',
        subtitle: `${count || 0} items`,
      }
    },
  },
})