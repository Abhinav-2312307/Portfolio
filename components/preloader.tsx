"use client"

import { useEffect, useState, useRef } from "react"

export default function Preloader({ onFinish }: { onFinish?: () => void }) {
  const fullCode = `import { Developer } from 'Earth';

const Abhinav = new Developer({
  name: 'Abhinav Sahu',
  role: 'Full Stack Developer & Innovator',
  stack: ['C++', 'Next.js', 'NLP', 'AWS', 'Python'],
  poweredBy: [anime('Eren Yeager'), code(), curiosity(), vision()],
  status: 'Crafting innovation... please wait ⏳'
});

await Abhinav.initialize();
// Loading complete... Welcome!`

  const typingSpeed = 20 // Slower typing speed for better readability
  const [typedCode, setTypedCode] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const hasTyped = useRef(false)
  const cursorRef = useRef<HTMLSpanElement>(null)

  // Handle the typing animation
  useEffect(() => {
    if (hasTyped.current) return
    hasTyped.current = true

    let i = 0
    const typeNextCharacter = () => {
      if (i < fullCode.length) {
        setTypedCode((prev) => prev + fullCode[i])
        i++
        setTimeout(
          typeNextCharacter,
          // Vary typing speed slightly for more natural effect
          fullCode[i - 1] === "\n"
            ? typingSpeed * 3
            : fullCode[i - 1] === "."
              ? typingSpeed * 2
              : typingSpeed * (0.8 + Math.random() * 0.4),
        )
      } else {
        // Typing complete
        setIsComplete(true)

        // Wait a moment before starting fade out
        setTimeout(() => {
          setOpacity(0)

          // Wait for fade out animation to complete before calling onFinish
          setTimeout(() => {
            // Safely call onFinish if it exists
            if (typeof onFinish === "function") {
              onFinish()
            }
          }, 800)
        }, 1200) // Pause to read the completed code
      }
    }

    // Start typing after a short delay
    setTimeout(typeNextCharacter, 500)

    return () => {}
  }, [onFinish])

  // Blinking cursor effect
  useEffect(() => {
    if (!cursorRef.current) return

    const blinkInterval = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = cursorRef.current.style.opacity === "0" ? "1" : "0"
      }
    }, 530)

    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-dark-color flex justify-center items-center z-[9999]"
      style={{
        opacity: opacity,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      <div className="text-center max-w-md w-full px-6">
        <div className="text-left text-sm md:text-base font-mono mb-6 overflow-x-auto whitespace-pre-wrap text-white bg-black/30 p-4 rounded-md shadow-lg border border-primary-color/30">
          <pre className="relative">
            {typedCode}
            <span
              ref={cursorRef}
              className="inline-block w-2 h-4 bg-primary-color ml-1 absolute"
              style={{
                animation: isComplete ? "none" : undefined,
                opacity: isComplete ? 0 : 1,
              }}
            ></span>
          </pre>
        </div>
        {isComplete && <div className="text-primary-color animate-pulse mt-4">Loading complete...</div>}
      </div>
    </div>
  )
}
