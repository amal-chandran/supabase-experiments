import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Navigate, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    // Check if user is authenticated
    const sessionData = await authClient.getSession();
    
    // If no session, redirect to login
    if (!sessionData?.data) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Loader />;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-7xl my-10 min-h-1/2 bg-background rounded-lg shadow-lg border overflow-hidden">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

