import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    // Anyone can read posts
    pgPolicy("anyone can select posts", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    // Only authenticated users can create posts
    pgPolicy("authenticated can create posts", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`true`,
    }),
    // Only the post owner can delete their own posts
    pgPolicy("users can delete own posts", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.userId} = ${authUid}`,
    }),
  ]
);
