"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"

import About from "@/components/about"
import Achievements from "@/components/achievements"
import AppWrapper from "@/components/AppWrapper"
import BackToTop from "@/components/back-to-top"
import Contact from "@/components/contact"
import Education from "@/components/education"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Hobbies from "@/components/hobbies"
import Navbar from "@/components/navbar"
import Projects from "@/components/projects"
import ScrollLightBackdrop from "@/components/scroll-light-backdrop"
import ScrollReveal from "@/components/scroll-reveal"
import Skills from "@/components/skills"
import type { PortfolioContent } from "@/lib/portfolio/schema"
import { requestPortfolioScrollTo } from "@/lib/smooth-scroll"

const AIChatbot = dynamic(() => import("@/components/ai-chatbot"), {
  ssr: false,
})

type HomePageClientProps = {
  content: PortfolioContent
}

export default function HomePageClient({ content }: HomePageClientProps) {
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
      <Navbar items={content.navigation.items} identity={content.identity} resumeUrl={content.identity.resumeUrl} />

      <AppWrapper>
        <div className="relative z-10">
          <Hero hero={content.hero} identity={content.identity} socialLinks={content.socialLinks} />

          <ScrollReveal>
            <About about={content.about} />
          </ScrollReveal>

          <ScrollReveal>
            <Education education={content.education} />
          </ScrollReveal>

          <Skills skills={content.skills} />

          <Projects projects={content.projects} />

          <ScrollReveal>
            <Achievements achievements={content.achievements} />
          </ScrollReveal>

          <ScrollReveal>
            <Hobbies hobbies={content.hobbies} />
          </ScrollReveal>

          <ScrollReveal>
            <Contact contact={content.contact} identity={content.identity} socialLinks={content.socialLinks} />
          </ScrollReveal>

          <div data-scroll-section>
            <Footer
              footer={content.footer}
              identity={content.identity}
              items={content.navigation.items}
              socialLinks={content.socialLinks}
            />
          </div>
        </div>
      </AppWrapper>

      <div className="relative z-20">
        <AIChatbot assistant={content.assistant} />
      </div>
    </main>
  )
}
