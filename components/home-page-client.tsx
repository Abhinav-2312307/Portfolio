"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"

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
import TargetCursor from "@/components/target-cursor"
import Preloader from "@/components/preloader"
import type { PortfolioContent } from "@/lib/portfolio/schema"
import { requestPortfolioScrollTo } from "@/lib/smooth-scroll"

const AIChatbot = dynamic(() => import("@/components/ai-chatbot"), {
  ssr: false,
})

type HomePageClientProps = {
  content: PortfolioContent
}

export default function HomePageClient({ content }: HomePageClientProps) {
  const [showPreloader, setShowPreloader] = useState(true)
  
  // Easter Egg States
  const [isTransforming, setIsTransforming] = useState(false)
  const [lightningFlash, setLightningFlash] = useState(false)

  // Hash Navigation scroll
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

  // Konami Code Easter Egg Key Listener
  useEffect(() => {
    if (showPreloader) return

    const konami = [
      "ArrowUp", "ArrowUp",
      "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight",
      "ArrowLeft", "ArrowRight",
      "b", "a"
    ]
    let index = 0

    const triggerTitanTransformation = () => {
      setIsTransforming(true)
      setLightningFlash(true)

      // Play thunder strike audio
      const isMuted = localStorage.getItem("portfolio-muted") !== "false"
      if (!isMuted) {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1657/1657-84.wav") // Thunder SFX
        audio.volume = 0.5
        audio.play().catch(() => {})
      }

      // Flash resets quickly, screen shake lasts longer
      setTimeout(() => {
        setLightningFlash(false)
      }, 700)

      setTimeout(() => {
        setIsTransforming(false)
        alert(
          "WARNING: TITAN TRANSFORMATION INITIATED.\n\n\"Hear me, all Subjects of Ymir. My name is Eren Yeager. The walls of Paradise have crumbled...\"\n\n[Freedom Coordinate unlocked: you can now control the Rumbling]"
        )
      }, 2000)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konami[index]) {
        index++
        if (index === konami.length) {
          triggerTitanTransformation()
          index = 0
        }
      } else {
        index = 0
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showPreloader])

  return (
    <AnimatePresence mode="wait">
      {showPreloader ? (
        <Preloader key="preloader" onFinish={() => setShowPreloader(false)} />
      ) : (
        <motion.main
          key="main-content"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`page-ambient relative min-h-screen overflow-x-clip bg-dark-color text-text-color transition-all ${
            isTransforming ? "animate-shake pointer-events-none" : ""
          }`}
        >
          {/* Lightning Flash Overlay */}
          {lightningFlash && (
            <div className="fixed inset-0 z-[10000] bg-yellow-100/90 mix-blend-color-dodge animate-pulse" />
          )}

          <TargetCursor
            spinDuration={2.2}
            hoverDuration={0.2}
            hideDefaultCursor
            parallaxOn
            targetSelector="button, a, [data-cursor-target='true'], .cursor-target"
          />
          <ScrollLightBackdrop />
          <BackToTop />
          
          <Navbar
            items={content.navigation.items}
            identity={content.identity}
            resumeUrl={content.identity.resumeUrl}
          />

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
        </motion.main>
      )}
    </AnimatePresence>
  )
}
