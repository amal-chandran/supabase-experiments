import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
  beforeLoad: async () => {
    const sessionData = await authClient.getSession();
    if (sessionData?.user) {
      redirect({
        to: "/",
      });
    }
  },
});

function PublicLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto py-5">
        <Outlet />
      </div>
    </div>
  );
}
