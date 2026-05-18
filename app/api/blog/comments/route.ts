import { NextResponse } from "next/server"
import { getPostId } from "@/lib/blog-ids"
import { addComment, getComments } from "@/lib/blog-engagement"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }

    const comments = await getComments(postId)
    return NextResponse.json({ postId, comments })
  } catch (error) {
    console.error("GET /api/blog/comments", error)
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      postId?: string
      categoryId?: string
      slug?: string
      name?: string
      message?: string
    }

    const postId =
      body.postId ?? (body.categoryId ? getPostId(body.categoryId, body.slug) : null)
    const name = body.name?.trim() ?? ""
    const message = body.message?.trim() ?? ""

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 })
    }

    if (message.length < 3) {
      return NextResponse.json({ error: "Message is too short" }, { status: 400 })
    }

    const comment = await addComment(postId, name, message)
    const comments = await getComments(postId)

    return NextResponse.json({ postId, comment, comments }, { status: 201 })
  } catch (error) {
    console.error("POST /api/blog/comments", error)
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 })
  }
}
