import type { BlogCategoryContent } from "@/lib/blogs/types"
import { post as loadBalancerExplained } from "./load-balancer-explained/post"
import { post as monolithicVsMicroservices } from "./monolithic-vs-microservices/post"

export const systemDesignBlogs: BlogCategoryContent = {
  topics: [loadBalancerExplained, monolithicVsMicroservices],
}
