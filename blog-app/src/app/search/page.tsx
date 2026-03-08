import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { ilike, or } from "drizzle-orm";
import PostList from "@/components/post/post-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q: string }>
}

const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const { q } = await searchParams
  const query = q || ''

  const searchResults = query ? await db.query.posts.findMany({
    where: or(
      ilike(posts.title, `%${query}%`),
      ilike(posts.description, `%${query}%`)
    ),
    with: {
      author: true
    },
    orderBy: (posts, { desc }) => [desc(posts.createdAt)]
  }) : []

  return (
    <main className="py-10">
      <div className="max-w-7xl mx-auto px-4">

        <Button variant="ghost" size="sm" asChild className="mb-6 gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Search Results</h1>
          </div>
          {query && (
            <p className="text-muted-foreground">
              Showing results for: <span className="font-medium text-foreground">"{query}"</span>
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-20">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Enter a search term</h2>
            <p className="text-muted-foreground">
              Use the search bar in the header to find posts
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-medium mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any posts matching "{query}"
            </p>
            <Button asChild variant="outline">
              <Link href="/">Browse All Posts</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found {searchResults.length} {searchResults.length === 1 ? 'post' : 'posts'}
            </p>
            <PostList posts={searchResults} />
          </div>
        )}
      </div>
    </main>
  )
}

export default SearchPage