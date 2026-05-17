import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blogs | Ranveer Kumar",
  description:
    "Technical blogs on system design, machine learning, artificial intelligence, and DSA",
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children
}
