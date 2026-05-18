"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const AUTO_OPEN_DELAY_MS = 700
const BLINK_DURATION_MS = 10000

type ChatbotProps = {
  /** Auto-open and blink on first load (home page only). */
  autoOpen?: boolean
}

export default function Chatbot({ autoOpen = false }: ChatbotProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to help you. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !autoOpen) return

    const openTimer = window.setTimeout(() => {
      setIsOpen(true)
      setIsBlinking(true)
    }, AUTO_OPEN_DELAY_MS)

    return () => window.clearTimeout(openTimer)
  }, [mounted, autoOpen])

  useEffect(() => {
    if (!isBlinking) return

    const stopTimer = window.setTimeout(() => setIsBlinking(false), BLINK_DURATION_MS)
    return () => window.clearTimeout(stopTimer)
  }, [isBlinking])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (mounted) {
      scrollToBottom()
    }
  }, [messages, mounted])

  useEffect(() => {
    if (isOpen && inputRef.current && mounted) {
      inputRef.current.focus()
    }
  }, [isOpen, mounted])

  if (!mounted) {
    return null
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsBlinking(false)
    setIsLoading(true)

    try {
      const response = await fetch("https://ranveer097-chat.hf.space/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          queary: userMessage.text,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from API")
      }

      const data = await response.json()
      
      // Handle API response format
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || data.message || "I'm sorry, I couldn't process that request.",
        sender: "bot",
        timestamp: new Date(data.timestamp || Date.now()),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen((open) => !open)
    setIsBlinking(false)
  }

  const stopBlink = () => setIsBlinking(false)

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          className={`h-14 w-14 rounded-none bg-cyan hover:bg-cyan-dark text-black border-2 border-black neo-shadow ${
            isBlinking && !isOpen ? "chat-attention-blink" : ""
          }`}
          size="icon"
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
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 z-50 w-[min(100vw-2rem,24rem)] h-[min(100vh-8rem,36rem)] bg-paper border-2 border-black neo-shadow flex flex-col overflow-hidden ${
              isBlinking ? "chat-panel-blink" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black bg-paper-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 border-2 border-black bg-cyan flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-ink">Ask about Ranveer</h3>
                  <p className="text-xs text-ink-3 font-mono">Online · AI assistant</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 border-2 border-black ${
                        message.sender === "user"
                          ? "bg-cyan text-black neo-shadow-sm"
                          : "bg-paper-2 text-ink"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                      <p className="text-xs mt-1 opacity-60">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-paper-2 text-ink border-2 border-black px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t-2 border-black bg-paper">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={stopBlink}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 form-input !py-2"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-cyan hover:bg-cyan-dark text-black border-2 border-black shrink-0 rounded-none"
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

