"use client"

import Link from "next/link"

const DOCK = [
  { href: "#home", label: "home" },
  { href: "#projects", label: "work" },
  { href: "#skills", label: "skills" },
  { href: "#contact", label: "mail" },
] as const

export default function MobileDock() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-paper-3 bg-paper/95 backdrop-blur-sm font-mono text-[11px]"
      aria-label="Quick navigation"
    >
      <ul className="flex justify-around py-2 px-2">
        {DOCK.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="px-3 py-1.5 text-ink-muted hover:text-accent border border-transparent hover:border-paper-3 transition-colors"
            >
              ./{item.label}
            </a>
          </li>
        ))}
        <li>
          <Link
            href="/blogs"
            className="px-3 py-1.5 text-ink-muted hover:text-accent-2 transition-colors"
          >
            ./blogs
          </Link>
        </li>
      </ul>
    </nav>
  )
}
