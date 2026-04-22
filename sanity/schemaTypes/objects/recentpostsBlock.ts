import {defineField, defineType} from 'sanity'

export const recentPostsBlock = defineType({
  name: 'recentPostsBlock',
  title: 'Recent Posts Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Recent Posts',
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
      title: 'Number of Posts',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
    defineField({
      name: 'categoryFilter',
      title: 'Category Filter',
      type: 'string',
      options: {
        list: [
          {title: 'All', value: 'all'},
          {title: 'Tutorial', value: 'tutorial'},
          {title: 'Opinion', value: 'opinion'},
          {title: 'News', value: 'news'},
          {title: 'Tools & Resources', value: 'tools'},
        ],
      },
      initialValue: 'all',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      count: 'count',
      filter: 'categoryFilter',
    },
    prepare({title, count, filter}) {
      return {
        title: title || 'Recent Posts Block',
        subtitle: `${count || 0} items • ${filter || 'all'}`,
      }
    },
  },
})