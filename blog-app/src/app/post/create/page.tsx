import PostForm from "@/components/post/post-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CreatePostPage = () => {
  return (
    <main className="py-10">
      <div className="max-w-2xl mx-auto px-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-6">Create Post</h1>

        <PostForm />
      </div>
    </main>
  )
}

export default CreatePostPage