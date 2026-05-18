export interface BlogComment {
  id: string
  postId: string
  parentId?: string | null
  /** Handle without @, e.g. veer-debug */
  userId?: string
  displayName?: string
  /** @deprecated legacy field */
  name?: string
  message: string
  createdAt: string
}

export interface BlogEngagementData {
  views: Record<string, number>
  comments: Record<string, BlogComment[]>
}

export type CommentThread = BlogComment & {
  replies: BlogComment[]
}
