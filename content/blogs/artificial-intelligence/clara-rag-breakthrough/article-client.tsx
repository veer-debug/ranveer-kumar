"use client"

import { useEffect } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import Chatbot from "@/components/chatbot"
import BlogComments from "@/components/blogs/blog-comments"
import BlogVisitorCount from "@/components/blogs/blog-visitor-count"
import { getPostId } from "@/lib/blog-ids"
import { siteTheme } from "@/lib/site-theme"
import "../../system-design/monolithic-vs-microservices/article.css"

interface ClaraRagBreakthroughArticleClientProps {
  html: string
}

const POST_ID = getPostId("artificial-intelligence", "clara-rag-breakthrough")

export default function ClaraRagBreakthroughArticleClient({ html }: ClaraRagBreakthroughArticleClientProps) {
  useEffect(() => {
    const onScroll = () => {
      const bar = document.getElementById("progress-bar")
      if (!bar) return
      const doc = document.documentElement
      const scrolled = doc.scrollTop
      const total = doc.scrollHeight - doc.clientHeight
      bar.style.width = `${total > 0 ? (scrolled / total) * 100 : 0}%`
    }

    window.addEventListener("scroll", onScroll)
    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className={`min-h-screen flex flex-col ${siteTheme.page}`}>
      <SiteHeader />

      <div className="w-full border-b border-paper-3 bg-paper-2">
        <div className="w-full px-[5%] lg:px-10 xl:px-14 py-3">
          <a href="/blogs/artificial-intelligence" className="text-sm font-medium text-ink-muted hover:text-green transition-colors">
            ← Artificial Intelligence
          </a>
        </div>
      </div>

      <main className="flex-1 w-full">
        <div className="w-full max-w-3xl mx-auto px-[5%] lg:px-10 pt-6">
          <BlogVisitorCount postId={POST_ID} trackView />
        </div>
        <div
          className="monolith-blog-page"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="w-full max-w-3xl mx-auto px-[5%] lg:px-10 pb-24">
          <BlogComments postId={POST_ID} />
        </div>
      </main>

      <SiteFooter />
      <Chatbot />
    </div>
  )
}
