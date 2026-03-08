import { PostListProps } from "@/lib/types"
import PostCard from "./post-card"

interface ExtendedPostListProps extends PostListProps {
  showActions?: boolean
  hideLike?: boolean
  hideSave?: boolean
}

function PostList({ posts, showActions = false, hideLike, hideSave }: ExtendedPostListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <PostCard
            post={post}
            showActions={showActions}
            hideLike={hideLike}
            hideSave={hideSave}
          />
        </div>
      ))}
    </div>
  )
}

export default PostList