import { useCreatePost } from "@/lib/hooks/use-posts";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function PostForm() {
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const createPost = useCreatePost();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Please select a valid image file (JPEG, PNG, WebP, or GIF)"
        );
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setCoverImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      await createPost.mutateAsync({
        content: content.trim(),
        coverImageFile: coverImageFile || undefined,
      });
      setContent("");
      setCoverImageFile(null);
      setImagePreview(null);
      // Reset file input
      const fileInput = document.getElementById(
        "coverImage"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image (optional)</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={createPost.isPending}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md border"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Max file size: 5MB. Supported formats: JPEG, PNG, WebP, GIF
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              disabled={createPost.isPending}
              required
            />
          </div>
          <Button type="submit" disabled={createPost.isPending}>
            {createPost.isPending ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
