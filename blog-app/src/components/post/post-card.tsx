import { PostCardProps } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import PostActions from "./post-actions"

interface ExtendedPostCardProps extends PostCardProps {
  showActions?: boolean
  hideLike?: boolean
  hideSave?: boolean
}

function PostCard({ post, showActions = false, hideLike, hideSave }: ExtendedPostCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:border-primary/20 group">
      <CardHeader>
        <Link href={`/post/${post.slug}`} className="hover:underline">
          <CardTitle className="text-2xl group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </Link>
        <CardDescription className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author.name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.createdAt)}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {post.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          {showActions && (
            <PostActions 
              postId={post.id}
              initialLikes={post._count?.likes || 0}
              initialIsLiked={post.isLiked || false}
              initialIsSaved={post.isSaved || false}
              variant="compact"
              hideLike={hideLike}
              hideSave={hideSave}
            />
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="p-0 hover:bg-transparent hover:text-primary group/btn"
          >
            <Link href={`/post/${post.slug}`} className="flex items-center gap-2">
              Read More 
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard