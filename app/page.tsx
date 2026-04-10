"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import About from "@/components/about"
import BackToTop from "@/components/back-to-top"
import Contact from "@/components/contact"
import Education from "@/components/education"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Hobbies from "@/components/hobbies"
import Navbar from "@/components/navbar"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import ScrollReveal from "@/components/scroll-reveal"
import Achievements from "@/components/achievements"
import ScrollLightBackdrop from "@/components/scroll-light-backdrop"
import { requestPortfolioScrollTo } from "@/lib/smooth-scroll"

const SmoothScroll = dynamic(() => import("@/components/locomotive-scroll"), {
  ssr: false,
})

const AIChatbot = dynamic(() => import("@/components/ai-chatbot"), {
  ssr: false,
})

export default function Home() {
  useEffect(() => {
    const handleHashNavigation = () => {
      const sectionId = window.location.hash.replace("#", "")

      if (!sectionId) {
        return
      }

      window.setTimeout(() => {
        requestPortfolioScrollTo({
          duration: 950,
          id: sectionId,
          offset: -100,
        })
      }, 120)
    }

    window.addEventListener("load", handleHashNavigation)
    window.addEventListener("hashchange", handleHashNavigation)

    return () => {
      window.removeEventListener("load", handleHashNavigation)
      window.removeEventListener("hashchange", handleHashNavigation)
    }
  }, [])

  return (
    <main className="page-ambient relative min-h-screen overflow-x-clip bg-dark-color text-text-color">
      <ScrollLightBackdrop />
      <BackToTop />
      <Navbar />

      <SmoothScroll>
        <div className="relative z-10">
          <Hero />

          <ScrollReveal>
            <About />
          </ScrollReveal>

          <ScrollReveal>
            <Education />
          </ScrollReveal>

          <Skills />

          <Projects />

          <ScrollReveal>
            <Achievements />
          </ScrollReveal>

          <ScrollReveal>
            <Hobbies />
          </ScrollReveal>

          <ScrollReveal>
            <Contact />
          </ScrollReveal>

          <div data-scroll-section>
            <Footer />
          </div>
        </div>
      </SmoothScroll>

      <div className="relative z-20">
        <AIChatbot />
      </div>
    </main>
  )
}
