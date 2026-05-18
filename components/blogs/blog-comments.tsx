"use client"

import { useEffect, useState } from "react"
import { Loader2, MessageSquare, Send } from "lucide-react"
import { siteTheme } from "@/lib/site-theme"
import type { BlogComment } from "@/lib/blog-engagement-types"

type BlogCommentsProps = {
  postId: string
}

export default function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`/api/blog/comments?postId=${encodeURIComponent(postId)}`)
        if (!res.ok) throw new Error("Failed to load")
        const data = (await res.json()) as { comments: BlogComment[] }
        if (!cancelled) setComments(data.comments ?? [])
      } catch {
        if (!cancelled) setError("Could not load comments.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)

    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, name, message }),
      })

      const data = (await res.json()) as { comments?: BlogComment[]; error?: string }

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to post comment")
      }

      setComments(data.comments ?? [])
      setName("")
      setMessage("")
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 pt-10 border-t-2 border-black" aria-labelledby="blog-comments-heading">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5" aria-hidden />
        <h2 id="blog-comments-heading" className="text-xl font-bold text-ink">
          Comments
        </h2>
        <span className="font-mono text-xs text-ink-3">({comments.length})</span>
      </div>

      <form onSubmit={handleSubmit} className="editorial-card p-5 md:p-6 mb-8 space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-ink-3">Leave a comment</p>
        <div>
          <label htmlFor="comment-name" className={siteTheme.formLabel}>
            Name
          </label>
          <input
            id="comment-name"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={siteTheme.formInput}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="comment-message" className={siteTheme.formLabel}>
            Message
          </label>
          <textarea
            id="comment-message"
            required
            minLength={3}
            maxLength={2000}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${siteTheme.formInput} form-textarea`}
            placeholder="Share your thoughts…"
          />
        </div>
        {error && (
          <p className="font-mono text-sm border-2 border-black bg-paper-2 px-3 py-2">{error}</p>
        )}
        {success && (
          <p className="font-mono text-sm border-2 border-black bg-cyan/30 px-3 py-2">
            Comment posted — thanks!
          </p>
        )}
        <button type="submit" disabled={submitting} className={siteTheme.btnPrimary}>
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </form>

      {loading ? (
        <p className="font-mono text-sm text-ink-3 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading comments…
        </p>
      ) : comments.length === 0 ? (
        <p className="font-mono text-sm text-ink-3">No comments yet — be the first.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="editorial-card p-4 md:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <p className="font-bold text-ink">{comment.name}</p>
                <time
                  dateTime={comment.createdAt}
                  className="font-mono text-[10px] uppercase tracking-wider text-ink-3"
                >
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="text-ink-3 text-sm leading-relaxed whitespace-pre-wrap">{comment.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
