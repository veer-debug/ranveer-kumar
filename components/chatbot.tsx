"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { flushSync } from "react-dom"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Loader2, Trash2, Maximize2, Minimize2, MousePointerClick } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChatMessageContent } from "@/components/chat-message-content"
import { cn } from "@/lib/utils"
import { fetchChatReply } from "@/lib/chat-api"
import {
  buildChatRequestBody,
  type ChatHistoryItem,
} from "@/lib/chat-query"
import {
  delay,
  parseChatSSE,
  splitForVisibleStream,
  type ChatStreamEvent,
} from "@/lib/chat-stream-client"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

type ChatbotProps = {
  autoOpen?: boolean
}

const WELCOME_ID = "welcome"
const AUTO_OPEN_DELAY_MS = 700
const BLINK_DURATION_MS = 10000
const CHAT_STREAM_URL = "/api/chat/stream"
const STREAM_WORD_DELAY_MS = 18

const GREETING_PROMPT = "hi"
const GREETING_RETRY_BASE_MS = 1500
const GREETING_RETRY_MAX_MS = 8000

const SUGGESTION_QUESTIONS = [
  "Who is Ranveer?",
  "What are his skills?",
  "Show me his projects",
]

function createWelcomeMessage(text: string): Message {
  return {
    id: WELCOME_ID,
    text,
    sender: "bot",
    timestamp: new Date(),
  }
}

/** Prior turns only — full text, no length cap on client. */
function buildApiHistory(messages: Message[]): ChatHistoryItem[] {
  return messages
    .filter((m) => m.id !== WELCOME_ID && m.text.trim().length > 0)
    .map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }))
}

export default function Chatbot({ autoOpen = false }: ChatbotProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [showFinger, setShowFinger] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage("")])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const greetingTextRef = useRef<string | null>(null)
  const greetingFetchStarted = useRef(false)
  const greetingRunId = useRef(0)

  useEffect(() => {
    try {
      sessionStorage.removeItem("ranveer-chat-messages")
    } catch {
      /* ignore */
    }
    setMounted(true)
  }, [])

  const loadGreeting = useCallback(async () => {
    const runId = ++greetingRunId.current
    let attempt = 0

    while (runId === greetingRunId.current) {
      try {
        const reply = await fetchChatReply(GREETING_PROMPT, [])
        if (runId !== greetingRunId.current) return
        greetingTextRef.current = reply
        setMessages([createWelcomeMessage(reply)])
        return
      } catch {
        if (runId !== greetingRunId.current) return
        attempt += 1
        const waitMs = Math.min(
          GREETING_RETRY_BASE_MS * attempt,
          GREETING_RETRY_MAX_MS,
        )
        await delay(waitMs)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || greetingFetchStarted.current) return
    greetingFetchStarted.current = true
    void loadGreeting()
  }, [mounted, loadGreeting])

  useEffect(() => {
    if (!mounted || !autoOpen) return
    const fingerTimer = window.setTimeout(() => {
      setShowFinger(true)
    }, AUTO_OPEN_DELAY_MS)
    return () => window.clearTimeout(fingerTimer)
  }, [mounted, autoOpen])

  useEffect(() => {
    if (!showFinger) return
    // Start blink + suggestions after finger animation (1.5s)
    const blinkTimer = window.setTimeout(() => {
      setShowFinger(false)
      setIsBlinking(true)
      setShowSuggestions(true)
    }, 1500)
    return () => window.clearTimeout(blinkTimer)
  }, [showFinger])

  useEffect(() => {
    if (!isBlinking) return
    const stopTimer = window.setTimeout(() => setIsBlinking(false), BLINK_DURATION_MS)
    return () => window.clearTimeout(stopTimer)
  }, [isBlinking])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (mounted) scrollToBottom()
  }, [messages, mounted, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current && mounted) {
      inputRef.current.focus()
    }
  }, [isOpen, mounted])

  useEffect(() => {
    if (!isFullscreen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isFullscreen])

  const appendBotText = useCallback((botId: string, chunk: string) => {
    flushSync(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, text: m.text + chunk } : m,
        ),
      )
    })
  }, [])

  const streamChatReply = async (
    query: string,
    botId: string,
    history: ChatHistoryItem[],
  ): Promise<boolean> => {
    const response = await fetch(CHAT_STREAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: buildChatRequestBody(query, history),
    })

    if (!response.ok || !response.body) return false

    const tokenQueue: string[] = []
    let pumpPromise: Promise<void> | null = null
    let clearedStatusPlaceholder = false

    const pumpTokens = async () => {
      if (pumpPromise) return

      pumpPromise = (async () => {
        while (tokenQueue.length > 0) {
          const piece = tokenQueue.shift()!
          appendBotText(botId, piece)
          if (tokenQueue.length > 0) {
            await delay(STREAM_WORD_DELAY_MS)
          }
        }
      })()

      await pumpPromise
      pumpPromise = null
    }

    const enqueueTokenContent = (content: string) => {
      if (!clearedStatusPlaceholder) {
        clearedStatusPlaceholder = true
        flushSync(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === botId ? { ...m, text: "" } : m)),
          )
        })
      }
      for (const piece of splitForVisibleStream(content)) {
        tokenQueue.push(piece)
      }
      void pumpTokens()
    }

    const handleEvent = async (event: ChatStreamEvent) => {
      if (event.type === "token" && event.content) {
        enqueueTokenContent(event.content)
      } else if (event.type === "status" && event.message) {
        const label =
          event.message === "searching"
            ? "Searching knowledge base…"
            : event.message === "generating"
              ? "Writing answer…"
              : null
        if (label) {
          flushSync(() => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botId && !m.text.trim() ? { ...m, text: label } : m,
              ),
            )
          })
        }
      } else if (event.type === "error") {
        throw new Error(event.message || event.detail || "Stream error")
      } else if (event.type === "done" && event.timestamp) {
        if (pumpPromise) await pumpPromise
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? { ...m, timestamp: new Date(event.timestamp!) }
              : m,
          ),
        )
      }
    }

    const receivedToken = await parseChatSSE(response.body, handleEvent)
    if (pumpPromise) await pumpPromise
    return receivedToken
  }

  const sendMessage = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return

    const history = buildApiHistory(messages)

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    }

    const botId = `bot-${Date.now()}`
    const botPlaceholder: Message = {
      id: botId,
      text: "",
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, botPlaceholder])
    setInputValue("")
    setIsBlinking(false)
    setIsLoading(true)

    try {
      const streamed = await streamChatReply(trimmed, botId, history)

      if (!streamed) {
        const reply = await fetchChatReply(trimmed, history)
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: reply } : m)),
        )
      }
    } catch (error) {
      console.error("Error sending message:", error)
      try {
        const reply = await fetchChatReply(trimmed, history)
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: reply } : m)),
        )
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? {
                  ...m,
                  text:
                    m.text ||
                    "Sorry, I'm having trouble connecting. Please try again later.",
                  timestamp: new Date(),
                }
              : m,
          ),
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setInputValue("")
    const cached = greetingTextRef.current
    if (cached) {
      setMessages([createWelcomeMessage(cached)])
      return
    }
    setMessages([createWelcomeMessage("")])
    void loadGreeting()
  }

  const toggleChat = () => {
    setIsOpen((open) => {
      if (open) setIsFullscreen(false)
      return !open
    })
    setIsBlinking(false)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (question: string) => {
    setShowSuggestions(false)
    setIsBlinking(false)
    setIsOpen(true)
    setInputValue(question)
  }

  const toggleFullscreen = () => setIsFullscreen((v) => !v)

  if (!mounted) return null

  const lastMessage = messages[messages.length - 1]
  const showGreetingLoader =
    messages.length === 1 &&
    messages[0]?.id === WELCOME_ID &&
    !messages[0].text.trim()
  const showTypingLoader =
    isLoading &&
    lastMessage?.sender === "bot" &&
    !lastMessage.text.trim()

  return (
    <>
      <motion.div
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50",
          isFullscreen && isOpen && "hidden",
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={toggleChat}
          className={`inline-flex cursor-pointer bg-transparent border-none outline-none p-0 m-0 leading-none ${
            isBlinking && !isOpen ? "chat-btn-pulse" : ""
          }`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-violet-500 via-cyan-400 to-emerald-400 flex items-center justify-center border-2 border-black shadow-lg"
              >
                <X className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Image src="/chat-icon.png" alt="Chat" width={80} height={80} className="h-20 w-20 sm:h-24 sm:w-24 object-contain drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Finger navigating from center of page to chat icon */}
      {showFinger && !isOpen && (
        <div className="fixed pointer-events-none z-[60] finger-travel">
          <Image src="/click-finger.png" alt="Tap" width={80} height={80} style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(98%) saturate(1500%) hue-rotate(160deg) brightness(104%) contrast(104%)" }} className="h-20 w-20 sm:h-24 sm:w-24 object-contain" />
        </div>
      )}

      {/* Floating suggestion questions */}
      <AnimatePresence>
        {showSuggestions && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-4 sm:bottom-36 sm:right-6 z-50 flex flex-col items-end gap-2"
          >
            {SUGGESTION_QUESTIONS.map((q, i) => (
              <motion.button
                key={q}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.12, duration: 0.25 }}
                onClick={() => handleSuggestionClick(q)}
                className="chat-suggestion-bubble max-w-[200px] sm:max-w-[240px] text-xs sm:text-sm font-medium px-3 py-2 bg-cyan text-black border-2 border-black neo-shadow-sm cursor-pointer hover:bg-cyan-dark transition-colors whitespace-nowrap"
              >
                {q}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden bg-paper border-2 border-black neo-shadow",
              isFullscreen
                ? "inset-0 w-full h-[100dvh] max-w-none max-h-none rounded-none border-0 sm:border-0"
                : "left-3 right-3 bottom-[4.25rem] h-[min(55dvh,22rem)] max-h-[calc(100dvh-5.5rem)] sm:left-auto sm:right-6 sm:bottom-24 sm:w-[min(100vw-2rem,26rem)] sm:h-[min(75vh,32rem)] sm:max-h-[36rem]",
              isBlinking && !isFullscreen && "chat-panel-blink",
            )}
          >
            <div className="flex items-center justify-between gap-2 p-3 sm:p-4 border-b-2 border-black bg-paper-2 shrink-0">
              <motion.div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 border-2 border-black bg-cyan flex items-center justify-center">
                  <Image src="/chat-icon.png" alt="Chat" width={28} height={28} className="h-6 w-6 sm:h-7 sm:w-7 object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-ink text-sm sm:text-base truncate">
                    Ask about Ranveer
                  </h3>
                </div>
              </motion.div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 border-2 border-black rounded-none hover:bg-paper"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="h-8 w-8 border-2 border-black rounded-none hover:bg-paper"
                  aria-label="Clear chat history"
                  title="Clear chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {isFullscreen && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="h-8 w-8 border-2 border-black rounded-none hover:bg-paper"
                    aria-label="Close chat"
                    title="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea
              className={cn(
                "flex-1 min-h-0 p-3 sm:p-4",
                isFullscreen && "px-4 sm:px-8 md:px-12",
              )}
            >
              <motion.div
                className={cn("space-y-4", isFullscreen && "max-w-3xl mx-auto w-full")}
              >
                {messages.map((message) => {
                  const isUser = message.sender === "user"
                  const isEmptyWelcome =
                    message.id === WELCOME_ID && !message.text.trim()
                  const isEmptyStreamingBot =
                    !isUser &&
                    !message.text.trim() &&
                    isLoading &&
                    message.id === lastMessage?.id

                  if (isEmptyWelcome || isEmptyStreamingBot) return null

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 px-1">
                        {isUser ? "You" : "Assistant"}
                      </span>
                      <div
                        className={`max-w-[92%] sm:max-w-[88%] px-3 py-2.5 sm:px-4 border-2 border-black ${
                          isUser
                            ? "bg-cyan text-black neo-shadow-sm"
                            : "bg-paper-2 text-ink"
                        }`}
                      >
                        {isUser ? (
                          <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {message.text}
                          </p>
                        ) : (
                          <div className="relative">
                            <ChatMessageContent text={message.text} />
                            {isLoading &&
                              message.id === lastMessage?.id &&
                              message.text.length > 0 && (
                                <span className="inline-block w-0.5 h-3.5 sm:h-4 bg-ink ml-0.5 align-middle animate-pulse" />
                              )}
                          </div>
                        )}
                        <p className="text-[10px] mt-1.5 opacity-50 font-mono">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}

                {(showGreetingLoader || showTypingLoader) && (
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 px-1">
                      Assistant
                    </span>
                    <div className="bg-paper-2 text-ink border-2 border-black px-4 py-2.5">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </motion.div>
            </ScrollArea>

            <div
              className={cn(
                "p-3 sm:p-4 border-t-2 border-black bg-paper shrink-0",
                isFullscreen && "px-4 sm:px-8 md:px-12",
              )}
            >
              <div
                className={cn(
                  "flex gap-2 items-end",
                  isFullscreen && "max-w-3xl mx-auto w-full",
                )}
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask a question… (Enter to send)"
                  rows={isFullscreen ? 3 : 2}
                  className={cn(
                    "flex-1 min-h-[2.75rem] resize-y form-input !py-2 !text-sm min-w-0",
                    isFullscreen ? "max-h-40" : "max-h-32",
                  )}
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-10 w-10 sm:h-11 sm:w-11 bg-cyan hover:bg-cyan-dark text-black border-2 border-black shrink-0 rounded-none"
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
