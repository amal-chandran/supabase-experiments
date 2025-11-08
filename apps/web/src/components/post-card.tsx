import type { Post } from "@/lib/hooks/use-posts";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [imageError, setImageError] = useState(false);

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

  return (
    <Card className="pt-0">
      {post.coverImage && !imageError && (
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
        <CardDescription>{formatDate(post.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
