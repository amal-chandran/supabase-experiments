import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { authClient } from "./auth-client";

/**
 * Creates a Supabase client configured with Better Auth JWT token
 * The token is injected into request headers via a custom fetch interceptor
 * Similar to Clerk's pattern for injecting tokens
 */
export function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL environment variable is required");
  }

  return createClient(
    supabaseUrl,
    import.meta.env.VITE_SUPABASE_ANON_KEY || "",
    {
      global: {
        // Custom fetch that intercepts requests and adds Better Auth token
        fetch: async (
          url: string | Request | URL,
          options: RequestInit = {}
        ) => {
          // Insert the Better Auth token into the headers
          const headers = new Headers(options?.headers);
          const token = await authClient.token();
          if (token) {
            headers.set("Authorization", `Bearer ${token.token}`);
          }

          // Call the default fetch with the updated headers
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
      auth: {
        persistSession: false, // We're handling auth via Better Auth
        autoRefreshToken: false, // Token refresh handled by Better Auth
        detectSessionInUrl: false,
      },
    }
  );
}

export const supabase = createSupabaseClient();

