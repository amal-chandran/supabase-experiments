import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./schema/auth";

export const db = drizzle(process.env.DATABASE_URL || "", {
  schema: { ...authSchema },
});

// Export schema tables for use in other packages
export * from "./schema/auth";
