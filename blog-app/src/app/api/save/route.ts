import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { saves } from "@/lib/db/schema";
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

    const existingSave = await db.query.saves.findFirst({
      where: and(
        eq(saves.userId, session.user.id),
        eq(saves.postId, postId)
      )
    });

    if (existingSave) {
      await db.delete(saves).where(
        and(
          eq(saves.userId, session.user.id),
          eq(saves.postId, postId)
        )
      );
      return NextResponse.json({ saved: false });
    } else {
      await db.insert(saves).values({
        userId: session.user.id,
        postId: postId
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: "Failed to process save" },
      { status: 500 }
    );
  }
}