"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import type { BlogCategoryId, BlogPost } from "@/lib/blogs/types"

interface TopicCardProps {
  post: BlogPost
  categoryId: BlogCategoryId
  index: number
  gradient: string
}

export default function TopicCard({
  post,
  categoryId,
  index,
  gradient,
}: TopicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/blogs/${categoryId}/${post.slug}`}>
        <motion.article
          className="group relative p-6 rounded-2xl bg-paper border border-paper-3 shadow-sm hover:border-green/40 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.99 }}
        >
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />

          <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-green transition-colors pr-8">
            {post.title}
          </h3>

          <p className="text-ink-muted text-sm mb-4 line-clamp-2">{post.description}</p>

          <motion.div className="flex flex-wrap items-center gap-3 text-xs text-ink-faint">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-green-bg text-green text-xs border border-green/15"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1 text-teal opacity-0 group-hover:opacity-100 transition-opacity">
              Read
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        </motion.article>
      </Link>
    </motion.div>
  )
}
