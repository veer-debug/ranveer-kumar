"use client"

import { useEffect, useState } from "react"
import { Eye, Users } from "lucide-react"

type BlogVisitorCountProps = {
  postId?: string
  trackView?: boolean
  variant?: "post" | "total"
  className?: string
}

function formatCount(count: number): string {
  return new Intl.NumberFormat("en-US").format(count)
}

export default function BlogVisitorCount({
  postId,
  trackView = false,
  variant = "post",
  className = "",
}: BlogVisitorCountProps) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (trackView && postId) {
          const sessionKey = `blog-viewed-${postId}`
          if (!sessionStorage.getItem(sessionKey)) {
            await fetch("/api/blog/views", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ postId }),
            })
            sessionStorage.setItem(sessionKey, "1")
          }
        }

        const query =
          variant === "total"
            ? "/api/blog/views?total=true"
            : `/api/blog/views?postId=${encodeURIComponent(postId ?? "")}`

        const res = await fetch(query)
        if (!res.ok) return

        const data = (await res.json()) as { views?: number; total?: number }
        if (!cancelled) {
          setCount(variant === "total" ? (data.total ?? 0) : (data.views ?? 0))
        }
      } catch {
        if (!cancelled) setCount(0)
      }
    }

    if (variant === "total" || postId) {
      load()
    }

    return () => {
      cancelled = true
    }
  }, [postId, trackView, variant])

  const Icon = variant === "total" ? Users : Eye
  const label =
    variant === "total"
      ? count === null
        ? "Loading visitors…"
        : `${formatCount(count)} total visitors`
      : count === null
        ? "Loading views…"
        : `${formatCount(count)} ${count === 1 ? "view" : "views"}`

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-3 ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden />
      {label}
    </span>
  )
}
