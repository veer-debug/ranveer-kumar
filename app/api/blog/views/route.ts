import { NextResponse } from "next/server"
import { getPostId } from "@/lib/blog-ids"
import { getTotalViews, getViewCount, incrementView } from "@/lib/blog-engagement"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const total = searchParams.get("total") === "true"

    if (total) {
      const count = await getTotalViews()
      return NextResponse.json({ total: count })
    }

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }

    const views = await getViewCount(postId)
    return NextResponse.json({ postId, views })
  } catch (error) {
    console.error("GET /api/blog/views", error)
    return NextResponse.json({ error: "Failed to load views" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      postId?: string
      categoryId?: string
      slug?: string
    }

    const postId =
      body.postId ?? (body.categoryId ? getPostId(body.categoryId, body.slug) : null)

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }

    const views = await incrementView(postId)
    return NextResponse.json({ postId, views })
  } catch (error) {
    console.error("POST /api/blog/views", error)
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 })
  }
}
