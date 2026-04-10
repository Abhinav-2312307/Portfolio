"use client"

import { useEffect, useRef } from "react"

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "[role='button']",
  ".project-card",
  "[data-cursor-text]",
].join(",")

export default function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches

    if (!supportsFinePointer) {
      return
    }

    const cursor = cursorRef.current
    const cursorText = cursorTextRef.current

    if (!cursor || !cursorText) {
      return
    }

    document.body.style.cursor = "none"

    let frameId = 0
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentX = mouseX
    let currentY = mouseY
    let isHovering = false

    const updateCursor = () => {
      const dx = mouseX - currentX
      const dy = mouseY - currentY

      // Only update transforms when cursor has moved meaningfully
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        currentX += dx * 0.22
        currentY += dy * 0.22

        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
        cursorText.style.transform = `translate3d(${currentX}px, ${currentY - 28}px, 0) translate(-50%, -50%)`
      }

      frameId = window.requestAnimationFrame(updateCursor)
    }

    const handlePointerMove = (event: PointerEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY

      const target = (event.target as Element | null)?.closest(interactiveSelector)
      const nextText = target?.getAttribute("data-cursor-text") ?? ""

      if (target && !isHovering) {
        cursor.classList.add("cursor-hover")
        isHovering = true
      } else if (!target && isHovering) {
        cursor.classList.remove("cursor-hover")
        isHovering = false
      }

      cursorText.textContent = nextText
      cursorText.style.opacity = nextText ? "1" : "0"
    }

    const handlePointerLeave = () => {
      cursor.classList.remove("cursor-hover")
      cursorText.style.opacity = "0"
      isHovering = false
    }

    frameId = window.requestAnimationFrame(updateCursor)
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
      document.body.style.cursor = ""
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2 L12 7" stroke="#4ff0ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 17 L12 22" stroke="#4ff0ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 12 L7 12" stroke="#4ff0ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 12 L22 12" stroke="#4ff0ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 7 L17 12 L12 17 L7 12 Z" stroke="#4ff0ff" strokeWidth="1.7" fill="rgba(79,240,255,0.12)" />
          <path d="M12 9.5 L14.5 12 L12 14.5 L9.5 12 Z" fill="#4ff0ff" />
        </svg>
      </div>
      <div ref={cursorTextRef} className="cursor-text" />
    </>
  )
}
