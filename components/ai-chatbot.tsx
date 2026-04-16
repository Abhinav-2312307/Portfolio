"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

import { useMobile } from "@/hooks/use-mobile"
import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { AssistantContent } from "@/lib/portfolio/schema"

interface Message {
  id: string
  isUser: boolean
  text: string
  timestamp: Date
}

type AIChatbotProps = {
  assistant?: AssistantContent
}

function formatAIText(text: string) {
  // Convert **bold** to <strong> tags
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[rgb(var(--text-color))]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    // Handle newlines
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ))
  })
}

const chatWindowVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.92,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 28,
      stiffness: 340,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.95,
    filter: "blur(6px)",
    transition: { duration: 0.22, ease: "easeIn" },
  },
}

const messageVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 22,
      stiffness: 300,
    },
  },
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
  const [dynamicSuggestions, setDynamicSuggestions] = useState(assistant.suggestedQuestions)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMobile()
  const prefersReducedMotion = useReducedMotion()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to wait for the animation
      const timeout = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  const sendMessage = async (messageText?: string) => {
    const text = messageText ?? inputValue.trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationHistory: messages.slice(-6),
          message: text,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setDynamicSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Hmm, I'm having some trouble right now. Mind trying that again?",
          isUser: false,
          timestamp: new Date(),
        },
      ])
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

  const showSuggestions = messages.length <= 2 && !isLoading

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`chat-trigger-btn relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
            isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
          }`}
          whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.94 }}
          data-strength="0.2"
          data-cursor-text="AI Assistant"
          aria-label={isOpen ? "Close chat" : "Open AI Assistant"}
        >
          {/* Pulse ring */}
          {!isOpen && (
            <span className="chat-pulse-ring absolute inset-0 rounded-full" />
          )}

          {/* Icon */}
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.svg
                key="close"
                className="h-6 w-6 text-[rgb(var(--contrast-color))]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                className="h-6 w-6 text-[rgb(var(--contrast-color))]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed z-40 flex flex-col overflow-hidden ${
              isMobile
                ? "inset-0 rounded-none"
                : "bottom-24 right-6 h-[520px] w-[380px] rounded-[24px]"
            }`}
          >
            {/* Outer glass shell */}
            <div className="chat-glass-shell flex h-full flex-col overflow-hidden">
              {/* Header */}
              <div className="chat-header relative flex-shrink-0 px-5 py-4">
                {/* Gradient accent line */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--primary-color)_/_0.3)] to-transparent" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* AI avatar */}
                    <div className="chat-avatar relative flex h-9 w-9 items-center justify-center rounded-full">
                      <svg className="h-4 w-4 text-[rgb(var(--primary-color))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[rgb(var(--text-color))]">
                        AI Assistant
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--success-color))] shadow-[0_0_6px_rgb(var(--success-color)_/_0.5)]" />
                        <span className="text-[10px] text-[rgb(var(--text-secondary))]">Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Close button (mobile) */}
                  {isMobile && (
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--glass-bg)_/_0.6)] text-[rgb(var(--text-secondary))] transition-colors hover:text-[rgb(var(--text-color))]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages-area flex-1 overflow-y-auto px-4 py-3">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial={index === 0 ? false : "hidden"}
                      animate="visible"
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!message.isUser && (
                        <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgb(var(--primary-color)_/_0.1)]">
                          <svg className="h-3 w-3 text-[rgb(var(--primary-color))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                            />
                          </svg>
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                          message.isUser
                            ? "chat-msg-user rounded-br-md"
                            : "chat-msg-ai rounded-bl-md"
                        }`}
                      >
                        {message.isUser ? message.text : formatAIText(message.text)}
                      </div>
                    </motion.div>
                  ))}

                  {/* Suggestions */}
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="space-y-2 pt-1"
                    >
                      <p className="px-1 text-[10px] uppercase tracking-[0.2em] text-[rgb(var(--text-secondary)_/_0.6)]">
                        Try asking
                      </p>
                      {dynamicSuggestions.map((question, index) => (
                        <motion.button
                          key={`${question}-${index}`}
                          onClick={() => sendMessage(question)}
                          className="chat-suggestion-chip block w-full rounded-xl px-3 py-2.5 text-left text-xs leading-relaxed"
                          whileHover={prefersReducedMotion ? {} : { scale: 1.01, x: 2 }}
                          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                        >
                          <span className="mr-2 text-[rgb(var(--primary-color)_/_0.6)]">→</span>
                          {question}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {/* Typing indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgb(var(--primary-color)_/_0.1)]">
                        <svg className="h-3 w-3 text-[rgb(var(--primary-color))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                          />
                        </svg>
                      </div>
                      <div className="chat-msg-ai rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="chat-typing-dots flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--primary-color))]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--primary-color))]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--primary-color))]" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="chat-input-area relative flex-shrink-0 px-4 pb-4 pt-3">
                {/* Top gradient line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--glass-border)_/_0.12)] to-transparent" />

                <div className="chat-input-wrapper flex items-center gap-2 rounded-2xl px-3.5 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-sm text-[rgb(var(--text-color))] placeholder-[rgb(var(--text-secondary)_/_0.5)] outline-none"
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    className="chat-send-btn flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl disabled:opacity-30"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.06 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </motion.button>
                </div>

                <p className="mt-2 text-center text-[9px] text-[rgb(var(--text-secondary)_/_0.35)]">
                  AI-powered · Answers based on portfolio data
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
