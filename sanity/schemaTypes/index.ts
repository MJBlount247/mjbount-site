import { type SchemaTypeDefinition } from 'sanity'
import { project } from './project'
import { post } from './post'
import { settings } from './settings'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, post, settings],
}