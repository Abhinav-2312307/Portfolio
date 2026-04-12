import fs from "fs/promises"
import path from "path"

import type { PortfolioContent } from "@/lib/portfolio/schema"
import { getDatabase } from "@/lib/server/db"
import { isMongoConfigured } from "@/lib/server/env"

export type KnowledgeChunk = {
  _id: string
  keywords: string[]
  section: string
  text: string
  title: string
  updatedAt: string
}

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "he",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "was",
  "with",
])

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
}

function chunkLongText(text: string, size = 150, overlap = 35) {
  const words = text.split(/\s+/).filter(Boolean)

  if (words.length <= size) {
    return [text]
  }

  const chunks: string[] = []

  for (let index = 0; index < words.length; index += size - overlap) {
    const chunk = words.slice(index, index + size).join(" ").trim()
    if (chunk) {
      chunks.push(chunk)
    }
  }

  return chunks
}

async function extractResumeText(resumeUrl: string) {
  try {
    let buffer: Buffer

    if (resumeUrl.startsWith("/")) {
      const filePath = path.join(process.cwd(), "public", resumeUrl.replace(/^\//, ""))
      buffer = await fs.readFile(filePath)
    } else {
      const response = await fetch(resumeUrl)
      if (!response.ok) {
        return ""
      }
      buffer = Buffer.from(await response.arrayBuffer())
    }

    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    const result = await parser.getText()
    await parser.destroy()
    return result.text?.replace(/\s+/g, " ").trim() ?? ""
  } catch (error) {
    console.error("Unable to extract resume text:", error)
    return ""
  }
}

function buildKeywords(text: string) {
  return Array.from(new Set(tokenize(text))).slice(0, 24)
}

function buildChunk(id: string, section: string, title: string, text: string): KnowledgeChunk {
  return {
    _id: id,
    keywords: buildKeywords(`${title} ${text}`),
    section,
    text: text.trim(),
    title,
    updatedAt: new Date().toISOString(),
  }
}

export async function buildKnowledgeChunks(content: PortfolioContent) {
  const chunks: KnowledgeChunk[] = []

  chunks.push(
    buildChunk(
      "identity-overview",
      "identity",
      "Professional overview",
      [
        `${content.identity.fullName} is based in ${content.identity.location}.`,
        `Current role: ${content.identity.currentRole}.`,
        content.hero.intro,
        content.about.primaryParagraph,
        content.about.secondaryParagraph,
      ].join(" "),
    ),
  )

  chunks.push(
    buildChunk(
      "skills-overview",
      "skills",
      "Core technical stack",
      `Primary skills include ${content.skills.cards.map((item) => item.name).join(", ")}. Additional tools and strengths: ${content.skills.rails.join(", ")}.`,
    ),
  )

  content.projects.items.forEach((project, index) => {
    chunks.push(
      buildChunk(
        `project-${index + 1}`,
        "projects",
        project.title,
        [
          project.summary,
          project.description,
          project.details,
          `Highlights: ${project.highlights.join(" ")}`,
          `Tech stack: ${project.stack.join(", ")}.`,
          project.status ? `Status: ${project.status}.` : "",
          project.period ? `Period: ${project.period}.` : "",
        ]
          .filter(Boolean)
          .join(" "),
      ),
    )
  })

  content.achievements.items.forEach((achievement, index) => {
    chunks.push(
      buildChunk(
        `achievement-${index + 1}`,
        "achievements",
        achievement.title,
        `${achievement.subtitle}. ${achievement.description} Category: ${achievement.category}. Year: ${achievement.year}.`,
      ),
    )
  })

  content.education.items.forEach((item, index) => {
    chunks.push(
      buildChunk(
        `education-${index + 1}`,
        "education",
        item.title,
        `${item.meta}. ${item.points.join(". ")}.`,
      ),
    )
  })

  content.hobbies.items.forEach((hobby, index) => {
    chunks.push(
      buildChunk(`hobby-${index + 1}`, "hobbies", hobby.title, `${hobby.description} ${hobby.eyebrow}.`),
    )
  })

  content.contact.infoItems.forEach((infoItem, index) => {
    chunks.push(buildChunk(`contact-${index + 1}`, "contact", infoItem.label, infoItem.value))
  })

  content.assistant.knowledgeNotes.forEach((note, index) => {
    chunks.push(buildChunk(`assistant-note-${index + 1}`, "assistant", `Private note ${index + 1}`, note))
  })

  const resumeText = content.assistant.resumeText || (await extractResumeText(content.identity.resumeUrl))
  const normalizedResumeText = resumeText.replace(/\s+/g, " ").trim()

  if (normalizedResumeText) {
    chunkLongText(normalizedResumeText).forEach((chunk, index) => {
      chunks.push(buildChunk(`resume-${index + 1}`, "resume", `Resume excerpt ${index + 1}`, chunk))
    })
  }

  return {
    chunks,
    resumeText: normalizedResumeText,
  }
}

export async function rebuildKnowledgeBase(content: PortfolioContent) {
  const { chunks, resumeText } = await buildKnowledgeChunks(content)

  if (isMongoConfigured()) {
    const database = await getDatabase()
    const collection = database.collection<KnowledgeChunk>("portfolio_knowledge")
    await collection.deleteMany({})
    if (chunks.length > 0) {
      await collection.insertMany(chunks)
    }
  }

  return {
    chunks,
    resumeText,
  }
}

export async function getKnowledgeChunks(content: PortfolioContent) {
  if (!isMongoConfigured()) {
    const rebuilt = await buildKnowledgeChunks(content)
    return rebuilt.chunks
  }

  const database = await getDatabase()
  const collection = database.collection<KnowledgeChunk>("portfolio_knowledge")
  const storedChunks = await collection.find({}).toArray()

  if (storedChunks.length > 0) {
    return storedChunks
  }

  const rebuilt = await rebuildKnowledgeBase(content)
  return rebuilt.chunks
}

function scoreChunk(query: string, chunk: KnowledgeChunk) {
  const queryTokens = tokenize(query)
  const chunkTokens = new Set([...chunk.keywords, ...tokenize(chunk.text)])
  let score = 0

  for (const token of queryTokens) {
    if (chunkTokens.has(token)) {
      score += 3
    }

    if (chunk.title.toLowerCase().includes(token)) {
      score += 2
    }
  }

  const fullQuery = query.trim().toLowerCase()
  if (fullQuery.length > 4 && chunk.text.toLowerCase().includes(fullQuery)) {
    score += 5
  }

  return score
}

export async function retrieveKnowledge(content: PortfolioContent, query: string, limit = 6) {
  const chunks = await getKnowledgeChunks(content)
  const ranked = chunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(query, chunk),
    }))
    .sort((left, right) => right.score - left.score)

  const positive = ranked.filter((item) => item.score > 0).slice(0, limit)

  if (positive.length > 0) {
    return positive.map((item) => item.chunk)
  }

  return ranked.slice(0, Math.min(limit, ranked.length)).map((item) => item.chunk)
}
