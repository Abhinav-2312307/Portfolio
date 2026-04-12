import { NextResponse, type NextRequest } from "next/server"

import { getPortfolioContent } from "@/lib/server/portfolio"
import { getGeminiConfig } from "@/lib/server/env"
import { retrieveKnowledge } from "@/lib/server/knowledge"

type ConversationMessage = {
  isUser?: boolean
  text?: string
}

function analyzeUserIntent(message: string) {
  const lowerMessage = message.toLowerCase()

  const topics = {
    achievements: ["achievement", "award", "win", "won", "rank", "first", "finalist", "hackathon", "leetcode"],
    skills: ["skill", "programming", "language", "technology", "tech", "code", "coding", "development"],
    projects: ["project", "built", "created", "developed", "portfolio", "startup", "product"],
    education: ["education", "study", "college", "degree", "student", "cgpa", "school"],
    personal: ["about", "who", "personality", "interest", "hobby", "like", "him"],
    contact: ["contact", "reach", "email", "linkedin", "github", "social"],
  }

  const matchedTopics = Object.entries(topics)
    .filter(([, keywords]) => keywords.some((keyword) => lowerMessage.includes(keyword)))
    .map(([topic]) => topic)

  return {
    isGreeting: ["hi", "hello", "hey", "yo"].some((greeting) => lowerMessage.includes(greeting)),
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
      "What problem was he trying to solve with PrintMyPagePSIT?",
      "What AI projects has he built so far?",
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
- Sound like a smart, grounded human assistant.
- Answer only what the user asked.
- Use the retrieved context first and do not invent specifics.
- If information is missing, say that honestly and still be helpful.
- Keep the reply naturally conversational, not like a resume dump.
- When useful, add one short follow-up question at the end.

Retrieved portfolio and resume context:
${retrievedContext}

Conversation so far:
${recentConversation || "This is the start of the conversation."}

Current user message:
${message}

Write the best possible response as Abhinav's personal AI assistant.`
}

async function callGemini(prompt: string) {
  const gemini = getGeminiConfig()

  if (!gemini.apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.")
  }

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

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
}

function buildFallbackResponse(message: string, contextText: string) {
  if (!contextText) {
    return `I couldn't pull the richer portfolio context right now, but I can still help with questions about Abhinav's projects, skills, education, or achievements. What would you like to know?`
  }

  const firstSentence = contextText.split(/(?<=[.!?])\s+/).slice(0, 3).join(" ")
  return `${firstSentence} If you want, ask something more specific about ${message.toLowerCase().includes("project") ? "a project" : "his background"} and I'll narrow it down.`
}

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory = [], message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    const content = await getPortfolioContent()
    const intent = analyzeUserIntent(message)
    const knowledge = await retrieveKnowledge(content, message, 6)
    const retrievedContext = knowledge
      .map((chunk) => `[${chunk.section.toUpperCase()}] ${chunk.title}: ${chunk.text}`)
      .join("\n\n")
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
      aiResponse = buildFallbackResponse(message, retrievedContext)
    }

    if (!aiResponse) {
      aiResponse = buildFallbackResponse(message, retrievedContext)
    }

    if (intent.isGreeting && conversationHistory.length === 0) {
      aiResponse = `${content.assistant.welcomeMessage} ${aiResponse}`.trim()
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
