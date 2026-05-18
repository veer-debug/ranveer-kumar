"use client"

import { useEffect, useState } from "react"

export default function AnimatedCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", updateMousePosition)

    const interactiveElements = document.querySelectorAll("button, a, .interactive")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-screen"
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
      }}
    >
      <div
        className={`bg-accent transition-all duration-150 ${isHovering ? "w-3 h-6" : "w-2.5 h-4"}`}
        style={{ marginLeft: -4, marginTop: -8 }}
        aria-hidden
      />
    </div>
  )
}
