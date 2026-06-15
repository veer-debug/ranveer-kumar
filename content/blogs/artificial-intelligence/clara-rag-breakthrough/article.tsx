import { readFileSync } from "fs"
import { join } from "path"
import ClaraRagBreakthroughArticleClient from "./article-client"

export default function ClaraRagBreakthroughArticle() {
  const html = readFileSync(
    join(
      process.cwd(),
      "content/blogs/artificial-intelligence/clara-rag-breakthrough/article-body.html",
    ),
    "utf-8",
  )

  return <ClaraRagBreakthroughArticleClient html={html} />
}
