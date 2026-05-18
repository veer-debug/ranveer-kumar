import type { BlogPost } from "@/lib/blogs/types"

export const post: BlogPost = {
  slug: "load-balancer-explained",
  title: "Load Balancer Explained: The Traffic Police of the Internet",
  description:
    "How load balancers distribute traffic, Layer 4 vs Layer 7, common algorithms, health checks, and what to expect in system design interviews.",
  publishedAt: "2026-05-18",
  tags: [
    "SystemDesign",
    "LoadBalancing",
    "Networking",
    "Microservices",
    "DevOps",
    "Kubernetes",
  ],
  hasCustomArticle: true,
}
