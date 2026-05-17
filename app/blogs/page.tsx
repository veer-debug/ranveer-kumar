"use client"

import { motion } from "framer-motion"
import BlogLayout from "@/components/blogs/blog-layout"
import CategoryCard from "@/components/blogs/category-card"
import { blogCategories } from "@/lib/blogs"
import { blogAuthor } from "@/lib/blogs/author"

export default function BlogsPage() {
  return (
    <BlogLayout backHref="/" backLabel="Back to Portfolio">
      <section className="px-4 py-12 pb-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <img
            src={blogAuthor.image}
            alt={blogAuthor.name}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-6 border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/20"
            width={80}
            height={80}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Blogs
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Notes on system design, machine learning, AI, and data structures & algorithms
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
