import { pgTableCreator, serial, integer, timestamp, varchar, text } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

const createTable = pgTableCreator(name => `project1_${name}`)

export const user = createTable('user', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  password: text('password'),
  role: text('role').$type<'admin' | 'customer'>(),
  // meta
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

export const userRelations = relations(user, ({ many }) => ({
  posts: many(posts),
}))

export const posts = createTable('post', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  authorId: integer('author_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content'),
  // meta
  updatedAt: timestamp('updatedAt', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const postsRelations = relations(posts, ({ many, one }) => ({
  author: one(user, {
    fields: [posts.authorId],
    references: [user.id],
  }),
  comments: many(comments),
}))

export const comments = createTable('comment', {
  id: serial('id').primaryKey(),
  postId: integer('post_id'),
  authorId: integer('author_id'),
  content: text('content'),
})

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}))
