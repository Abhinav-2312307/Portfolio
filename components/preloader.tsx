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

  const typingSpeed = 15
  const [typedCode, setTypedCode] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < fullCode.length) {
        setTypedCode((prev) => prev + fullCode[i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setIsVisible(false), 500) // slight pause after finish
      }
    }, typingSpeed)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-dark-color flex justify-center items-center z-[9999] transition-opacity duration-500">
      <div className="text-center max-w-md w-full px-6">
        <pre className="text-left text-sm md:text-base font-mono mb-6 overflow-x-auto whitespace-pre-wrap text-white">
          {typedCode}
        </pre>
      </div>
    </div>
  )
}
