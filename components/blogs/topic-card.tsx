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
          className="group relative p-6 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.99 }}
        >
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />

          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors pr-8">
            {post.title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.description}</p>

          <motion.div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
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
                className="px-2 py-0.5 rounded-full bg-gray-800/80 text-gray-400 border border-gray-700/50"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Read
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        </motion.article>
      </Link>
    </motion.div>
  )
}
