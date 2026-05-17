import type { ComponentType } from "react"
import type { BlogCategoryId } from "@/lib/blogs/types"
import MonolithVsMicroservicesArticle from "./system-design/monolithic-vs-microservices/article"

const customArticles: Record<string, ComponentType> = {
  "system-design/monolithic-vs-microservices": MonolithVsMicroservicesArticle,
}

export function getCustomArticle(
  categoryId: BlogCategoryId,
  slug: string,
): ComponentType | undefined {
  return customArticles[`${categoryId}/${slug}`]
}
