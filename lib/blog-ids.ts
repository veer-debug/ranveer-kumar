export const BLOG_HOME_ID = "blog/home"

export function getPostId(categoryId: string, slug?: string): string {
  if (slug) return `${categoryId}/${slug}`
  return `blog/category/${categoryId}`
}
