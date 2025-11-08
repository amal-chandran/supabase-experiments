import type { Post } from "@/lib/hooks/use-posts";
import { useDeletePost } from "@/lib/hooks/use-posts";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const deletePost = useDeletePost();
  const canDelete = currentUserId && post.userId === currentUserId;

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost.mutateAsync(post.id);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const hasImage = post.coverImage && !imageError;

  return (
    <Card className={hasImage ? "pt-0" : ""}>
      {hasImage && (
        <div className="w-full h-64 overflow-hidden rounded-t-xl border-b">
          <img
            src={post.coverImage}
            alt="Post cover"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardDescription>{formatDate(post.createdAt)}</CardDescription>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deletePost.isPending}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
