import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyAG3hpw2yL_6zwN4yJVoeSuomwrp1s_-CU"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

// Core knowledge about Abhinav Sahu
const ABHINAV_CORE_DATA = `
ABOUT ABHINAV SAHU:
- Full Name: Abhinav Sahu
- Current Role: AI & Data Science Enthusiast, Full-Stack Developer, Competitive Programmer
- Education: B.Tech Computer Science & Engineering at Pranveer Singh Institute of Technology, Kanpur (2023-2027)
- Location: Kanpur, Uttar Pradesh, India
- Email: abhinavrishi32@gmail.com

TECHNICAL EXPERTISE:
- Programming: C++ (Expert - 400+ LeetCode problems), Python (AI/ML), JavaScript (Full-stack)
- Specializations: AI/ML, Data Science, Full-Stack Development, Competitive Programming
- Tools: React, Next.js, Node.js, Git, GitHub, ML libraries

MAJOR ACHIEVEMENTS (2025):
1. 🏆 GDGoC Challenge - Rank 1st in FullStack Development
2. 🚀 IIIT Sonepat National Hackathon - Finalist (AgriTech innovation)
3. 💡 HackO'clock by GDG (IILM University) - Finalist
4. 🧠 LeetCode Expert - 400+ problems solved

SOCIAL LINKS:
- GitHub: https://github.com/Abhinav-2312307
- LinkedIn: https://www.linkedin.com/in/abhinav-sahu-865a01297/
- LeetCode: https://leetcode.com/u/lucifer_debug/

PERSONALITY & INTERESTS:
- Passionate about AI and emerging technologies
- Strong problem-solver with analytical mindset
- Loves competitive programming and hackathons
- Interested in AgriTech and sustainable solutions
- Continuous learner and innovator
`

function analyzeUserIntent(message: string, conversationHistory: any[]) {
  const lowerMessage = message.toLowerCase()

  // Determine what the user is asking about
  const topics = {
    achievements: ["achievement", "award", "win", "won", "rank", "first", "finalist", "hackathon", "gdgoc", "leetcode"],
    skills: ["skill", "programming", "language", "technology", "tech", "code", "coding", "development"],
    projects: ["project", "built", "created", "developed", "work", "portfolio"],
    education: ["education", "study", "college", "university", "degree", "student"],
    personal: ["about", "who", "person", "personality", "interest", "hobby", "like"],
    experience: ["experience", "journey", "story", "how", "started", "began"],
    contact: ["contact", "reach", "email", "linkedin", "github", "social"],
  }

  const detectedTopics = []
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      detectedTopics.push(topic)
    }
  }

  return {
    topics: detectedTopics,
    isQuestion:
      lowerMessage.includes("?") ||
      lowerMessage.startsWith("what") ||
      lowerMessage.startsWith("how") ||
      lowerMessage.startsWith("tell"),
    isGreeting: ["hi", "hello", "hey", "greetings"].some((greeting) => lowerMessage.includes(greeting)),
    conversationLength: conversationHistory.length,
  }
}

function generateContextualPrompt(message: string, conversationHistory: any[], intent: any) {
  const recentContext = conversationHistory
    .slice(-4)
    .map((msg) => `${msg.isUser ? "User" : "Assistant"}: ${msg.text}`)
    .join("\n")

  return `You are Abhinav Sahu's personal AI assistant. You have a warm, friendly, and conversational personality. 

CORE INFORMATION:
${ABHINAV_CORE_DATA}

CONVERSATION CONTEXT:
${recentContext ? `Recent conversation:\n${recentContext}\n` : "This is the start of our conversation."}

CURRENT USER MESSAGE: "${message}"

RESPONSE GUIDELINES:
1. Be conversational and human-like, not robotic
2. Only answer what's specifically asked - don't dump all information at once
3. Use the conversation context to provide relevant follow-ups
4. If asked about achievements, be specific about the impact and details
5. If asked about skills, mention practical applications and experience level
6. Use emojis sparingly but naturally
7. Ask follow-up questions to keep the conversation engaging
8. Remember what was discussed earlier in this conversation
9. Be enthusiastic about Abhinav's accomplishments but not overly promotional
10. If you don't have specific information, say so honestly

${intent.isGreeting ? "The user is greeting you - respond warmly and offer to help." : ""}
${intent.topics.length > 0 ? `The user seems interested in: ${intent.topics.join(", ")}. Focus your response on these areas.` : ""}

Respond naturally as if you're having a real conversation about Abhinav:`
}

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Analyze user intent and conversation context
    const intent = analyzeUserIntent(message, conversationHistory)
    const prompt = generateContextualPrompt(message, conversationHistory, intent)

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8, // More creative and conversational
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024, // Shorter, more focused responses
          stopSequences: [],
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error:", response.status, errorText)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated")
    }

    let aiResponse =
      data.candidates[0]?.content?.parts?.[0]?.text ||
      "Hmm, I'm not sure how to respond to that. Could you ask me something else about Abhinav?"

    // Clean up the response
    aiResponse = aiResponse.trim()

    // Generate contextual suggestions based on the conversation
    let suggestions = []
    if (intent.topics.includes("achievements")) {
      suggestions = [
        "How did he prepare for these competitions?",
        "What was his biggest challenge?",
        "Tell me about his coding journey",
      ]
    } else if (intent.topics.includes("skills")) {
      suggestions = [
        "What projects showcase these skills?",
        "How long has he been programming?",
        "What's his favorite technology to work with?",
      ]
    } else {
      suggestions = [
        "What are his biggest achievements?",
        "Tell me about his technical skills",
        "What's he working on currently?",
      ]
    }

    return NextResponse.json({
      response: aiResponse,
      suggestions: suggestions,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        response: "I'm having some trouble connecting right now. Could you try asking again? 😅",
      },
      { status: 200 },
    )
  }
}
