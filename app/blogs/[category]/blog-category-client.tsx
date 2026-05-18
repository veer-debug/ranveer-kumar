"use client"

import { motion } from "framer-motion"
import BlogLayout from "@/components/blogs/blog-layout"
import TopicCard from "@/components/blogs/topic-card"
import BlogVisitorCount from "@/components/blogs/blog-visitor-count"
import { blogAuthor } from "@/lib/blogs/author"
import { getPostId } from "@/lib/blog-ids"
import type { BlogCategory, BlogPost } from "@/lib/blogs/types"

interface BlogCategoryPageProps {
  category: BlogCategory
  topics: BlogPost[]
}

export default function BlogCategoryPage({ category, topics }: BlogCategoryPageProps) {
  return (
    <BlogLayout backHref="/blogs" backLabel="All Categories">
      <section className="w-full max-w-6xl mx-auto px-[5%] lg:px-10 py-12 pb-24">
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
              className="w-11 h-11 rounded-full object-cover border-2 border-paper-3"
              width={44}
              height={44}
            />
            <div>
              <p className="text-ink font-medium text-sm">{blogAuthor.name}</p>
              <p className="text-ink-faint text-xs">{blogAuthor.role}</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-ink">
            {category.title}
          </h1>
          <p className="text-ink-muted">{category.description}</p>
          <div className="mt-4">
            <BlogVisitorCount postId={getPostId(category.id)} trackView />
          </div>
        </motion.div>

        {topics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-paper-3 bg-paper-2 p-10 text-center"
          >
            <p className="text-ink-muted mb-2">No topics published yet.</p>
            <p className="text-ink-faint text-sm">
              Add a folder under{" "}
              <code className="text-green">content/blogs/{category.id}/</code> and
              register it in{" "}
              <code className="text-green">index.ts</code>.
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
