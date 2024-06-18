import { serial, text, timestamp, pgTableCreator } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `project1_${name}`);

export const user = pgTable("user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  role: text("role").$type<"admin" | "customer">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
