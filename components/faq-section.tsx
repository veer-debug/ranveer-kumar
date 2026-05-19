"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import SectionHeader from "@/components/editorial/section-header"
import { siteTheme } from "@/lib/site-theme"

const FAQS = [
  {
    q: "What do you actually build?",
    a: "Usually Python services plus a model piece: RAG over docs, a vision pipeline, or an agent wired to APIs.",
  },
  {
    q: "Remote or on-site?",
    a: "Both. I've done remote for a US startup and on-site in Noida.",
  },
  {
    q: "How fast do you reply?",
    a: "Email and the form below — typically within a day or two.",
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className={`py-20 md:py-24 px-[5%] ${siteTheme.sectionAlt}`}>
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="Questions"
          title="Before you email"
          subtitle="Common things people ask — saves us both a round trip."
          align="left"
          className="!mx-0"
        />

        <ul className="space-y-2">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={item.q} className="editorial-card overflow-hidden !rounded-lg">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left font-medium text-ink hover:bg-paper-2/80 transition-colors"
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <ChevronDown
                    className={`w-4 h-4 text-ink-faint shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="px-4 pb-4 text-ink-muted text-sm leading-relaxed">
                    {item.a}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
