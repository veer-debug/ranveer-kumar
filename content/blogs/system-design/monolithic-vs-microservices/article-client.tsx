"use client"

import { useEffect } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import Chatbot from "@/components/chatbot"
import { siteTheme } from "@/lib/site-theme"
import "./article.css"

interface MonolithArticleClientProps {
  html: string
}

export default function MonolithArticleClient({ html }: MonolithArticleClientProps) {
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
      <SiteHeader variant="default" />

      <div className="w-full border-b border-paper-3 bg-paper-2">
        <div className="w-full px-[5%] lg:px-10 xl:px-14 py-3">
          <a href="/blogs/system-design" className="text-sm font-medium text-ink-muted hover:text-green transition-colors">
            ← System Design
          </a>
        </div>
      </div>

      <main className="flex-1 w-full">
        <div className="monolith-blog-page" dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <SiteFooter />
      <Chatbot />
    </div>
  )
}
