import { blogAuthor } from "@/lib/blogs/author"
import type { BlogComment, CommentThread } from "@/lib/blog-engagement-types"

/** Normalize input to a handle without @ (lowercase, hyphenated). */
export function normalizeUserId(raw: string): string {
  return raw
    .trim()
    .replace(/^@/, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32)
}

/** Display as @handle */
export function formatUserId(handle: string): string {
  const normalized = normalizeUserId(handle)
  return normalized ? `@${normalized}` : "@guest"
}

export function getCommentUserId(comment: BlogComment): string {
  if (comment.userId) return formatUserId(comment.userId)
  if (comment.name) return formatUserId(comment.name)
  return "@guest"
}

export function getCommentHandle(comment: BlogComment): string {
  return comment.userId ?? (comment.name ? normalizeUserId(comment.name) : "guest")
}

export function isAuthorHandle(handle: string): boolean {
  return normalizeUserId(handle) === normalizeUserId(blogAuthor.userId)
}

export function isAuthorComment(comment: BlogComment): boolean {
  return isAuthorHandle(getCommentHandle(comment))
}

export function displayNameFromUserId(userId: string): string {
  return userId
    .split(/[-._]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function getCommentDisplayName(comment: BlogComment): string {
  if (comment.displayName?.trim()) return comment.displayName.trim()
  if (comment.name && !comment.name.includes("-") && comment.name.length > 1) {
    return comment.name.trim()
  }
  const handle = getCommentHandle(comment)
  return displayNameFromUserId(handle)
}

export function getCommentInitial(comment: BlogComment): string {
  const name = getCommentDisplayName(comment)
  return (name.charAt(0) || "?").toUpperCase()
}

export function getCommentAvatarSrc(comment: BlogComment): string | null {
  if (isAuthorComment(comment)) return blogAuthor.image
  return null
}

export function buildCommentThreads(comments: BlogComment[]): CommentThread[] {
  const repliesByParent = new Map<string, BlogComment[]>()

  for (const comment of comments) {
    if (!comment.parentId) continue
    const list = repliesByParent.get(comment.parentId) ?? []
    list.push(comment)
    repliesByParent.set(comment.parentId, list)
  }

  for (const list of repliesByParent.values()) {
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  return comments
    .filter((c) => !c.parentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((comment) => ({
      ...comment,
      replies: repliesByParent.get(comment.id) ?? [],
    }))
}

export function countAllComments(comments: BlogComment[]): number {
  return comments.length
}
