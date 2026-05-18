"use client"

import { useMemo } from "react"
import { getExperienceSummary } from "@/lib/experiences"

export default function AboutTotalExperience() {
  const summary = useMemo(() => getExperienceSummary(), [])

  return (
    <div className="mt-8 grid sm:grid-cols-3 gap-3 md:gap-4 max-w-2xl">
      <div className="editorial-card p-4 bg-paper">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3 mb-2">Total</p>
        <p className="font-bold text-ink text-sm leading-snug">{summary.total}</p>
      </div>
      <div className="editorial-card p-4 bg-cyan/25">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3 mb-2">Full-time</p>
        <p className="font-bold text-ink text-sm leading-snug">{summary.fulltime}</p>
      </div>
      <div className="editorial-card p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3 mb-2">Internships</p>
        <p className="font-bold text-ink text-sm leading-snug">{summary.internship}</p>
      </div>
    </div>
  )
}
