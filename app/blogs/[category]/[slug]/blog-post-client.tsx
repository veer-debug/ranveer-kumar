"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import BlogLayout from "@/components/blogs/blog-layout"
import BlogContent from "@/components/blogs/blog-content"
import { blogAuthor } from "@/lib/blogs/author"
import type { BlogCategory, BlogPost } from "@/lib/blogs/types"

interface BlogPostPageProps {
  category: BlogCategory
  post: BlogPost
}

export default function BlogPostPage({ category, post }: BlogPostPageProps) {
  return (
    <BlogLayout backHref={`/blogs/${category.id}`} backLabel={category.title}>
      <article className="w-full max-w-3xl mx-auto px-[5%] lg:px-10 py-12 pb-24">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <img
              src={blogAuthor.image}
              alt={blogAuthor.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-paper-3"
              width={48}
              height={48}
            />
            <div>
              <p className="text-ink font-semibold">{blogAuthor.name}</p>
              <p className="text-ink-muted text-sm">{blogAuthor.role}</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-ink">{post.title}</h1>
          <p className="text-ink-muted text-lg mb-4">{post.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-faint">
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
                className="px-2.5 py-1 rounded-full bg-green-bg text-green text-xs border border-green/15"
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
          className="rounded-2xl border border-paper-3 bg-paper p-6 md:p-8 shadow-sm"
        >
          <BlogContent content={post.content ?? ""} />
        </motion.div>
      </article>
    </BlogLayout>
  )
}
