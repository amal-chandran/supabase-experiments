import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const publicSchema = pgSchema("public");

export const posts = publicSchema.table("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
