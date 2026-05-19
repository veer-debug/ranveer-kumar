"use client"

import Link from "next/link"
import { ArrowUpRight, ArrowDown } from "lucide-react"
import { blogAuthor } from "@/lib/blogs/author"
import { siteTheme } from "@/lib/site-theme"
import SiteHeader from "@/components/site-header"

const TAGS = ["#AI/ML", "#RAG", "#Python", "#LLMs", "#FastAPI"]

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="bg-paper border-b-2 border-black">
      <SiteHeader />

      <div className="w-full max-w-6xl mx-auto px-[5%] lg:px-10 xl:px-14 py-14 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-start">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Hi, I&apos;m {blogAuthor.name.split(" ")[0]}
            </h1>
            <p className="font-mono text-base md:text-lg font-medium text-ink mb-6 max-w-xl">
              AI engineer. Product-minded builder. Shipping useful systems.
            </p>
            <p className="text-ink-3 text-base md:text-lg leading-relaxed max-w-xl mb-10">
              I work across the stack with Python, LangChain, FastAPI, and React — from RAG pipelines and
              LLM agents to APIs and deployment. Member of technical staff at Octro, building production AI
              systems.
            </p>

            <div className="flex flex-wrap gap-4">
              <button type="button" className={siteTheme.btnPrimary} onClick={() => scrollTo("projects")}>
                View projects
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <a href="/api/download-resume" download="Ranveer_Kumar_Resume.pdf" className={siteTheme.btnSecondary}>
                Download resume
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-2 lg:gap-3 lg:pt-2">
            {TAGS.map((tag) => (
              <span key={tag} className={siteTheme.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
