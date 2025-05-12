"use client"

import { useEffect, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Education() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return // Skip animation for mobile view

    const handleScroll = () => {
      const leftElement = leftRef.current
      const rightElement = rightRef.current

      if (!leftElement || !rightElement) return

      const windowHeight = window.innerHeight
      const leftRect = leftElement.getBoundingClientRect()
      const rightRect = rightElement.getBoundingClientRect()

      // Calculate how far the element is from the viewport center
      const leftDistanceFromCenter = Math.abs(leftRect.top - windowHeight / 2)
      const rightDistanceFromCenter = Math.abs(rightRect.top - windowHeight / 2)

      // Calculate opacity and transform based on distance from center
      const leftOpacity = Math.max(0, Math.min(1, 1 - leftDistanceFromCenter / (windowHeight * 0.7)))
      const rightOpacity = Math.max(0, Math.min(1, 1 - rightDistanceFromCenter / (windowHeight * 0.7)))

      const leftTransform = Math.max(-100, Math.min(0, (leftOpacity - 0.3) * 150))
      const rightTransform = Math.max(-100, Math.min(0, (rightOpacity - 0.3) * 150))

      // Apply the styles
      leftElement.style.opacity = leftOpacity.toString()
      leftElement.style.transform = `translateX(${leftTransform}px)`

      rightElement.style.opacity = rightOpacity.toString()
      rightElement.style.transform = `translateX(${-rightTransform}px)`
    }

    // Initial check
    handleScroll()

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isMobile])

  // Mobile view education cards
  if (isMobile) {
    return (
      <section id="education" className="py-16 px-4 bg-dark-color">
        <h2 className="text-center text-3xl mb-10 relative inline-block left-1/2 transform -translate-x-1/2 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-primary-color after:to-accent-color after:rounded-sm">
          Educational Journey 🎓
        </h2>

        <div className="max-w-[400px] mx-auto space-y-6">
          {/* College Education Card */}
          <div className="bg-secondary-color rounded-lg overflow-hidden shadow-md relative border-l-4 border-primary-color">
            <div className="p-5">
              <div className="flex items-start mb-3">
                <div className="mr-4 text-primary-color">
                  <i className="fas fa-university text-3xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Pranveer Singh Institute of Technology</h3>
                  <p className="text-sm mb-1">B.Tech in Computer Science & Engineering</p>
                  <p className="text-sm text-muted-foreground">AKTU University | 2023-2027 | CGPA: 8.07</p>
                </div>
              </div>
            </div>
          </div>

          {/* School Education Card */}
          <div className="bg-secondary-color rounded-lg overflow-hidden shadow-md relative border-l-4 border-primary-color">
            <div className="p-5">
              <div className="flex items-start mb-3">
                <div className="mr-4 text-primary-color">
                  <i className="fas fa-graduation-cap text-3xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Delhi Public School, Barra Kanpur</h3>
                  <p className="text-sm mb-1">Intermediate (12th) - 86%</p>
                  <p className="text-sm text-muted-foreground">High School (10th) - 93.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Desktop/Tablet view with timeline
  return (
    <section id="education" className="py-20 px-8 bg-dark-color">
      <h2 className="text-center text-3xl mb-12 relative inline-block left-1/2 transform -translate-x-1/2 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-primary-color after:to-accent-color after:rounded-sm">
        Educational Journey 🎓
      </h2>

      <div className="max-w-[800px] mx-auto relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:transform before:-translate-x-1/2 before:w-0.5 before:h-full before:bg-primary-color">
        <div
          ref={leftRef}
          className="bg-secondary-color p-8 rounded-lg my-8 relative w-[calc(50%-30px)] shadow-md transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg left-0 before:content-[''] before:absolute before:top-5 before:right-[-40px] before:w-5 before:h-5 before:bg-primary-color before:rounded-full before:shadow-[0_0_10px_rgba(0,255,136,0.3)] before:z-10"
          style={{ opacity: 0, transform: "translateX(-100px)" }}
        >
          <div className="absolute top-[-25px] right-0 bg-primary-color text-dark-color py-1 px-2.5 rounded-sm text-xs font-medium">
            2023 - 2027
          </div>
          <i className="fas fa-university text-2xl text-primary-color mr-4"></i>
          <h3 className="text-lg mb-2 text-text-color">Pranveer Singh Institute of Technology</h3>
          <p className="text-text-secondary mb-1">B.Tech in Computer Science & Engineering</p>
          <p className="text-text-secondary">AKTU University | CGPA: 8.07</p>
        </div>

        <div
          ref={rightRef}
          className="bg-secondary-color p-8 rounded-lg my-8 relative w-[calc(50%-30px)] shadow-md transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg left-[calc(50%+30px)] before:content-[''] before:absolute before:top-5 before:left-[-40px] before:w-5 before:h-5 before:bg-primary-color before:rounded-full before:shadow-[0_0_10px_rgba(0,255,136,0.3)] before:z-10"
          style={{ opacity: 0, transform: "translateX(100px)" }}
        >
          <div className="absolute top-[-25px] left-0 bg-primary-color text-dark-color py-1 px-2.5 rounded-sm text-xs font-medium">
            2021 - 2023
          </div>
          <i className="fas fa-graduation-cap text-2xl text-primary-color mr-4"></i>
          <h3 className="text-lg mb-2 text-text-color">Delhi Public School, Barra Kanpur</h3>
          <p className="text-text-secondary mb-1">Intermediate (12th) - 86%</p>
          <p className="text-text-secondary">High School (10th) - 93.4%</p>
        </div>
      </div>
    </section>
  )
}
