"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/blogs", label: "Blog", isRoute: true },
  { href: "/#contact", label: "Contact", highlight: true },
]

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const linkClass = (highlight?: boolean, mobile = false) => {
    const base = mobile
      ? "block px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider"
      : "font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-2 py-1"
    if (highlight) {
      return `${base} nav-contact-box text-ink`
    }
    return `${base} text-ink hover:underline`
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-paper border-b-2 border-black">
      <div className="w-full px-[5%] lg:px-10 xl:px-14 py-4 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="text-lg sm:text-xl font-bold lowercase tracking-tight shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          ranveer.dev
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {NAV_LINKS.map((link) =>
            link.isRoute ? (
              <Link key={link.href} href={link.href} className={linkClass(link.highlight)}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className={linkClass(link.highlight)}>
                {link.label}
              </a>
            ),
          )}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 border-2 border-black neo-shadow-sm bg-paper"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden w-full border-t-2 border-black bg-paper px-[5%] py-4 space-y-2">
          {NAV_LINKS.map((link) =>
            link.isRoute ? (
              <Link key={link.href} href={link.href} className={linkClass(link.highlight, true)} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className={linkClass(link.highlight, true)} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ),
          )}
        </nav>
      )}
    </header>
  )
}
