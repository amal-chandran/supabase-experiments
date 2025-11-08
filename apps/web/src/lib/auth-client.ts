import type { auth } from "@supabase-better-auth/auth";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
  fetchOptions: {
    throw: true,
  },
});
