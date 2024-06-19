import { eq } from "drizzle-orm";
import { user } from "src/schema";
import { db } from "~/db.server";

export type NewUserPayload = typeof user.$inferInsert;

export const insertUser = async (payload: NewUserPayload) => {
  const { name, email, password, role } = payload;
  return await db
    .insert(user)
    .values({ name, email, password, role })
    .returning({ id: user.id, name: user.name });
};

export const getUser = async (id: number) => {
  return await db.query.user.findFirst({
    where: eq(user.id, id),
  });
};

export const deleteUser = async (id: number) => {
  return await db.delete(user).where(eq(user.id, id));
};
