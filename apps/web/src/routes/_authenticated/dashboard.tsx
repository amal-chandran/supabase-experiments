import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { PostForm } from "@/components/post-form";
import { PostCard } from "@/components/post-card";
import { usePosts } from "@/lib/hooks/use-posts";
import { Loader } from "@/components/loader";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session?.user) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { data: posts, isLoading, error } = usePosts();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome {session?.user.name}</p>
      </div>

      <div className="mb-8">
        <PostForm />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Posts</h2>
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        )}
        {error && (
          <div className="text-destructive text-center py-8">
            Error loading posts: {error.message}
          </div>
        )}
        {posts && posts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No posts yet. Create your first post above!
          </div>
        )}
        {posts && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
