export type ChatHistoryItem = {
  role: "user" | "assistant"
  content: string
}

/** Backend accepts only `queary` (max 2000 chars) — history must be embedded in the query. */
export const CHAT_QUEARY_MAX_LENGTH = 2000

export function buildContextualQuery(
  latestUserMessage: string,
  history: ChatHistoryItem[],
): string {
  const latest = latestUserMessage.trim()
  if (!latest) return ""

  if (history.length === 0) {
    return latest.slice(0, CHAT_QUEARY_MAX_LENGTH)
  }

  const header =
    "You are Ranveer Kumar's portfolio assistant. Use the conversation history below. " +
    "Follow-up questions (e.g. \"that company\", \"where\", \"tell me more\") refer to earlier turns. " +
    "Answer the current question in first person as Ranveer.\n\n"

  const footer = `\n\nCurrent question (answer this): ${latest}`

  let budget = CHAT_QUEARY_MAX_LENGTH - header.length - footer.length
  if (budget < 200) {
    return latest.slice(0, CHAT_QUEARY_MAX_LENGTH)
  }

  const lines: string[] = []
  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i]
    const label = item.role === "user" ? "User" : "Assistant"
    const line = `${label}: ${item.content.trim()}`
    const lineCost = line.length + 1

    if (lineCost > budget) {
      const sliceBudget = Math.max(0, budget - label.length - 3)
      if (sliceBudget > 40) {
        lines.unshift(`${label}: ${item.content.trim().slice(0, sliceBudget)}…`)
      }
      break
    }

    lines.unshift(line)
    budget -= lineCost
  }

  const combined = `${header}Conversation history:\n${lines.join("\n")}${footer}`
  return combined.slice(0, CHAT_QUEARY_MAX_LENGTH)
}

export function buildChatRequestBody(
  latestUserMessage: string,
  history: ChatHistoryItem[],
): string {
  return JSON.stringify({
    queary: buildContextualQuery(latestUserMessage, history),
  })
}
