"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import BlogLayout from "@/components/blogs/blog-layout"
import BlogContent from "@/components/blogs/blog-content"
import type { BlogCategory, BlogPost } from "@/lib/blogs/types"

interface BlogPostPageProps {
  category: BlogCategory
  post: BlogPost
}

export default function BlogPostPage({ category, post }: BlogPostPageProps) {
  return (
    <BlogLayout backHref={`/blogs/${category.id}`} backLabel={category.title}>
      <article className="px-4 py-12 pb-24 max-w-3xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{post.title}</h1>
          <p className="text-gray-400 text-lg mb-4">{post.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-gray-800/80 text-gray-400 border border-gray-700/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm p-6 md:p-8"
        >
          <BlogContent content={post.content ?? ""} />
        </motion.div>
      </article>
    </BlogLayout>
  )
}
