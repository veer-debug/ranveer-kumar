import type { BlogCategory } from "./types"

export const blogCategories: BlogCategory[] = [
  {
    id: "system-design",
    title: "System Design",
    description: "Architecture patterns, scalability, and distributed systems",
    icon: "🏗️",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Models, pipelines, training, and MLOps",
    icon: "📊",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    description: "LLMs, agents, RAG, and intelligent systems",
    icon: "🧠",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "dsa",
    title: "DSA",
    description: "Data structures, algorithms, and problem solving",
    icon: "⚡",
    gradient: "from-orange-500 to-red-500",
  },
]
