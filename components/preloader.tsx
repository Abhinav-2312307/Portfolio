"use client"

import { useEffect, useState, useRef } from "react"

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const fullCode = `import { Developer } from 'Earth';

const Abhinav = new Developer({
  name: 'Abhinav Sahu',
  role: 'Full Stack Developer & Innovator',
  stack: ['C++', 'Next.js', 'NLP', 'AWS', 'Python'],
  poweredBy: [anime('Eren Yeager'), code(), curiosity(), vision()],
  status: 'Crafting innovation... please wait ⏳'
});

await Abhinav.initialize();`

  const typingSpeed = 15
  const totalTypingTime = 2* fullCode.length * typingSpeed + 2000
  const [typedCode, setTypedCode] = useState("")
  const [progress, setProgress] = useState(0)
  const hasTyped = useRef(false)

  useEffect(() => {
    if (hasTyped.current) return
    hasTyped.current = true

    let i = 0
    const interval = setInterval(() => {
      if (i < fullCode.length) {
        setTypedCode((prev) => prev + fullCode[i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => onFinish(), 500)
      }
    }, typingSpeed)

    return () => clearInterval(interval)
  }, [onFinish])

  useEffect(() => {
    const steps = 100
    const intervalTime = totalTypingTime / steps
    let current = 0

    const interval = setInterval(() => {
      if (current >= steps) {
        clearInterval(interval)
      } else {
        setProgress(current)
        current++
      }
    }, intervalTime)

    return () => clearInterval(interval)
  }, [totalTypingTime])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-dark-color flex justify-center items-center z-[9999] transition-opacity duration-500">
      <div className="text-center max-w-md w-full px-6">
        <pre className="text-left text-sm md:text-base font-mono mb-6 overflow-x-auto whitespace-pre-wrap text-white">
          {typedCode}
        </pre>
        <div className="relative w-full h-1 bg-secondary-color/30 rounded-full overflow-hidden">
          <div className="absolute left-1/2 top-0 h-full bg-primary-color rounded-full origin-center transition-all duration-100"
               style={{
                 transform: `translateX(-50%)`,
                 width: `${progress}%`
               }}
          />
        </div>
      </div>
    </div>
  )
}
