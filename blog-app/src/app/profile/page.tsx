import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts, likes, saves } from "@/lib/db/schema";
import { PlusCircle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, desc, and } from "drizzle-orm";
import PostList from "@/components/post/post-list";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user) {
    redirect('/')
  }

  const userPosts = await db.query.posts.findMany({
    where: eq(posts.authorId, session.user.id),
    orderBy: [desc(posts.createdAt)],
    with: {
      author: true
    }
  })

  const userLikedPosts = await db.query.likes.findMany({
    where: eq(likes.userId, session.user.id),
    columns: {
      postId: true
    }
  })
  const likedPostIds = new Set(userLikedPosts.map(l => l.postId))

  const userSavedPosts = await db.query.saves.findMany({
    where: eq(saves.userId, session.user.id),
    columns: {
      postId: true
    }
  })
  const savedPostIds = new Set(userSavedPosts.map(s => s.postId))

  const getPostWithMeta = async (post: any, defaultIsLiked = false, defaultIsSaved = false) => {
    const postLikes = await db.query.likes.findMany({
      where: eq(likes.postId, post.id)
    })

    return {
      ...post,
      _count: {
        likes: postLikes.length
      },
      isLiked: likedPostIds.has(post.id) || defaultIsLiked,
      isSaved: savedPostIds.has(post.id) || defaultIsSaved
    }
  }

  const userPostsWithMeta = await Promise.all(
    userPosts.map(post => getPostWithMeta(post))
  )

  const userLikes = await db.query.likes.findMany({
    where: eq(likes.userId, session.user.id),
    with: {
      post: {
        with: {
          author: true
        }
      }
    }
  })

  const likedPostsWithMeta = await Promise.all(
    userLikes.map(async (like) => {
      return await getPostWithMeta(like.post, true, false)
    })
  )

  const userSaves = await db.query.saves.findMany({
    where: eq(saves.userId, session.user.id),
    with: {
      post: {
        with: {
          author: true
        }
      }
    }
  })

  const savedPostsWithMeta = await Promise.all(
    userSaves.map(async (save) => {
      return await getPostWithMeta(save.post, false, true)
    })
  )

  return (
    <main className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <Button asChild>
            <Link href="/post/create">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Post
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your Profile Information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name: </span>
                <span className="text-muted-foreground">{session.user.name}</span>
              </div>
              <div>
                <span className="font-medium">Email: </span>
                <span className="text-muted-foreground">{session.user.email}</span>
              </div>
              <div>
                <span className="font-medium">Total Posts: </span>
                <span className="text-muted-foreground">{userPosts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts">
          <TabsList className="mb-4">
            <TabsTrigger value="posts">My Posts ({userPostsWithMeta.length})</TabsTrigger>
            <TabsTrigger value="liked">Liked ({likedPostsWithMeta.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedPostsWithMeta.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {userPostsWithMeta.length === 0 ? (
              <p className="text-muted-foreground">No posts yet</p>
            ) : (
              <PostList
                posts={userPostsWithMeta}
                showActions={true}
              />
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedPostsWithMeta.length === 0 ? (
              <p className="text-muted-foreground">No liked posts</p>
            ) : (
              <PostList
                posts={likedPostsWithMeta}
                showActions={true}
                hideSave={true}
              />
            )}
          </TabsContent>

          <TabsContent value="saved">
            {savedPostsWithMeta.length === 0 ? (
              <p className="text-muted-foreground">No saved posts</p>
            ) : (
              <PostList
                posts={savedPostsWithMeta}
                showActions={true}
                hideLike={true}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export default ProfilePage