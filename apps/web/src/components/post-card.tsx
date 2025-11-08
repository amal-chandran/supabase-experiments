import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { Post } from "@/lib/hooks/use-posts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      {post.coverImage && (
        <div className="w-full h-48 overflow-hidden rounded-t-xl">
          <img
            src={post.coverImage}
            alt="Post cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardDescription>
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}

