"use client"

import { motion } from "framer-motion"
import BlogLayout from "@/components/blogs/blog-layout"
import TopicCard from "@/components/blogs/topic-card"
import { blogAuthor } from "@/lib/blogs/author"
import type { BlogCategory, BlogPost } from "@/lib/blogs/types"

interface BlogCategoryPageProps {
  category: BlogCategory
  topics: BlogPost[]
}

export default function BlogCategoryPage({ category, topics }: BlogCategoryPageProps) {
  return (
    <BlogLayout backHref="/blogs" backLabel="All Categories">
      <section className="px-4 py-12 pb-24 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <img
              src={blogAuthor.image}
              alt={blogAuthor.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-gray-700/80"
              width={44}
              height={44}
            />
            <div>
              <p className="text-white font-medium text-sm">{blogAuthor.name}</p>
              <p className="text-gray-500 text-xs">{blogAuthor.role}</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {category.title}
          </h1>
          <p className="text-gray-400">{category.description}</p>
        </motion.div>

        {topics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-gray-700/80 bg-gray-900/30 p-10 text-center"
          >
            <p className="text-gray-400 mb-2">No topics published yet.</p>
            <p className="text-gray-500 text-sm">
              Add a folder under{" "}
              <code className="text-cyan-400/90">content/blogs/{category.id}/</code> and
              register it in{" "}
              <code className="text-cyan-400/90">index.ts</code>.
            </p>
          </motion.div>
        ) : (
          <motion.div className="space-y-4">
            {topics.map((post, index) => (
              <TopicCard
                key={post.slug}
                post={post}
                categoryId={category.id}
                index={index}
                gradient={category.gradient}
              />
            ))}
          </motion.div>
        )}
      </section>
    </BlogLayout>
  )
}
