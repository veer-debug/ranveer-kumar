import { readFileSync } from "fs"
import { join } from "path"
import RagHallucinationArticleClient from "./article-client"

export default function RagHallucinationExplainedArticle() {
  const html = readFileSync(
    join(
      process.cwd(),
      "content/blogs/artificial-intelligence/rag-hallucination-explained/article-body.html",
    ),
    "utf-8",
  )

  return <RagHallucinationArticleClient html={html} />
}
