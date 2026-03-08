import PostList from "@/components/post/post-list";
import { getAllPost } from "@/lib/db/queires";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PenSquare } from "lucide-react";

export const metadata: Metadata = {
  title: 'BlogApp - Share Your Stories',
  description: 'A modern blog platform for writers and readers'
}

export default async function Home() {
  const posts = await getAllPost()

  return (
    <main className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold leading-normal bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Welcome To The Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>

          <div className="mt-6">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/post/create">
                <PenSquare className="h-5 w-5 mr-2" />
                Start Writing
              </Link>
            </Button>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium mb-4">No posts yet</h2>
            <p className="text-muted-foreground mb-8">
              Be the first to share your story with the world!
            </p>
            <Button asChild>
              <Link href="/post/create">
                Create First Post
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Latest Posts</h2>
              <p className="text-sm text-muted-foreground">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
              </p>
            </div>
            <PostList posts={posts} />
          </>
        )}
      </div>
    </main>
  );
}