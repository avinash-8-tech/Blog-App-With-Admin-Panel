import PostContent from "@/components/post/post-content";
import { auth } from "@/lib/auth";
import { getPostBySlug } from "@/lib/db/queires";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { likes, saves } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const PostDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const isAuthor = session?.user?.id === post.authorId

  const postLikes = await db.query.likes.findMany({
    where: eq(likes.postId, post.id)
  })

  let isLiked = false
  let isSaved = false

  if (session?.user) {
    const userLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.userId, session.user.id),
        eq(likes.postId, post.id)
      )
    })
    isLiked = !!userLike

    const userSave = await db.query.saves.findFirst({
      where: and(
        eq(saves.userId, session.user.id),
        eq(saves.postId, post.id)
      )
    })
    isSaved = !!userSave
  }

  const postWithMeta = {
    ...post,
    _count: {
      likes: postLikes.length
    },
    isLiked,
    isSaved
  }

  return (
    <main className="py-10">
      <div className="max-w-4xl mx-auto">
        <PostContent post={postWithMeta} isAuthor={isAuthor} />
      </div>
    </main>
  )
}

export default PostDetailsPage