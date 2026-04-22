import {defineArrayMember, defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          {title: 'Homepage', value: 'home'},
          {title: 'Standard Page', value: 'standard'},
           {title: 'Custom Template', value: 'template' },
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroBlock'}),
        defineArrayMember({type: 'recentProjectsBlock'}),
        defineArrayMember({type: 'recentPostsBlock'}),
        defineArrayMember({type: 'twoColumnBlock'}),
        defineArrayMember({type: 'ctaBlock'}),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageType',
    },
  },
})