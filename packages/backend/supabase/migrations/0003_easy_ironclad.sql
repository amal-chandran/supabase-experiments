ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "authenticated can create posts" ON "posts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "users can delete own posts" ON "posts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("posts"."user_id" = (select auth.uid()));