import { PostContentProps } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Button } from "../ui/button"
import Link from "next/link"
import { Pencil, Calendar, User, ArrowLeft } from "lucide-react"
import DeletePostButton from "./delete-post-button"
import PostActions from "./post-actions"

function PostContent({ post, isAuthor }: PostContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6 gap-1 pl-0 hover:pl-0">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      {/* Author & Date Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {post.author.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Like & Save Actions */}
        <PostActions
          postId={post.id}
          initialLikes={post._count?.likes || 0}
          initialIsLiked={post.isLiked || false}
          initialIsSaved={post.isSaved || false}
          variant="full"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Description */}
      <p className="text-lg text-muted-foreground border-l-4 border-primary pl-4 py-2 mb-8">
        {post.description}
      </p>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div className="whitespace-pre-wrap leading-relaxed text-base md:text-lg">
          {post.content}
        </div>
      </div>

      {/* Author Actions */}
      {isAuthor && (
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button asChild variant="outline" size="default" className="gap-2">
            <Link href={`/post/edit/${post.slug}`}>
              <Pencil className="h-4 w-4" />
              Edit Post
            </Link>
          </Button>
          <DeletePostButton postId={post.id} />
        </div>
      )}
    </div>
  )
}

export default PostContent