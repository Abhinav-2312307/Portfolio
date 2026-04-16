import { NextResponse, type NextRequest } from "next/server"

import { getPortfolioContent } from "@/lib/server/portfolio"
import { getGeminiConfig } from "@/lib/server/env"
import { retrieveKnowledge } from "@/lib/server/knowledge"

type ConversationMessage = {
  isUser?: boolean
  text?: string
}

function shouldUseInstantResponse(message: string, intent: ReturnType<typeof analyzeUserIntent>, conversationHistory: ConversationMessage[]) {
  const normalized = message.trim().toLowerCase()
  const wordCount = normalized.split(/\s+/).filter(Boolean).length

  if (intent.isGreeting) {
    return true
  }

  if (conversationHistory.length > 6) {
    return false
  }

  if (
    /(email|contact|reach|linkedin|github|resume|cv|cgpa|college|school|university|location|based|where|skills?|stack|framework|tools?|projects?|built|achievements?|hackathon|leetcode|current focus|currently building|who is|about him|role)/i.test(
      normalized,
    )
  ) {
    return true
  }

  return intent.topics.length > 0 && wordCount <= 16
}

function analyzeUserIntent(message: string) {
  const lowerMessage = message.toLowerCase()

  const topics = {
    achievements: ["achievement", "award", "win", "won", "rank", "first", "finalist", "hackathon", "leetcode", "competition", "contest", "prize"],
    skills: ["skill", "programming", "language", "technology", "tech", "code", "coding", "development", "stack", "framework", "tool", "python", "javascript", "react", "next", "typescript"],
    projects: ["project", "built", "created", "developed", "portfolio", "startup", "product", "app", "application", "website", "build"],
    education: ["education", "study", "college", "degree", "student", "cgpa", "school", "university", "academic", "course", "gpa"],
    personal: ["about", "who", "personality", "interest", "hobby", "like", "him", "himself", "person", "background", "story"],
    contact: ["contact", "reach", "email", "linkedin", "github", "social", "connect", "hire", "hiring", "available"],
    resume: ["resume", "cv", "experience", "work", "internship", "job"],
  }

  const matchedTopics = Object.entries(topics)
    .filter(([, keywords]) => keywords.some((keyword) => lowerMessage.includes(keyword)))
    .map(([topic]) => topic)

  return {
    isGreeting: /^(hi|hello|hey|yo|sup|howdy|greetings|what'?s?\s*up)\b/i.test(lowerMessage.trim()),
    topics: matchedTopics,
  }
}

function buildSuggestions(topics: string[]) {
  if (topics.includes("achievements")) {
    return [
      "What kind of hackathons has he done?",
      "Which achievement is he most proud of?",
      "How did he build his problem-solving skills?",
    ]
  }

  if (topics.includes("skills")) {
    return [
      "Which stack does he use most often?",
      "What projects show these skills best?",
      "Is he stronger in AI or full-stack engineering?",
    ]
  }

  if (topics.includes("projects")) {
    return [
      "Which project feels most production-ready?",
      "What problem was he trying to solve?",
      "What AI projects has he built so far?",
    ]
  }

  if (topics.includes("education")) {
    return [
      "What's his CGPA?",
      "What courses has he taken?",
      "What extracurriculars is he involved in?",
    ]
  }

  if (topics.includes("contact")) {
    return [
      "What's his email?",
      "Is he open to freelance work?",
      "Where can I see his GitHub?",
    ]
  }

  return [
    "What are his biggest achievements?",
    "Tell me about his technical skills",
    "What kind of projects is he building right now?",
  ]
}

function buildPrompt({
  assistantIntro,
  conversationHistory,
  message,
  retrievedContext,
  tone,
}: {
  assistantIntro: string
  conversationHistory: ConversationMessage[]
  message: string
  retrievedContext: string
  tone: string
}) {
  const recentConversation = conversationHistory
    .slice(-6)
    .map((entry) => `${entry.isUser ? "User" : "Assistant"}: ${entry.text ?? ""}`)
    .join("\n")

  return `${assistantIntro}

Tone and behavior:
- ${tone}
- Sound like a smart, grounded human assistant — not robotic.
- Answer only what the user asked. Be focused and concise.
- Use the retrieved context first and do not invent specifics.
- If information is missing, say that honestly and still be helpful.
- Keep the reply naturally conversational, not like a resume dump.
- Format with line breaks for readability when listing items.
- When useful, add one short follow-up question at the end.
- Do NOT use markdown headers (#). Use plain text with line breaks.

Retrieved portfolio and resume context:
${retrievedContext}

Conversation so far:
${recentConversation || "This is the start of the conversation."}

Current user message:
${message}

Write the best possible response as Abhinav's personal AI assistant.`
}

async function callGemini(prompt: string, retries = 2): Promise<string> {
  const gemini = getGeminiConfig()

  if (!gemini.apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.")
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${gemini.model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": gemini.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 700,
            temperature: 0.75,
            topK: 32,
            topP: 0.95,
          },
        }),
      },
    )

    if (response.ok) {
      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
    }

    // Handle rate limiting with retry
    if (response.status === 429 && attempt < retries) {
      // Try to parse retry delay from error response
      let waitMs = 3000 * (attempt + 1) // Default exponential backoff
      try {
        const errorData = await response.json()
        const retryInfo = errorData?.error?.details?.find(
          (d: { "@type": string }) => d["@type"]?.includes("RetryInfo"),
        )
        if (retryInfo?.retryDelay) {
          const seconds = parseInt(retryInfo.retryDelay, 10)
          if (seconds > 0 && seconds <= 30) {
            waitMs = seconds * 1000
          }
        }
      } catch {
        // Use default backoff
      }

      console.log(`Gemini rate limited, retrying in ${waitMs}ms (attempt ${attempt + 1}/${retries})`)
      await new Promise((resolve) => setTimeout(resolve, waitMs))
      continue
    }

    // Non-retryable error or final attempt
    const errorText = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${errorText}`)
  }

  throw new Error("Gemini API: all retries exhausted")
}

/**
 * Builds a smart fallback response from RAG context when Gemini is unavailable.
 * Instead of just dumping raw text, we parse the knowledge chunks and format
 * a coherent, conversational response based on the user's intent.
 */
function buildSmartFallback(
  message: string,
  retrievedContext: string,
  intent: { isGreeting: boolean; topics: string[] },
) {
  if (!retrievedContext || retrievedContext.trim().length < 20) {
    return "I'm not able to connect to my AI engine right now, but feel free to explore the portfolio sections above — projects, skills, achievements, and more are all there! Ask me again in a moment."
  }

  // Parse chunks back from the formatted context
  const chunks = retrievedContext
    .split("\n\n")
    .map((chunk) => {
      const bracketMatch = chunk.match(/^\[([A-Z]+)\]\s*(.+?):\s*([\s\S]*)$/)
      if (bracketMatch) {
        return {
          section: bracketMatch[1].toLowerCase(),
          title: bracketMatch[2].trim(),
          text: bracketMatch[3].trim(),
        }
      }
      return { section: "general", title: "", text: chunk.trim() }
    })
    .filter((c) => c.text.length > 10)

  if (chunks.length === 0) {
    return "I couldn't find specific information about that right now. Try asking about his projects, skills, achievements, or education!"
  }

  // For greetings, give a brief overview
  if (intent.isGreeting) {
    const identityChunk = chunks.find((c) => c.section === "identity")
    if (identityChunk) {
      const sentences = identityChunk.text.split(/(?<=[.!?])\s+/).slice(0, 3).join(" ")
      return `Hey there! 👋 ${sentences}\n\nFeel free to ask me anything — about his projects, skills, achievements, or background!`
    }
    return "Hey! 👋 I'm Abhinav's AI assistant. I can help you learn about his projects, skills, or achievements. What would you like to know?"
  }

  const lowerMessage = message.toLowerCase()

  // Extract key question words and nouns from the user's message
  const questionWords = lowerMessage
    .replace(/[?!.,]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "his", "him", "does", "did", "can", "has", "what", "where", "who", "how", "why", "when", "tell", "about", "know", "are", "was", "and", "for", "you", "this", "that"].includes(w))

  // Score each sentence across all chunks for relevance
  type ScoredSentence = { sentence: string; score: number; section: string }
  const scoredSentences: ScoredSentence[] = []

  for (const chunk of chunks) {
    const sentences = chunk.text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15)

    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase()
      let score = 0

      for (const word of questionWords) {
        if (lowerSentence.includes(word)) {
          score += 3
        }
      }

      // Boost sentences from relevant topic sections
      if (intent.topics.includes(chunk.section)) {
        score += 2
      }

      // Boost for location-related questions
      if ((lowerMessage.includes("live") || lowerMessage.includes("location") || lowerMessage.includes("where") || lowerMessage.includes("from") || lowerMessage.includes("based")) &&
          (lowerSentence.includes("based in") || lowerSentence.includes("location") || lowerSentence.includes("kanpur") || lowerSentence.includes("india"))) {
        score += 10
      }

      // Boost for role/identity questions
      if ((lowerMessage.includes("who") || lowerMessage.includes("role") || lowerMessage.includes("do")) &&
          (lowerSentence.includes("role") || lowerSentence.includes("student") || lowerSentence.includes("engineer"))) {
        score += 8
      }

      // Boost for email/contact questions
      if ((lowerMessage.includes("email") || lowerMessage.includes("contact") || lowerMessage.includes("reach")) &&
          (lowerSentence.includes("email") || lowerSentence.includes("@") || lowerSentence.includes("contact"))) {
        score += 10
      }

      if (score > 0) {
        scoredSentences.push({ sentence, score, section: chunk.section })
      }
    }
  }

  // Sort by score and pick the best ones
  scoredSentences.sort((a, b) => b.score - a.score)

  if (scoredSentences.length > 0) {
    // Take top 3-4 most relevant sentences, de-duplicate by content
    const seen = new Set<string>()
    const bestSentences: string[] = []

    for (const item of scoredSentences) {
      const key = item.sentence.slice(0, 40).toLowerCase()
      if (!seen.has(key) && bestSentences.length < 4) {
        seen.add(key)
        bestSentences.push(item.sentence)
      }
    }

    let response = bestSentences.join(" ")

    // Add a follow-up
    if (intent.topics.includes("projects")) {
      response += "\n\nWant to know about a specific project in more detail?"
    } else if (intent.topics.includes("skills")) {
      response += "\n\nWant to see which projects showcase these skills?"
    } else if (intent.topics.includes("achievements")) {
      response += "\n\nCurious about any specific achievement?"
    } else {
      response += "\n\nAnything else you'd like to know?"
    }

    return response
  }

  // Last resort: use first chunk summary
  const firstChunk = chunks[0]
  const summary = firstChunk.text.split(/(?<=[.!?])\s+/).slice(0, 3).join(" ")
  return `${summary}\n\nWant to know more? Try asking about his projects, skills, or achievements!`
}

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory = [], message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    const content = await getPortfolioContent()

    if (!content) {
      return NextResponse.json(
        { response: "Portfolio data is not available yet. Please try again later.", suggestions: defaultSuggestions },
        { status: 200 },
      )
    }

    const intent = analyzeUserIntent(message)
    const knowledge = await retrieveKnowledge(content, message, 6)
    const retrievedContext = knowledge
      .map((chunk) => `[${chunk.section.toUpperCase()}] ${chunk.title}: ${chunk.text}`)
      .join("\n\n")

    if (shouldUseInstantResponse(message, intent, conversationHistory)) {
      let localResponse = buildSmartFallback(message, retrievedContext, intent)

      if (intent.isGreeting && conversationHistory.length === 0 && !/^(hey|hi|hello|greetings)/i.test(localResponse)) {
        localResponse = `${content.assistant.welcomeMessage} ${localResponse}`.trim()
      }

      return NextResponse.json({
        response: localResponse,
        suggestions: buildSuggestions(intent.topics),
      })
    }

    const prompt = buildPrompt({
      assistantIntro: content.assistant.systemPreamble,
      conversationHistory,
      message,
      retrievedContext,
      tone: content.assistant.tone,
    })

    let aiResponse = ""

    try {
      aiResponse = await callGemini(prompt)
    } catch (error) {
      console.error("Gemini request failed:", error)
      // Use smart fallback with RAG context
      aiResponse = buildSmartFallback(message, retrievedContext, intent)
    }

    if (!aiResponse) {
      aiResponse = buildSmartFallback(message, retrievedContext, intent)
    }

    if (intent.isGreeting && conversationHistory.length === 0) {
      // Only prepend welcome if Gemini response doesn't already look like a greeting
      if (!/^(hey|hi|hello|greetings)/i.test(aiResponse)) {
        aiResponse = `${content.assistant.welcomeMessage} ${aiResponse}`.trim()
      }
    }

    return NextResponse.json({
      response: aiResponse,
      suggestions: buildSuggestions(intent.topics),
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        response: "I'm having some trouble connecting right now. Please try again in a moment.",
        suggestions: defaultSuggestions,
      },
      { status: 200 },
    )
  }
}

const defaultSuggestions = [
  "What are his biggest achievements?",
  "Tell me about his technical skills",
  "What kind of projects is he building right now?",
]
