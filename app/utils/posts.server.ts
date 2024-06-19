import { posts } from "src/schema";
import { db } from "~/db.server";
import { eq } from "drizzle-orm";

export type NewPostPayload = typeof posts.$inferInsert;
export type UpdatePostPayload = { id: number; name: string };

export const insertPost = async (payload: NewPostPayload) => {
  const { name, authorId } = payload;
  return await db
    .insert(posts)
    .values({ name, authorId })
    .returning({ id: posts.id, name: posts.name });
};

export const getPost = async (id: number) => {
  return await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });
};

export const getPostsByUserId = async (authorId: number) => {
  return await db.query.posts.findMany({
    where: eq(posts.authorId, authorId),
  });
};

export const deletePost = async (id: number) => {
  return await db.delete(posts).where(eq(posts.id, id));
};

export const updatePost = async (payload: UpdatePostPayload) => {
  const { id, name } = payload;
  return await db
    .update(posts)
    .set({ name })
    .where(eq(posts.id, id))
    .returning({ id: posts.id, name: posts.name });
};

export const getPostById = async (id: number) => {
  return await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });
};
