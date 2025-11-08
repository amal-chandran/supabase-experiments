import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../auth-client";
import { supabase } from "../supabase-client";

export interface Post {
  id: string;
  userId: string;
  content: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  content: string;
  coverImage?: string | null;
}

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Post[];
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const session = await authClient.getSession();
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: session.user.id,
          content: input.content,
          cover_image: input.coverImage || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
