import { readFileSync } from "fs"
import { join } from "path"
import LoadBalancerArticleClient from "./article-client"

export default function LoadBalancerExplainedArticle() {
  const html = readFileSync(
    join(
      process.cwd(),
      "content/blogs/system-design/load-balancer-explained/article-body.html",
    ),
    "utf-8",
  )

  return <LoadBalancerArticleClient html={html} />
}
