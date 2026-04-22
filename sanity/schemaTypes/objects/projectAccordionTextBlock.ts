import { defineField, defineType } from 'sanity'

const colourOptions = [
  { title: 'Green', value: 'green' },
  { title: 'Charcoal', value: 'charcoal' },
  { title: 'Sand', value: 'sand' },
  { title: 'Slate', value: 'slate' },
]

export const projectAccordionTextBlock = defineType({
  name: 'projectAccordionTextBlock',
  title: 'Project Accordion Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingBackgroundColor',
      title: 'Heading Background Colour',
      type: 'string',
      initialValue: 'green',
      options: {
        list: colourOptions,
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'openByDefault',
      title: 'Open By Default',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      colour: 'headingBackgroundColor',
    },
    prepare({ title, colour }) {
      const selectedColour =
        colourOptions.find((option) => option.value === colour)?.title || 'Green'

      return {
        title: title || 'Project Accordion Text Block',
        subtitle: selectedColour,
      }
    },
  },
})
