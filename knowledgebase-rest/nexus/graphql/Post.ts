// api/graphql/Post.ts
import { objectType, extendType } from 'nexus'

export const Post = objectType({
  name: 'Post',            // <- Name of your type
  definition(t) {
    t.int('id')            // <- Field named `id` of type `Int`
    t.string('title')      // <- Field named `title` of type `String`
    t.string('body')       // <- Field named `body` of type `String`
    t.boolean('published') // <- Field named `published` of type `Boolean`
  },
})

export const PostQuery = extendType({
    type: 'Query',
    definition(t) {
      t.nonNull.list.field('drafts', {
        type: 'Post',
        resolve() {
          return [{ id: 1, title: 'Nexus', body: '...', published: false }]
        },
      })
    },
  })