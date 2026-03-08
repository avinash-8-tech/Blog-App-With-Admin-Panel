"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { slugify } from "@/lib/utils"
import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"


export async function createPost(formdata: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session || !session?.user) {
            return {
                success: false,
                message: "You must be logged in to create a post"
            }
        }

        const title = formdata.get('title') as string;
        const description = formdata.get('description') as string;
        const content = formdata.get('content') as string;


        const slug = slugify(title)
        const existingPost = await db.query.posts.findFirst({
            where: eq(posts.slug, slug)
        })

        if (existingPost) {
            return {
                success: false,
                message: "A post with the same title already exists! Please try with a different one"
            }
        }

        const [newPost] = await db.insert(posts).values({
            title, description, content, slug,
            authorId: session.user.id
        }).returning();

        revalidatePath("/")
        revalidatePath(`/post/${slug}`)
        revalidatePath("/path")

        return {
            success: true,
            message: "Post created successfully",
            slug
        }
    } catch (e) {

        console.log(e, 'Failed to add')

        return {
            success: false,
            message: "Failed to create post",
        }
    }
}

export async function updatePost(postId: number, formdata: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session || !session.user) {
            return {
                success: false,
                message: 'You must logged in to edit a post!'
            }
        }

        const title = formdata.get('title') as string;
        const description = formdata.get('description') as string;
        const content = formdata.get('content') as string;


        const slug = slugify(title)
        const existingPost = await db.query.posts.findFirst({
            where: and(eq(posts.slug, slug), ne(posts.id, postId))
        })

        if (existingPost) {
            return {
                success: false,
                message: 'A post with this title already exists'
            }
        }

        const post = await db.query.posts.findFirst({
            where: eq(posts.id, postId)
        })

        if (post?.authorId != session.user.id) {
            return {
                success: false,
                message: 'You can only edit your own posts!'
            }
        }

        await db.update(posts).set({
            title, description, content, slug, updatedAt: new Date()
        }).where(eq(posts.id, postId))

        revalidatePath('/')
        revalidatePath(`/post/${slug}`)
        revalidatePath('/profile')

        return {
            success: true,
            message: 'Post edited successfully',
            slug
        }
    } catch (e) {

        console.log(e, 'Failed to edit post')

        return {
            success: false,
            message: "Failed to create post",
        }
    }
}

export async function deletePost(postId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session || !session.user) {
            return {
                success: false,
                message: 'You must logged in to delete post'
            }
        }

        const postToDelete = await db.query.posts.findFirst({
            where: eq(posts.id, postId)
        })

        if (!postToDelete) {
            return {
                success: false,
                message: 'Post not found'
            }
        }

        if (postToDelete?.authorId != session.user.id) {
            return {
                success: false,
                message: 'You can only delete your own posts!'
            }
        }

        await db.delete(posts).where(eq(posts.id, postId))

        revalidatePath('/')
        revalidatePath('/profile')

        return {
            success: true,
            message: 'Post deleted successfully'
        }

    } catch (e) {
        console.log(e, 'Failed to edit post')

        return {
            success: false,
            message: "Failed to create post",
        }
    }
}