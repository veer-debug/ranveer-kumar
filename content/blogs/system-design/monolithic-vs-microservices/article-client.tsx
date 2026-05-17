"use client"

import { useEffect } from "react"
import "./article.css"

interface MonolithArticleClientProps {
  html: string
}

export default function MonolithArticleClient({ html }: MonolithArticleClientProps) {
  useEffect(() => {
    document.body.classList.add("monolith-blog-active")
    document.documentElement.style.scrollBehavior = "smooth"

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
      document.body.classList.remove("monolith-blog-active")
      document.documentElement.style.scrollBehavior = ""
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div
        className="monolith-blog-page"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
