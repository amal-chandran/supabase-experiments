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
  coverImageFile?: File;
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

      let coverImageUrl: string | null = null;

      // Upload cover image to Supabase Storage if provided
      if (input.coverImageFile) {
        const fileExt = input.coverImageFile.name.split(".").pop();
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("post-covers")
          .upload(filePath, input.coverImageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from("post-covers")
          .getPublicUrl(filePath);

        coverImageUrl = urlData.publicUrl;
      }

      // Create the post with the cover image URL
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: session.user.id,
          content: input.content,
          cover_image: coverImageUrl,
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
