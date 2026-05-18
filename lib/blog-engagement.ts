import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

export { BLOG_HOME_ID, getPostId } from "@/lib/blog-ids"
export type { BlogComment, BlogEngagementData } from "@/lib/blog-engagement-types"
import type { BlogComment, BlogEngagementData } from "@/lib/blog-engagement-types"

const DEFAULT_DATA: BlogEngagementData = { views: {}, comments: {} }

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "blog-engagement.json")

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf-8")
  }
}

export async function readEngagement(): Promise<BlogEngagementData> {
  await ensureDataFile()
  const raw = await fs.readFile(DATA_FILE, "utf-8")
  const parsed = JSON.parse(raw) as BlogEngagementData
  return {
    views: parsed.views ?? {},
    comments: parsed.comments ?? {},
  }
}

async function writeEngagement(data: BlogEngagementData): Promise<void> {
  await ensureDataFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
}

export async function getViewCount(postId: string): Promise<number> {
  const data = await readEngagement()
  return data.views[postId] ?? 0
}

export async function incrementView(postId: string): Promise<number> {
  const data = await readEngagement()
  const next = (data.views[postId] ?? 0) + 1
  data.views[postId] = next
  await writeEngagement(data)
  return next
}

export async function getTotalViews(): Promise<number> {
  const data = await readEngagement()
  return Object.values(data.views).reduce((sum, count) => sum + count, 0)
}

export async function getComments(postId: string): Promise<BlogComment[]> {
  const data = await readEngagement()
  return [...(data.comments[postId] ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function addComment(
  postId: string,
  name: string,
  message: string,
): Promise<BlogComment> {
  const trimmedName = name.trim().slice(0, 80)
  const trimmedMessage = message.trim().slice(0, 2000)

  if (!trimmedName || !trimmedMessage) {
    throw new Error("Name and message are required")
  }

  const data = await readEngagement()
  const comment: BlogComment = {
    id: randomUUID(),
    postId,
    name: trimmedName,
    message: trimmedMessage,
    createdAt: new Date().toISOString(),
  }

  if (!data.comments[postId]) {
    data.comments[postId] = []
  }
  data.comments[postId].push(comment)
  await writeEngagement(data)
  return comment
}
