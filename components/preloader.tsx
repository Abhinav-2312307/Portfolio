"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  const codeLines = [
    'import { Developer } from "Earth";',
    "",
    "const Abhinav = new Developer({",
    '  name: "Abhinav Sahu",',
    '  role: "Full Stack Developer & Innovator",',
    '  stack: ["C++", "Next.js", "NLP", "AWS", "Python"],',
    '  poweredBy: [anime("Eren Yeager"), code(), curiosity(), vision()],',
    '  status: "Crafting innovation... please wait ⏳"',
    "});",
    "",
    "await Abhinav.initialize();",
  ]

  useEffect(() => {
    // Auto-scroll terminal to bottom as text is typed
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }

    // Typing animation
    const typingInterval = setInterval(() => {
      if (currentLine < codeLines.length) {
        const currentLineText = codeLines[currentLine]

        if (currentChar < currentLineText.length) {
          // Still typing current line
          setCurrentChar(currentChar + 1)
        } else {
          // Move to next line
          setCurrentLine(currentLine + 1)
          setCurrentChar(0)
        }

        // Update progress based on how much of the code has been typed
        const totalChars = codeLines.join("").length
        const typedChars = codeLines.slice(0, currentLine).join("").length + currentChar
        const newProgress = Math.min(100, Math.floor((typedChars / totalChars) * 100))
        setProgress(newProgress)
      } else {
        // Typing complete
        setProgress(100)
        clearInterval(typingInterval)
      }
    }, 30) // Adjust typing speed here

    return () => clearInterval(typingInterval)
  }, [currentLine, currentChar])

  // Syntax highlighting function
  const highlightSyntax = (line: string) => {
    // Replace with more sophisticated highlighting if needed
    return line
      .replace(/(import|from|const|new|await)/g, '<span class="text-purple-400">$1</span>')
      .replace(/(Developer|initialize)/g, '<span class="text-yellow-300">$1</span>')
      .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
      .replace(/(\{|\}|$$|$$|\[|\])/g, '<span class="text-yellow-500">$1</span>')
      .replace(/(name|role|stack|poweredBy|status):/g, '<span class="text-blue-400">$1</span>')
      .replace(/(anime|code|curiosity|vision)/g, '<span class="text-red-400">$1</span>')
  }

  return (
    <div className="fixed inset-0 bg-dark-color flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-3xl">
        {/* Terminal window */}
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
          {/* Terminal header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="mx-auto text-sm text-gray-400">terminal@abhinav-sahu ~ </div>
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            className="p-4 font-mono text-sm md:text-base text-gray-200 h-64 overflow-y-auto"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <div className="text-gray-500 mb-2">$ node initialize.js</div>

            {/* Typed code */}
            {codeLines.slice(0, currentLine).map((line, index) => (
              <div key={index} className="whitespace-pre">
                <span dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }} />
              </div>
            ))}

            {/* Currently typing line */}
            {currentLine < codeLines.length && (
              <div className="whitespace-pre flex">
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightSyntax(codeLines[currentLine].substring(0, currentChar)),
                  }}
                />
                <span className="animate-pulse">|</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 h-2 mt-4 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-color"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="text-center mt-2 text-text-secondary text-sm">
          {progress < 100 ? "Loading..." : "Initialization complete!"}
        </div>
      </div>
    </div>
  )
}
