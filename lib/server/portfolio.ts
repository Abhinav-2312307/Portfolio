import type { WithId } from "mongodb"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import { normalizePortfolioContent } from "@/lib/portfolio/normalize"
import { type PortfolioContent } from "@/lib/portfolio/schema"
import { getDatabase } from "@/lib/server/db"
import { isMongoConfigured } from "@/lib/server/env"
import { rebuildKnowledgeBase } from "@/lib/server/knowledge"

type PortfolioDocument = {
  _id: string
  content: PortfolioContent
  createdAt: Date
  updatedAt: Date
  updatedBy: string
}

const PORTFOLIO_DOCUMENT_ID = "primary"

function toStoredDocument(document: WithId<PortfolioDocument> | null) {
  return document ? normalizePortfolioContent(document.content) : null
}

async function getPortfolioCollection() {
  const database = await getDatabase()
  return database.collection<PortfolioDocument>("portfolio_content")
}

export async function getPortfolioContent() {
  if (!isMongoConfigured()) {
    return defaultPortfolioContent
  }

  const collection = await getPortfolioCollection()
  const storedDocument = await collection.findOne({ _id: PORTFOLIO_DOCUMENT_ID })

  if (storedDocument) {
    return toStoredDocument(storedDocument)
  }

  const normalized = normalizePortfolioContent(defaultPortfolioContent)

  await collection.insertOne({
    _id: PORTFOLIO_DOCUMENT_ID,
    content: normalized,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: "system-bootstrap",
  })

  await rebuildKnowledgeBase(normalized)

  return normalized
}

export async function savePortfolioContent(content: unknown, updatedBy: string) {
  const normalized = normalizePortfolioContent(content)

  if (!isMongoConfigured()) {
    return normalized
  }

  const { resumeText } = await rebuildKnowledgeBase(normalized)
  const nextContent = {
    ...normalized,
    assistant: {
      ...normalized.assistant,
      resumeText,
    },
  }

  const collection = await getPortfolioCollection()
  await collection.updateOne(
    { _id: PORTFOLIO_DOCUMENT_ID },
    {
      $set: {
        content: nextContent,
        updatedAt: new Date(),
        updatedBy,
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )

  return nextContent
}

export async function getPublicPortfolioContent() {
  const content = await getPortfolioContent()

  return {
    ...content,
    assistant: {
      ...content.assistant,
      resumeText: "",
    },
  }
}
