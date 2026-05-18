"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { blogAuthor } from "@/lib/blogs/author"

const TREE = [
  { id: "home", href: "#home", label: "README.md", icon: "◆" },
  { id: "projects", href: "#projects", label: "projects/", icon: "▸" },
  { id: "experience", href: "#experience", label: "experience.log", icon: "▸" },
  { id: "skills", href: "#skills", label: "skills.json", icon: "▸" },
  { id: "about", href: "#about", label: "about.txt", icon: "▸" },
  { id: "contact", href: "#contact", label: "contact.sh", icon: "▸" },
  { id: "resume", href: "#resume", label: "resume.pdf", icon: "▸" },
] as const

export default function SidebarNav() {
  const [active, setActive] = useState("home")

  useEffect(() => {
    const ids = TREE.map((t) => t.id)
    const observers: IntersectionObserver[] = []

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <aside className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 border-r border-paper-3 bg-paper-2/80 sticky top-0 h-screen z-30">
      <div className="p-4 border-b border-paper-3">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src={blogAuthor.image}
            alt={blogAuthor.name}
            className="w-10 h-10 rounded-sm object-cover border border-paper-3 group-hover:border-accent transition-colors"
            width={40}
            height={40}
          />
          <div className="min-w-0 text-xs leading-tight">
            <p className="text-accent truncate font-bold">{blogAuthor.name}</p>
            <p className="text-ink-muted truncate">AI / ML Developer</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto font-mono text-xs" aria-label="Section navigation">
        <p className="term-comment px-2 mb-2">~/portfolio</p>
        <ul className="space-y-0.5">
          {TREE.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`flex items-center gap-2 px-2 py-1.5 border transition-colors ${
                    isActive
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-transparent text-ink-muted hover:text-accent hover:border-paper-3"
                  }`}
                >
                  <span className="text-accent-2 w-3">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
        <div className="mt-4 px-2 pt-3 border-t border-paper-3">
          <Link
            href="/blogs"
            className="flex items-center gap-2 px-2 py-1.5 text-ink-muted hover:text-accent-2 transition-colors"
          >
            <span className="text-accent-2">→</span> ./blogs/
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-paper-3 text-[10px] text-ink-muted space-y-1">
        <p>
          <span className="text-brand-green">●</span> online
        </p>
        <p className="term-comment">v2.0 · tmux session 0</p>
      </div>
    </aside>
  )
}
