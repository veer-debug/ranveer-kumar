import { notFound } from "next/navigation"
import BlogPostPage from "./blog-post-client"
import { getCustomArticle } from "@/content/blogs/custom-articles-server"
import {
  blogCategories,
  getAllPostParams,
  getPostBySlug,
} from "@/lib/blogs"
import type { BlogCategoryId } from "@/lib/blogs/types"

interface PageProps {
  params: Promise<{ category: string; slug: string }>
}

export function generateStaticParams() {
  return getAllPostParams().map(({ category, slug }) => ({ category, slug }))
}

export default async function PostPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params
  const category = blogCategories.find((c) => c.id === categorySlug)

  if (!category) {
    notFound()
  }

  const post = getPostBySlug(category.id as BlogCategoryId, slug)

  if (!post) {
    notFound()
  }

  const CustomArticle = getCustomArticle(category.id as BlogCategoryId, slug)
  if (CustomArticle) {
    return <CustomArticle />
  }

  return <BlogPostPage category={category} post={post} />
}
