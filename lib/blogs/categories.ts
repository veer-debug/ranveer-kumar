import type { BlogCategory } from "./types"

export const blogCategories: BlogCategory[] = [
  {
    id: "system-design",
    title: "System Design",
    description: "Architecture patterns, scalability, and distributed systems",
    icon: "🏗️",
    gradient: "from-brand/15 to-brand-soft/30",
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Models, pipelines, training, and MLOps",
    icon: "📊",
    gradient: "from-brand-green/15 to-brand-green/5",
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    description: "LLMs, agents, RAG, and intelligent systems",
    icon: "🧠",
    gradient: "from-brand/10 to-brand-soft/25",
  },
  {
    id: "dsa",
    title: "DSA",
    description: "Data structures, algorithms, and problem solving",
    icon: "⚡",
    gradient: "from-brand/20 to-brand-soft/35",
  },
]
