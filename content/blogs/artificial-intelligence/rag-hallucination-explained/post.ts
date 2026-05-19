import type { BlogPost } from "@/lib/blogs/types"

export const post: BlogPost = {
  slug: "rag-hallucination-explained",
  title: "Hallucination in RAG — Why It Happens & How to Fix It",
  description:
    "Why retrieval-augmented generation still hallucinates, the main failure modes in a RAG pipeline, and practical fixes from chunking and reranking to citations and faithfulness eval.",
  publishedAt: "2026-05-19",
  tags: ["RAG", "LLM", "AIEngineering", "LangChain", "Retrieval", "Hallucination"],
  hasCustomArticle: true,
}
