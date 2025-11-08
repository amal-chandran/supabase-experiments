import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCreatePost } from "@/lib/hooks/use-posts";
import { toast } from "sonner";

export function PostForm() {
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      await createPost.mutateAsync({
        content: content.trim(),
        coverImage: coverImage.trim() || null,
      });
      setContent("");
      setCoverImage("");
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
            <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
            <Input
              id="coverImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              disabled={createPost.isPending}
            />
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

