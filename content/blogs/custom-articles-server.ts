import type { ComponentType } from "react"
import type { BlogCategoryId } from "@/lib/blogs/types"
import LoadBalancerExplainedArticle from "./system-design/load-balancer-explained/article"
import MonolithVsMicroservicesArticle from "./system-design/monolithic-vs-microservices/article"

const customArticles: Record<string, ComponentType> = {
  "system-design/load-balancer-explained": LoadBalancerExplainedArticle,
  "system-design/monolithic-vs-microservices": MonolithVsMicroservicesArticle,
}

export function getCustomArticle(
  categoryId: BlogCategoryId,
  slug: string,
): ComponentType | undefined {
  return customArticles[`${categoryId}/${slug}`]
}
