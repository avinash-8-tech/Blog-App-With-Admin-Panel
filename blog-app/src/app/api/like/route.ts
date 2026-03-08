import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const { postId } = await req.json();

    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.userId, session.user.id),
        eq(likes.postId, postId)
      )
    });

    if (existingLike) {
      await db.delete(likes).where(
        and(
          eq(likes.userId, session.user.id),
          eq(likes.postId, postId)
        )
      );
      return NextResponse.json({ liked: false });
    } else {
      await db.insert(likes).values({
        userId: session.user.id,
        postId: postId
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}