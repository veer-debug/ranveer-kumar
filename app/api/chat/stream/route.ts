import { NextRequest } from "next/server"

const UPSTREAM_STREAM_URL =
  process.env.CHAT_API_STREAM_URL ?? "https://ranveer097-chat.hf.space/chat/stream"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const body = await request.text()

  let upstream: Response
  try {
    upstream = await fetch(UPSTREAM_STREAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body,
      cache: "no-store",
    })
  } catch {
    return new Response("Upstream chat unavailable", { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    return new Response(detail || "Upstream chat error", {
      status: upstream.status || 502,
    })
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
