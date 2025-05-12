"use client"

import { useEffect, useState } from "react"

export default function Preloader() {
  const fullCode = `import { Developer } from 'Earth';

const Abhinav = new Developer({
  name: 'Abhinav Sahu',
  role: 'Full Stack Developer & Innovator',
  stack: ['C++', 'Next.js', 'NLP', 'AWS', 'Python'],
  poweredBy: [anime('Eren Yeager'), code(), curiosity(), vision()],
  status: 'Crafting innovation... please wait ⏳'
});

await Abhinav.initialize();`

  const typingSpeed = 30 // ms per character
  const totalTypingTime = fullCode.length * typingSpeed // total ms
  const [typedCode, setTypedCode] = useState("")
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < fullCode.length) {
        setTypedCode((prev) => prev + fullCode[i])
        i++
      } else {
        clearInterval(interval)
      }
    }, typingSpeed)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const totalSteps = 100
    const progressInterval = totalTypingTime / totalSteps // e.g., ~180ms
    let current = 0
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (current >= totalSteps) {
          clearInterval(interval)
          setTimeout(() => setIsVisible(false), 800) // final pause
          return 100
        }
        current++
        return current
      })
    }, progressInterval)

    return () => clearInterval(interval)
  }, [totalTypingTime])

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-dark-color flex justify-center items-center z-[9999] transition-opacity duration-500 ${
        progress === 100 ? "opacity-0" : "opacity-100"
      }`}
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <div className="text-center max-w-md w-full px-6">
        <pre className="text-left text-sm md:text-base font-mono mb-6 overflow-x-auto whitespace-pre-wrap text-white">
          {typedCode}
        </pre>
        <div className="w-full bg-secondary-color/30 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-color transition-all duration-300 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-shine"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
