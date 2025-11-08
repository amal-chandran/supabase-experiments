import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import {
  createFileRoute,
  Navigate,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    // Check if user is authenticated
    const sessionData = await authClient.getSession();

    // If no session, redirect to login
    if (!sessionData?.user) {
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

  return <Outlet />;
}
