import { posts, user } from "src/schema";
import { db } from "~/db.server";
import { eq } from "drizzle-orm";

export type NewPostPayload = typeof posts.$inferInsert;
export type UpdatePostPayload = { id: number; name: string };

export const insertPost = async (payload: NewPostPayload) => {
  const { name, authorId, content } = payload;
  return await db
    .insert(posts)
    .values({ name, authorId, content })
    .returning({ id: posts.id, name: posts.name, content: posts.content });
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

// example for left join
// const result = await db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))

// left join with posts and authors
export const getPostWithAuthor = async (id: number) => {
  return await db
    .select()
    .from(posts)
    .leftJoin(user, eq(posts.authorId, user.id))
    .where(eq(posts.id, id));
};
