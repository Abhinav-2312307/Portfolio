"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import About from "@/components/about"
import BackToTop from "@/components/back-to-top"
import Contact from "@/components/contact"
import CursorEffect from "@/components/cursor-effect"
import Education from "@/components/education"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Hobbies from "@/components/hobbies"
import Navbar from "@/components/navbar"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import { useMobile } from "@/hooks/use-mobile"
import ScrollReveal from "@/components/scroll-reveal"
import Achievements from "@/components/achievements"

const ParticleBackground = dynamic(() => import("@/components/particle-background"), {
  ssr: false,
})

const AIChatbot = dynamic(() => import("@/components/ai-chatbot"), {
  ssr: false,
})

export default function Home() {
  const isMobile = useMobile()

  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        window.setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 100)
      }
    }

    window.addEventListener("load", handleHashNavigation)

    return () => {
      window.removeEventListener("load", handleHashNavigation)
    }
  }, [])

  return (
    <main className="min-h-screen bg-dark-color text-text-color overflow-x-hidden">
      {!isMobile && <CursorEffect key="cursor-effect" />}
      {!isMobile && <ParticleBackground />}
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
    </main>
  )
}
