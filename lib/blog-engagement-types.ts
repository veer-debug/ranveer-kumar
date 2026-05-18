export interface BlogComment {
  id: string
  postId: string
  name: string
  message: string
  createdAt: string
}

export interface BlogEngagementData {
  views: Record<string, number>
  comments: Record<string, BlogComment[]>
}
