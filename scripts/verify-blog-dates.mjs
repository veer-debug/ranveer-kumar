#!/usr/bin/env node
/**
 * Ensures blog publishedAt values match published-dates.lock.json
 * and blocks commits that change dates on existing posts.
 */
import { readFileSync, readdirSync, statSync } from "fs"
import { join, relative } from "path"
import { execSync } from "child_process"

const ROOT = process.cwd()
const BLOGS_DIR = join(ROOT, "content/blogs")
const LOCK_PATH = join(BLOGS_DIR, "published-dates.lock.json")

function findPostFiles(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      if (name !== "node_modules") findPostFiles(path, files)
    } else if (name === "post.ts") {
      files.push(path)
    }
  }
  return files
}

function extractPublishedAt(source) {
  const match = source.match(/publishedAt:\s*["'](\d{4}-\d{2}-\d{2})["']/)
  return match?.[1] ?? null
}

function postKeyFromPath(filePath) {
  return relative(BLOGS_DIR, filePath).replace(/\\/g, "/").replace(/\/post\.ts$/, "")
}

function loadLock() {
  const data = JSON.parse(readFileSync(LOCK_PATH, "utf8"))
  return data.posts ?? {}
}

function verifyLockMatchesWorkingTree() {
  const lock = loadLock()
  const postFiles = findPostFiles(BLOGS_DIR)
  const seen = new Set()

  for (const filePath of postFiles) {
    const key = postKeyFromPath(filePath)
    seen.add(key)
    const publishedAt = extractPublishedAt(readFileSync(filePath, "utf8"))
    const locked = lock[key]

    if (!publishedAt) {
      console.error(`[blog-dates] Missing publishedAt in ${key}/post.ts`)
      process.exit(1)
    }

    if (!locked) {
      console.error(
        `[blog-dates] No lock entry for "${key}". Add it once to content/blogs/published-dates.lock.json`,
      )
      process.exit(1)
    }

    if (publishedAt !== locked) {
      console.error(
        `[blog-dates] ${key}: post.ts has "${publishedAt}" but lock has "${locked}". They must match.`,
      )
      process.exit(1)
    }
  }

  for (const key of Object.keys(lock)) {
    if (!seen.has(key)) {
      console.error(`[blog-dates] Stale lock entry "${key}" (no post.ts found). Remove it from the lock file.`)
      process.exit(1)
    }
  }
}

function verifyNoStagedDateChanges() {
  let statusOutput = ""
  try {
    statusOutput = execSync(
      'git diff --cached --name-status -- "content/blogs/**/post.ts" "content/blogs/published-dates.lock.json"',
      { encoding: "utf8" },
    ).trim()
  } catch {
    return
  }

  if (!statusOutput) return

  for (const line of statusOutput.split("\n")) {
    const [code, ...pathParts] = line.split("\t")
    const filePath = pathParts.join("\t")
    if (!filePath) continue

    if (filePath.endsWith("published-dates.lock.json") && code === "M") {
      const oldLock = JSON.parse(
        execSync(`git show HEAD:${filePath}`, { encoding: "utf8" }),
      ).posts
      const newLock = loadLock()
      for (const [key, oldDate] of Object.entries(oldLock)) {
        const newDate = newLock[key]
        if (newDate && newDate !== oldDate) {
          console.error(
            `[blog-dates] Cannot change locked date for "${key}" (${oldDate} → ${newDate}).`,
          )
          process.exit(1)
        }
      }
      continue
    }

    if (!filePath.endsWith("/post.ts")) continue

    if (code === "M") {
      let oldSource = ""
      try {
        oldSource = execSync(`git show HEAD:${filePath}`, { encoding: "utf8" })
      } catch {
        continue
      }
      const newSource = readFileSync(join(ROOT, filePath), "utf8")
      const oldDate = extractPublishedAt(oldSource)
      const newDate = extractPublishedAt(newSource)
      if (oldDate && newDate && oldDate !== newDate) {
        console.error(
          `[blog-dates] Cannot change publishedAt in ${filePath} (${oldDate} → ${newDate}).`,
        )
        process.exit(1)
      }
    }
  }
}

verifyLockMatchesWorkingTree()
verifyNoStagedDateChanges()
console.log("[blog-dates] OK — publish dates match lock file.")
