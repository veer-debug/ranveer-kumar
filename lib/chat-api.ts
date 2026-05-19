import {
  buildChatRequestBody,
  type ChatHistoryItem,
} from "@/lib/chat-query"
import {
  collectReplyFromSSEText,
  isSSEChatBody,
} from "@/lib/chat-stream-client"

const CHAT_API_URL = "/api/chat"

export async function fetchChatReply(
  query: string,
  history: ChatHistoryItem[] = [],
): Promise<string> {
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: buildChatRequestBody(query, history),
  })

  const raw = await response.text()

  if (!response.ok) {
    throw new Error(raw || "Failed to get response from API")
  }

  const contentType = response.headers.get("content-type")

  if (isSSEChatBody(raw, contentType)) {
    const text = collectReplyFromSSEText(raw)
    if (!text) throw new Error("Empty response from chat API")
    return text
  }

  let data: { reply?: string; message?: string }
  try {
    data = JSON.parse(raw) as { reply?: string; message?: string }
  } catch {
    throw new Error("Invalid response from chat API")
  }

  const text = (data.reply || data.message || "").trim()
  if (!text) throw new Error("Empty response from chat API")
  return text
}
