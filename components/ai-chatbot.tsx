"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatContext {
  messages: Message[]
  userPreferences: {
    interestedTopics: string[]
    askedAbout: string[]
  }
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hey there! 👋 I'm Abhinav's AI assistant. I know him pretty well and can chat about his work, achievements, or anything you're curious about. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatContext, setChatContext] = useState<ChatContext>({
    messages: [],
    userPreferences: {
      interestedTopics: [],
      askedAbout: [],
    },
  })
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
    if (!inputValue.trim() || isLoading) return

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
          message: currentInput,
          context: chatContext,
          conversationHistory: messages.slice(-6), // Last 6 messages for context
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

      // Update suggestions based on conversation
      if (data.suggestions) {
        setDynamicSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Hmm, seems like I'm having some connection issues. Mind trying that again? 🤔",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const [dynamicSuggestions, setDynamicSuggestions] = useState([
    "What are Abhinav's biggest achievements?",
    "Tell me about his technical skills",
    "What projects is he most proud of?",
    "How did he get into AI and programming?",
  ])

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
    } else if (recentTopics.includes("skills")) {
      return [
        "What's his favorite programming language?",
        "How long has he been coding?",
        "What AI projects has he built?",
      ]
    } else {
      return dynamicSuggestions
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
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

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-secondary-color rounded-xl shadow-2xl border border-white/10 z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-color to-accent-color p-4 text-contrast-color">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs opacity-80">Abhinav's personal AI</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                    message.isUser
                      ? "ml-auto rounded-br-sm bg-primary-color text-contrast-color"
                      : "bg-white/10 text-text-color rounded-bl-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Contextual Suggestions */}
            {messages.length <= 2 && (
              <div className="space-y-2">
                <p className="text-xs text-text-secondary">💡 Try asking:</p>
                {getContextualSuggestions().map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="block w-full text-left text-xs p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-text-secondary hover:text-text-color transition-all duration-200 hover:border-primary-color/30"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-text-color p-3 rounded-lg text-sm rounded-bl-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-color rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary-color rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary-color rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-text-secondary">thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Abhinav..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-text-color placeholder-text-secondary focus:outline-none focus:border-primary-color transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="rounded-lg bg-primary-color px-3 py-2 text-contrast-color transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      )}
    </>
  )
}
