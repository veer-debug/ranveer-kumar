export type BlogCategoryId =
  | "system-design"
  | "machine-learning"
  | "artificial-intelligence"
  | "dsa"

export interface BlogCategory {
  id: BlogCategoryId
  title: string
  description: string
  icon: string
  gradient: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt?: string
  tags?: string[]
  content?: string
  hasCustomArticle?: boolean
}

export interface BlogCategoryContent {
  topics: BlogPost[]
}
