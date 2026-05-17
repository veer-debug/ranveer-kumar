"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { BlogCategory } from "@/lib/blogs/types"
import { getTopicsByCategory } from "@/lib/blogs"

interface CategoryCardProps {
  category: BlogCategory
  index: number
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const topicCount = getTopicsByCategory(category.id).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blogs/${category.id}`}>
        <motion.div
          className="group relative p-6 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />

          <motion.div
            className="text-4xl mb-4"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {category.icon}
          </motion.div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {category.title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{category.description}</p>

          <motion.div
            className="flex items-center justify-between text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-gray-500">
              {topicCount === 0
                ? "No topics yet"
                : `${topicCount} topic${topicCount === 1 ? "" : "s"}`}
            </span>
            <span className="flex items-center gap-1 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Explore
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
