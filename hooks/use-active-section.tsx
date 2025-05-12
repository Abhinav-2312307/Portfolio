"use client"

import { useState, useEffect } from "react"

export function useActiveSection(sections: string[], offset = 100) {
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.scrollY
      let newActiveSection = ""

      // Find the current section based on scroll position
      for (const section of sections) {
        const element = document.getElementById(section)
        if (!element) continue

        const elementTop = element.offsetTop - offset
        const elementBottom = elementTop + element.offsetHeight

        if (pageYOffset >= elementTop && pageYOffset < elementBottom) {
          newActiveSection = section
          break
        }
      }

      // If we're at the very bottom of the page, set the last section as active
      if (window.innerHeight + pageYOffset >= document.body.offsetHeight - 100) {
        newActiveSection = sections[sections.length - 1]
      }

      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeSection, offset, sections])

  return activeSection
}
