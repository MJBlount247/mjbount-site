import {defineField, defineType} from 'sanity'

export const twoColumnBlock = defineType({
  name: 'twoColumnBlock',
  title: 'Two Column Block',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Text + Image', value: 'textImage'},
          {title: 'Image + Image', value: 'imageImage'},
          {title: 'Text + Text', value: 'textText'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leftHeading',
      title: 'Left Heading',
      type: 'string',
      hidden: ({parent}) => parent?.layout === 'imageImage',
    }),
    defineField({
      name: 'leftText',
      title: 'Left Text',
      type: 'array',
      of: [{type: 'block'}],
      hidden: ({parent}) => parent?.layout === 'imageImage',
    }),
    defineField({
      name: 'leftImage',
      title: 'Left Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.layout === 'textText',
    }),
    defineField({
      name: 'rightHeading',
      title: 'Right Heading',
      type: 'string',
      hidden: ({parent}) => parent?.layout === 'imageImage',
    }),
    defineField({
      name: 'rightText',
      title: 'Right Text',
      type: 'array',
      of: [{type: 'block'}],
      hidden: ({parent}) => parent?.layout !== 'textText',
    }),
    defineField({
      name: 'rightImage',
      title: 'Right Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.layout === 'textText',
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
      layout: 'layout',
      title: 'leftHeading',
    },
    prepare({layout, title}) {
      return {
        title: title || 'Two Column Block',
        subtitle: layout || 'No layout selected',
      }
    },
  },
})