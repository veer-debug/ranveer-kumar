import { notFound } from "next/navigation"
import BlogCategoryPage from "./blog-category-client"
import { blogCategories, getAllCategorySlugs, getTopicsByCategory } from "@/lib/blogs"
import type { BlogCategoryId } from "@/lib/blogs/types"

interface PageProps {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }))
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params
  const category = blogCategories.find((c) => c.id === categorySlug)

  if (!category) {
    notFound()
  }

  const topics = getTopicsByCategory(category.id as BlogCategoryId)

  return <BlogCategoryPage category={category} topics={topics} />
}
