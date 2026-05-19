export type ChatStreamEvent =
  | { type: "token"; content: string }
  | { type: "start" }
  | { type: "status"; message?: string }
  | { type: "done"; status?: string; timestamp?: string }
  | { type: "error"; message?: string; detail?: string }

/** Split SSE token text so the UI can reveal words progressively. */
export function splitForVisibleStream(
  text: string,
  wordsPerChunk = 2,
): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  const words = trimmed.split(/\s+/)
  if (words.length <= wordsPerChunk) return [text]

  const pieces: string[] = []
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const slice = words.slice(i, i + wordsPerChunk).join(" ")
    const hasMore = i + wordsPerChunk < words.length
    pieces.push(hasMore ? `${slice} ` : slice)
  }
  return pieces
}

export async function parseChatSSE(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: ChatStreamEvent) => void | Promise<void>,
): Promise<boolean> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let receivedToken = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith("data:")) continue

      const payload = trimmed.slice(5).trim()
      if (!payload) continue

      let event: ChatStreamEvent
      try {
        event = JSON.parse(payload) as ChatStreamEvent
      } catch {
        continue
      }

      if (event.type === "token" && event.content) {
        receivedToken = true
      }

      await onEvent(event)
    }
  }

  return receivedToken
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Collect token content from a complete SSE text body (non-streaming fetch). */
export function collectReplyFromSSEText(raw: string): string {
  let text = ""

  for (const line of raw.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed.startsWith("data:")) continue

    const payload = trimmed.slice(5).trim()
    if (!payload) continue

    try {
      const event = JSON.parse(payload) as ChatStreamEvent
      if (event.type === "token" && event.content) {
        text += event.content
      }
    } catch {
      continue
    }
  }

  return text.trim()
}

export function isSSEChatBody(
  raw: string,
  contentType?: string | null,
): boolean {
  if (contentType?.includes("text/event-stream")) return true
  return raw.trimStart().startsWith("data:")
}
