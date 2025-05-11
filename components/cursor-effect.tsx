"use client"

import { useEffect, useRef } from "react"

export default function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none"

    const cursor = cursorRef.current
    const cursorText = cursorTextRef.current

    if (!cursor || !cursorText) return

    // Add SVG to cursor
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.setAttribute("fill", "none")
    svg.innerHTML = `
      <circle cx="12" cy="12" r="8" stroke="#00ff88" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="#00ff88" />
    `
    cursor.appendChild(svg)

    // Mouse move handler with requestAnimationFrame for smoother performance
    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Update cursor position with RAF for better performance
    const updateCursorPosition = () => {
      if (cursor && cursorText) {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
        cursorText.style.transform = `translate(${mouseX}px, ${mouseY - 30}px) translate(-50%, -50%)`
      }
      requestAnimationFrame(updateCursorPosition)
    }

    // Handle cursor hover states
    const handleCursorHover = () => {
      const hoverElements = document.querySelectorAll(
        "a, button, .skill-card, .hobby-card, .project-card, .education-card, .magnetic-element, input, textarea",
      )

      hoverElements.forEach((element) => {
        element.addEventListener("mouseenter", () => {
          cursor.classList.add("cursor-hover")

          // Show cursor text if available
          const cursorTextContent = element.getAttribute("data-cursor-text")
          if (cursorTextContent) {
            cursorText.textContent = cursorTextContent
            cursorText.style.opacity = "1"
          }
        })

        element.addEventListener("mouseleave", () => {
          cursor.classList.remove("cursor-hover")
          cursorText.style.opacity = "0"
        })
      })
    }

    // Magnetic effect for elements (optimized)
    const handleMagneticElements = () => {
      const magneticElements = document.querySelectorAll(".magnetic-element")

      magneticElements.forEach((element) => {
        const strength = Number.parseFloat(element.getAttribute("data-strength") || "0.1")

        element.addEventListener("mousemove", (e) => {
          const rect = element.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2

          const distanceX = e.clientX - centerX
          const distanceY = e.clientY - centerY

          const translateX = distanceX * strength
          const translateY = distanceY * strength

          requestAnimationFrame(() => {
            ;(element as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`
          })
        })

        element.addEventListener("mouseleave", () => {
          requestAnimationFrame(() => {
            ;(element as HTMLElement).style.transform = "translate(0, 0)"
            ;(element as HTMLElement).style.transition = "transform 0.5s ease-out"
          })
        })
      })
    }

    // Initialize
    document.addEventListener("mousemove", onMouseMove)
    requestAnimationFrame(updateCursorPosition)
    handleCursorHover()
    handleMagneticElements()

    // Add cleanup to restore default cursor when component unmounts
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.body.style.cursor = "auto"
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor"></div>
      <div ref={cursorTextRef} className="cursor-text"></div>
    </>
  )
}
