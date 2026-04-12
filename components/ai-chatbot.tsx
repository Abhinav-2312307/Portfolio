"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

import { useMobile } from "@/hooks/use-mobile"
import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { AssistantContent } from "@/lib/portfolio/schema"

interface Message {
  id: string
  isUser: boolean
  text: string
  timestamp: Date
}

interface ChatContext {
  messages: Message[]
  userPreferences: {
    askedAbout: string[]
    interestedTopics: string[]
  }
}

type AIChatbotProps = {
  assistant?: AssistantContent
}

export default function AIChatbot({ assistant = defaultPortfolioContent.assistant }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: assistant.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatContext, setChatContext] = useState<ChatContext>({
    messages: [],
    userPreferences: {
      askedAbout: [],
      interestedTopics: [],
    },
  })
  const [dynamicSuggestions, setDynamicSuggestions] = useState(assistant.suggestedQuestions)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const updateChatContext = (newMessage: Message) => {
    setChatContext((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }))
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    updateChatContext(userMessage)

    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationHistory: messages.slice(-6),
          context: chatContext,
          message: currentInput,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      updateChatContext(aiMessage)

      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setDynamicSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Hmm, seems like I'm having some connection issues. Mind trying that again?",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  const getContextualSuggestions = () => {
    const recentTopics = chatContext.userPreferences.askedAbout

    if (recentTopics.includes("achievements")) {
      return [
        "How did he win the GDGoC challenge?",
        "Tell me about his hackathon experiences",
        "What's his LeetCode journey like?",
      ]
    }

    if (recentTopics.includes("skills")) {
      return [
        "What's his favorite programming language?",
        "How long has he been coding?",
        "What AI projects has he built?",
      ]
    }

    return dynamicSuggestions
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-color to-accent-color text-contrast-color shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
          }`}
          data-strength="0.2"
          data-cursor-text="AI Assistant"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      </div>

      {isOpen ? (
        <div className="fixed bottom-24 right-6 z-40 flex h-96 w-80 flex-col overflow-hidden rounded-xl border border-white/10 bg-secondary-color shadow-2xl">
          <div className="bg-gradient-to-r from-primary-color to-accent-color p-4 text-contrast-color">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-80">Abhinav&apos;s personal AI</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                    message.isUser
                      ? "ml-auto rounded-br-sm bg-primary-color text-contrast-color"
                      : "rounded-bl-sm bg-white/10 text-text-color"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {messages.length <= 2 ? (
              <div className="space-y-2">
                <p className="text-xs text-text-secondary">Try asking:</p>
                {getContextualSuggestions().map((question, index) => (
                  <button
                    key={`${question}-${index}`}
                    onClick={() => handleQuickQuestion(question)}
                    className="block w-full rounded border border-white/10 bg-white/5 p-2 text-left text-xs text-text-secondary transition-all duration-200 hover:border-primary-color/30 hover:bg-white/10 hover:text-text-color"
                  >
                    {question}
                  </button>
                ))}
              </div>
            ) : null}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-lg rounded-bl-sm bg-white/10 p-3 text-sm text-text-color">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary-color"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-primary-color"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-primary-color"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-text-secondary">thinking...</span>
                  </div>
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about Abhinav..."
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-text-color placeholder-text-secondary transition-colors focus:border-primary-color focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="rounded-lg bg-primary-color px-3 py-2 text-contrast-color transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
