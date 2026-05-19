import { NextRequest, NextResponse } from "next/server"
import {
  collectReplyFromSSEText,
  isSSEChatBody,
} from "@/lib/chat-stream-client"

const UPSTREAM_CHAT_URL =
  process.env.CHAT_API_URL ?? "https://ranveer097-chat.hf.space/chat/"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const body = await request.text()

  let upstream: Response
  try {
    upstream = await fetch(UPSTREAM_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
      cache: "no-store",
    })
  } catch {
    return new Response(JSON.stringify({ message: "Upstream chat unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    })
  }

  const text = await upstream.text()
  const contentType = upstream.headers.get("content-type")

  if (upstream.ok && isSSEChatBody(text, contentType)) {
    const reply = collectReplyFromSSEText(text)
    return NextResponse.json({ reply })
  }

  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType ?? "application/json",
    },
  })
}
