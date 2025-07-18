"use client"

import { useEffect, useState } from "react"
import About from "@/components/about"
import BackToTop from "@/components/back-to-top"
import Contact from "@/components/contact"
import CursorEffect from "@/components/cursor-effect"
import Education from "@/components/education"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Hobbies from "@/components/hobbies"
import Navbar from "@/components/navbar"
import ParticleBackground from "@/components/particle-background"
import Preloader from "@/components/preloader"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import { useMobile } from "@/hooks/use-mobile"
import ScrollReveal from "@/components/scroll-reveal"
import Achievements from "@/components/achievements" // ❗️Missing line
import AIChatbot from "@/components/ai-chatbot"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import { useActiveSection } from "@/hooks/use-active-section"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const isMobile = useMobile()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    // Handle hash navigation on page load
    const handleHashNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 100)
      }
    }

    window.addEventListener("load", handleHashNavigation)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("load", handleHashNavigation)
    }
  }, [])

  return (
    <main className="min-h-screen bg-dark-color text-text-color overflow-x-hidden">
      {loading ? (
        <Preloader />
      ) : (
        <>
          {!isMobile && <CursorEffect key="cursor-effect" />}
          <ParticleBackground />
          <BackToTop />
          <Navbar />

          <section id="hero" className="pt-16 md:pt-20">
            <Hero />
          </section>

          <ScrollReveal id="about">
            <About />
          </ScrollReveal>

          <ScrollReveal id="education">
            <Education />
          </ScrollReveal>

          <ScrollReveal id="skills">
            <Skills />
          </ScrollReveal>

          <ScrollReveal id="projects">
            <Projects />
          </ScrollReveal>

          <ScrollReveal id="achievements">
            <Achievements />
          </ScrollReveal>

          <ScrollReveal id="hobbies">
            <Hobbies />
          </ScrollReveal>

          <ScrollReveal id="contact">
            <Contact />
          </ScrollReveal>

          <Footer />
          <AIChatbot />
          
        </>
      )}
    </main>
  )
}
