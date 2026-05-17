import { readFileSync } from "fs"
import { join } from "path"
import MonolithArticleClient from "./article-client"

export default function MonolithVsMicroservicesArticle() {
  const html = readFileSync(
    join(
      process.cwd(),
      "content/blogs/system-design/monolithic-vs-microservices/article-body.html",
    ),
    "utf-8",
  )

  return <MonolithArticleClient html={html} />
}
