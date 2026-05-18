"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, MessageSquare, Reply, Send, X } from "lucide-react"
import { siteTheme } from "@/lib/site-theme"
import { blogAuthor } from "@/lib/blogs/author"
import {
  buildCommentThreads,
  countAllComments,
  formatUserId,
  getCommentAvatarSrc,
  getCommentDisplayName,
  getCommentInitial,
  getCommentUserId,
  isAuthorComment,
  normalizeUserId,
} from "@/lib/blog-comment-utils"
import type { BlogComment } from "@/lib/blog-engagement-types"

const USER_ID_STORAGE_KEY = "blog-comment-user-id"
const DISPLAY_NAME_STORAGE_KEY = "blog-comment-display-name"

type BlogCommentsProps = {
  postId: string
}

type CommentFormProps = {
  postId: string
  parentId?: string | null
  replyingTo?: string
  userId: string
  displayName: string
  onUserIdChange: (v: string) => void
  onDisplayNameChange: (v: string) => void
  onSuccess: (comments: BlogComment[]) => void
  onCancel?: () => void
  compact?: boolean
}

function CommentAvatar({ comment, size = "md" }: { comment: BlogComment; size?: "md" | "sm" }) {
  const src = getCommentAvatarSrc(comment)
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-11 h-11 text-sm"
  const author = isAuthorComment(comment)

  if (src) {
    return (
      <img
        src={src}
        alt={getCommentDisplayName(comment)}
        className={`${dim} shrink-0 border-2 border-black object-cover object-top neo-shadow-sm`}
        width={size === "sm" ? 32 : 44}
        height={size === "sm" ? 32 : 44}
      />
    )
  }

  return (
    <div
      className={`${dim} shrink-0 border-2 border-black flex items-center justify-center font-mono font-bold neo-shadow-sm ${
        author ? "bg-cyan text-black" : "bg-paper-2 text-ink"
      }`}
      aria-hidden
    >
      {getCommentInitial(comment)}
    </div>
  )
}

function CommentForm({
  postId,
  parentId = null,
  replyingTo,
  userId,
  displayName,
  onUserIdChange,
  onDisplayNameChange,
  onSuccess,
  onCancel,
  compact = false,
}: CommentFormProps) {
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const normalized = normalizeUserId(userId)
    if (!normalized) {
      setError("Enter a valid user ID")
      setSubmitting(false)
      return
    }

    if (!displayName.trim()) {
      setError("Enter your name")
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          parentId,
          userId: normalized,
          displayName: displayName.trim(),
          message,
        }),
      })

      const data = (await res.json()) as { comments?: BlogComment[]; error?: string }
      if (!res.ok) throw new Error(data.error ?? "Failed to post")

      localStorage.setItem(USER_ID_STORAGE_KEY, normalized)
      localStorage.setItem(DISPLAY_NAME_STORAGE_KEY, displayName.trim())
      setMessage("")
      onSuccess(data.comments ?? [])
      onCancel?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-3 ${compact ? "mt-3 p-4 border-2 border-black bg-paper-2" : ""}`}
    >
      {replyingTo && (
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
          Replying to {replyingTo}
        </p>
      )}

      {!compact && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={parentId ? `reply-name-${parentId}` : "comment-name"} className={siteTheme.formLabel}>
              Name
            </label>
            <input
              id={parentId ? `reply-name-${parentId}` : "comment-name"}
              type="text"
              required
              maxLength={80}
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              className={siteTheme.formInput}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor={parentId ? `reply-id-${parentId}` : "comment-user-id"} className={siteTheme.formLabel}>
              User ID
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border-2 border-r-0 border-black bg-paper-2 font-mono text-sm font-bold">
                @
              </span>
              <input
                id={parentId ? `reply-id-${parentId}` : "comment-user-id"}
                type="text"
                required
                maxLength={32}
                pattern="[a-zA-Z0-9._-]+"
                value={userId.replace(/^@/, "")}
                onChange={(e) => onUserIdChange(e.target.value.replace(/^@/, ""))}
                className={`${siteTheme.formInput} !rounded-none flex-1 !border-l-0`}
                placeholder="veer-debug"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor={parentId ? `reply-msg-${parentId}` : "comment-message"}
          className={siteTheme.formLabel}
        >
          {compact ? "Reply" : "Comment"}
        </label>
        <textarea
          id={parentId ? `reply-msg-${parentId}` : "comment-message"}
          required
          minLength={3}
          maxLength={2000}
          rows={compact ? 3 : 4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${siteTheme.formInput} form-textarea text-sm`}
          placeholder={compact ? "Write a reply…" : "Share your thoughts on this post…"}
        />
      </div>

      {error && (
        <p className="font-mono text-xs border-2 border-black bg-paper-2 px-2 py-1.5">{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={submitting} className={`${siteTheme.btnPrimary} !py-2 !px-4 text-xs`}>
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          {submitting ? "Posting…" : parentId ? "Post reply" : "Post comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`${siteTheme.btnSecondary} !py-2 !px-4 text-xs`}
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function CommentItem({
  comment,
  postId,
  userId,
  displayName,
  onUserIdChange,
  onDisplayNameChange,
  onCommentsUpdate,
  isReply = false,
}: {
  comment: BlogComment
  postId: string
  userId: string
  displayName: string
  onUserIdChange: (v: string) => void
  onDisplayNameChange: (v: string) => void
  onCommentsUpdate: (comments: BlogComment[]) => void
  isReply?: boolean
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const author = isAuthorComment(comment)
  const name = getCommentDisplayName(comment)
  const handle = getCommentUserId(comment)

  return (
    <article className={isReply ? "ml-6 md:ml-10 pl-4 border-l-2 border-black" : ""}>
      <div className="flex gap-3 items-start">
        <CommentAvatar comment={comment} size={isReply ? "sm" : "md"} />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
            <span className="font-bold text-ink text-sm md:text-base">{name}</span>
            <span className="font-mono text-xs text-ink-3">{handle}</span>
            {author && (
              <span className="font-mono text-[10px] uppercase tracking-wider border-2 border-black bg-cyan/40 px-1.5 py-0.5">
                author
              </span>
            )}
            <time
              dateTime={comment.createdAt}
              className="font-mono text-[10px] uppercase tracking-wider text-ink-3 ml-auto"
            >
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <p className="text-ink text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words mb-2">
            {comment.message}
          </p>

          {!isReply && (
            <button
              type="button"
              onClick={() => setReplyOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:underline"
            >
              <Reply className="w-3.5 h-3.5" />
              {replyOpen ? "Cancel reply" : "Reply"}
            </button>
          )}

          {replyOpen && (
            <CommentForm
              postId={postId}
              parentId={comment.id}
              replyingTo={name}
              userId={userId}
              displayName={displayName}
              onUserIdChange={onUserIdChange}
              onDisplayNameChange={onDisplayNameChange}
              onSuccess={(updated) => {
                onCommentsUpdate(updated)
                setReplyOpen(false)
              }}
              onCancel={() => setReplyOpen(false)}
              compact
            />
          )}
        </div>
      </div>
    </article>
  )
}

export default function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [userId, setUserId] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const threads = useMemo(() => buildCommentThreads(comments), [comments])
  const totalCount = useMemo(() => countAllComments(comments), [comments])

  const loadComments = useCallback(async () => {
    const res = await fetch(`/api/blog/comments?postId=${encodeURIComponent(postId)}`)
    if (!res.ok) throw new Error("Failed to load")
    const data = (await res.json()) as { comments: BlogComment[] }
    return data.comments ?? []
  }, [postId])

  useEffect(() => {
    const savedId = localStorage.getItem(USER_ID_STORAGE_KEY)
    const savedName = localStorage.getItem(DISPLAY_NAME_STORAGE_KEY)
    if (savedId) setUserId(savedId)
    if (savedName) setDisplayName(savedName)
    else if (savedId) setDisplayName(blogAuthor.name.split(" ")[0] ? blogAuthor.name : "")
  }, [])

  useEffect(() => {
    let cancelled = false
    loadComments()
      .then((list) => {
        if (!cancelled) setComments(list)
      })
      .catch(() => {
        if (!cancelled) setError("Could not load comments.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [loadComments])

  const handleCommentsUpdate = (updated: BlogComment[]) => {
    setComments(updated)
  }

  return (
    <section
      id="comments"
      className="mt-14 pt-12 border-t-2 border-black"
      aria-labelledby="blog-comments-heading"
    >
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-5 h-5" aria-hidden />
        <h2 id="blog-comments-heading" className="text-2xl font-bold text-ink">
          Discussion
        </h2>
        <span className="font-mono text-xs text-ink-3">
          ({totalCount} {totalCount === 1 ? "comment" : "comments"})
        </span>
      </div>
      <p className="font-mono text-xs text-ink-3 mb-8">
        Comments appear below the article. Reply to join the thread.
      </p>

      {loading ? (
        <p className="font-mono text-sm text-ink-3 flex items-center gap-2 mb-10">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading comments…
        </p>
      ) : error ? (
        <p className="font-mono text-sm text-ink-3 mb-10">{error}</p>
      ) : threads.length === 0 ? (
        <p className="font-mono text-sm text-ink-3 mb-10 border-2 border-dashed border-black/30 p-6 text-center">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="space-y-8 mb-12">
          {threads.map((thread) => (
            <li key={thread.id} className="editorial-card p-5 md:p-6 space-y-4">
              <CommentItem
                comment={thread}
                postId={postId}
                userId={userId}
                displayName={displayName}
                onUserIdChange={setUserId}
                onDisplayNameChange={setDisplayName}
                onCommentsUpdate={handleCommentsUpdate}
              />
              {thread.replies.length > 0 && (
                <ul className="space-y-5 pt-2">
                  {thread.replies.map((reply) => (
                    <li key={reply.id}>
                      <CommentItem
                        comment={reply}
                        postId={postId}
                        userId={userId}
                        displayName={displayName}
                        onUserIdChange={setUserId}
                        onDisplayNameChange={setDisplayName}
                        onCommentsUpdate={handleCommentsUpdate}
                        isReply
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="editorial-card p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5 pb-5 border-b-2 border-black">
          <div className="w-11 h-11 border-2 border-black bg-cyan overflow-hidden neo-shadow-sm">
            {userId && normalizeUserId(userId) === normalizeUserId(blogAuthor.userId) ? (
              <img
                src={blogAuthor.image}
                alt=""
                className="w-full h-full object-cover object-top"
                width={44}
                height={44}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono font-bold text-sm">
                {(displayName.charAt(0) || userId.charAt(0) || "U").toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">Add a comment</p>
            <p className="font-bold text-ink">
              {displayName.trim() || "Your name"}{" "}
              <span className="font-mono text-sm font-normal text-ink-3">
                ({userId.trim() ? formatUserId(userId) : "@your-id"})
              </span>
            </p>
          </div>
        </div>

        <CommentForm
          postId={postId}
          userId={userId}
          displayName={displayName}
          onUserIdChange={setUserId}
          onDisplayNameChange={setDisplayName}
          onSuccess={handleCommentsUpdate}
        />
      </div>
    </section>
  )
}
