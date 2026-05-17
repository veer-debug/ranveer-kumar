"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { getFloatingParticles } from "@/lib/particle-positions"

const BLOG_PARTICLES = getFloatingParticles(30)

interface BlogLayoutProps {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}

export default function BlogLayout({
  children,
  backHref = "/",
  backLabel = "Back to Portfolio",
}: BlogLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen bg-black text-white overflow-hidden"
    >
      <motion.div
        className="fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))",
              "linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </motion.div>

      <div className="fixed inset-0 z-10 pointer-events-none">
        {BLOG_PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: `${particle.initialX}vw`,
              y: `${particle.initialY}vh`,
            }}
            animate={{
              x: `${particle.animateX}vw`,
              y: `${particle.animateY}vh`,
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-30 px-4 pt-8 max-w-5xl mx-auto"
      >
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </Link>
      </motion.div>

      <div className="relative z-20">{children}</div>
    </motion.div>
  )
}
