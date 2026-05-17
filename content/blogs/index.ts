import type { BlogCategoryId, BlogPost } from "@/lib/blogs/types"
import { systemDesignBlogs } from "./system-design"
import { machineLearningBlogs } from "./machine-learning"
import { artificialIntelligenceBlogs } from "./artificial-intelligence"
import { dsaBlogs } from "./dsa"

const categoryContent: Record<BlogCategoryId, { topics: BlogPost[] }> = {
  "system-design": systemDesignBlogs,
  "machine-learning": machineLearningBlogs,
  "artificial-intelligence": artificialIntelligenceBlogs,
  dsa: dsaBlogs,
}

export function getTopicsByCategory(categoryId: BlogCategoryId): BlogPost[] {
  return categoryContent[categoryId]?.topics ?? []
}

export function getPostBySlug(
  categoryId: BlogCategoryId,
  slug: string,
): BlogPost | undefined {
  return getTopicsByCategory(categoryId).find((topic) => topic.slug === slug)
}

export function getAllCategorySlugs(): BlogCategoryId[] {
  return Object.keys(categoryContent) as BlogCategoryId[]
}

export function getAllPostParams(): { category: BlogCategoryId; slug: string }[] {
  return getAllCategorySlugs().flatMap((category) =>
    getTopicsByCategory(category).map((topic) => ({
      category,
      slug: topic.slug,
    })),
  )
}
