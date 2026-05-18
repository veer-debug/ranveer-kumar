"use client"

import { motion } from "framer-motion"
import BlogLayout from "@/components/blogs/blog-layout"
import CategoryCard from "@/components/blogs/category-card"
import { blogCategories } from "@/lib/blogs"
import { blogAuthor } from "@/lib/blogs/author"

export default function BlogsPage() {
  return (
    <BlogLayout backHref="/" backLabel="Back to Portfolio">
      <section className="w-full max-w-6xl mx-auto px-[5%] lg:px-10 py-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <img
            src={blogAuthor.image}
            alt={blogAuthor.name}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-6 border-2 border-paper-3 shadow-md"
            width={80}
            height={80}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">
            Blogs
          </h1>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto">
            Longer write-ups on system design and ML — posted when I have something worth sharing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {blogCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>
    </BlogLayout>
  )
}
