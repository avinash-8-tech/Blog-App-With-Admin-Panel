'use client'

import { Heart, Bookmark } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

interface PostActionsProps {
  postId: number
  initialLikes: number
  initialIsLiked: boolean
  initialIsSaved: boolean
  variant?: "compact" | "full"
  hideLike?: boolean
  hideSave?: boolean
}

function PostActions({ 
  postId, 
  initialLikes, 
  initialIsLiked, 
  initialIsSaved,
  variant = "full",
  hideLike,
  hideSave
}: PostActionsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState({ like: false, save: false })

  const handleLike = async () => {
    if (!session) {
      toast.error("Please login to like posts")
      return
    }
    if (isLoading.like) return
    
    setIsLoading(prev => ({ ...prev, like: true }))

    try {
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)

      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      })

      if (!res.ok) throw new Error()
      
      router.refresh()
    } catch (error) {
      setIsLiked(isLiked)
      setLikesCount(likesCount)
      toast.error("Failed to like post")
    } finally {
      setIsLoading(prev => ({ ...prev, like: false }))
    }
  }

  const handleSave = async () => {
    if (!session) {
      toast.error("Please login to save posts")
      return
    }
    if (isLoading.save) return

    setIsLoading(prev => ({ ...prev, save: true }))

    try {
      setIsSaved(!isSaved)

      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      })

      if (!res.ok) throw new Error()
      
      toast.success(isSaved ? "Removed from saved" : "Saved to collection")
      router.refresh()
    } catch (error) {
      setIsSaved(isSaved)
      toast.error("Failed to save post")
    } finally {
      setIsLoading(prev => ({ ...prev, save: false }))
    }
  }

  // Agar dono hide hain to kuch mat dikhao
  if (hideLike && hideSave) {
    return null
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        {!hideLike && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLoading.like}
            className="gap-1 px-2"
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span className="text-xs">{likesCount}</span>
          </Button>
        )}

        {!hideSave && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isLoading.save}
            className="px-2"
          >
            <Bookmark 
              className={`h-4 w-4 transition-colors ${
                isSaved ? "fill-yellow-500 text-yellow-500" : ""
              }`}
            />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {!hideLike && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLoading.like}
          className="gap-2"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
        </Button>
      )}

      {!hideSave && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={isLoading.save}
          className="gap-2"
        >
          <Bookmark 
            className={`h-5 w-5 transition-colors ${
              isSaved ? "fill-yellow-500 text-yellow-500" : ""
            }`}
          />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </Button>
      )}
    </div>
  )
}

export default PostActions