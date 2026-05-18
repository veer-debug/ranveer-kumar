"use client"

import type { ReactNode } from "react"

interface TerminalWindowProps {
  title?: string
  children: ReactNode
  className?: string
  bodyClassName?: string
}

export default function TerminalWindow({
  title = "ranveer@portfolio",
  children,
  className = "",
  bodyClassName = "",
}: TerminalWindowProps) {
  return (
    <div className={`term-window ${className}`}>
      <div className="term-titlebar">
        <div className="flex gap-1.5">
          <span className="term-dot term-dot--red" />
          <span className="term-dot term-dot--yellow" />
          <span className="term-dot term-dot--green" />
        </div>
        <span className="term-title">{title}</span>
      </div>
      <div className={`term-body ${bodyClassName}`}>{children}</div>
    </div>
  )
}
