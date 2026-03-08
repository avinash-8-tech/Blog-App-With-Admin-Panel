import PostForm from "@/components/post/post-form";
import { auth } from "@/lib/auth";
import { getPostBySlug } from "@/lib/db/queires";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const EditPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user) {
    redirect('/')
  }

  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  if (post.authorId !== session.user.id) {
    redirect('/')
  }

  return (
    <main className="py-10">
      <div className="max-w-2xl mx-auto px-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/post/${slug}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

        <PostForm
          isEditing={true}
          post={{
            id: post.id,
            title: post.title,
            description: post.description,
            content: post.content,
            slug: post.slug
          }}
        />
      </div>
    </main>
  )
}

export default EditPostPage