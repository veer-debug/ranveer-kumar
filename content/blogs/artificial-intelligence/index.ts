import type { BlogCategoryContent } from "@/lib/blogs/types"
import { post as claraRagBreakthroughPost } from "./clara-rag-breakthrough/post"
import { post as ragHallucinationPost } from "./rag-hallucination-explained/post"

export const artificialIntelligenceBlogs: BlogCategoryContent = {
  topics: [claraRagBreakthroughPost, ragHallucinationPost],
}
