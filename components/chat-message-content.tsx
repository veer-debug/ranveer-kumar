"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import { cn } from "@/lib/utils"

type ChatMessageContentProps = {
  text: string
  className?: string
}

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold underline decoration-2 underline-offset-2 hover:text-cyan-dark break-all"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className?.includes("language-"))
    if (isBlock) {
      return (
        <code
          className={cn(
            "block my-2 p-2 font-mono text-[11px] bg-paper border border-black overflow-x-auto whitespace-pre-wrap",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code
        className="px-1 py-0.5 font-mono text-[11px] bg-paper border border-black"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }) => <pre className="my-2 overflow-x-auto">{children}</pre>,
  h1: ({ children }) => (
    <p className="mb-2 font-bold text-sm leading-snug">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="mb-2 font-bold text-sm leading-snug">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="mb-1.5 font-semibold text-xs sm:text-sm leading-snug">
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-black pl-3 italic text-ink-3">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-t-2 border-black/20" />,
}

export function ChatMessageContent({ text, className }: ChatMessageContentProps) {
  if (!text.trim()) return null

  return (
    <div
      className={cn(
        "chat-prose text-xs sm:text-sm text-ink break-words",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {text}
      </ReactMarkdown>
    </div>
  )
}
