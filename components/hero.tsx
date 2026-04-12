"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef } from "react"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { HeroContent, Identity, SocialLink } from "@/lib/portfolio/schema"
import { requestPortfolioScrollTo } from "@/lib/smooth-scroll"

type HeroProps = {
  hero?: HeroContent
  identity?: Identity
  socialLinks?: SocialLink[]
}

export default function Hero({
  hero = defaultPortfolioContent.hero,
  identity = defaultPortfolioContent.identity,
  socialLinks = defaultPortfolioContent.socialLinks,
}: HeroProps) {
  const typingTextRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!typingTextRef.current) {
      return
    }

    if (prefersReducedMotion) {
      typingTextRef.current.textContent = hero.roles[0] ?? ""
      return
    }

    let index = 0
    let charIndex = 0
    let isDeleting = false
    let timeoutId = 0

    const updateText = () => {
      const currentText = hero.roles[index] ?? ""

      if (!typingTextRef.current) {
        return
      }

      charIndex += isDeleting ? -1 : 1
      typingTextRef.current.textContent = currentText.slice(0, charIndex)

      let delay = isDeleting ? 42 : 74

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true
        delay = 1200
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        index = (index + 1) % hero.roles.length
        delay = 220
      }

      timeoutId = window.setTimeout(updateText, delay)
    }

    typingTextRef.current.textContent = ""
    timeoutId = window.setTimeout(updateText, 260)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [hero.roles, prefersReducedMotion])

  return (
    <section
      id="home"
      data-scroll-section
      className="relative overflow-hidden px-6 pb-20 pt-28 md:px-10 md:pb-24 lg:px-16 lg:pb-28 lg:pt-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--dark-color)_/_0.95),rgb(var(--dark-color)_/_0.84)_54%,rgb(var(--secondary-color)_/_0.94))]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="absolute left-[-8%] top-[16%] h-px w-[34rem] rotate-[12deg] bg-gradient-to-r from-transparent via-primary-color/38 to-transparent" />
      <div className="absolute right-[-10%] top-[20%] h-[16rem] w-[26rem] -rotate-[14deg] bg-[linear-gradient(90deg,transparent,rgba(90,121,255,0.12),transparent)] blur-3xl" />

      <div
        data-scroll
        data-scroll-speed="-0.28"
        className="pointer-events-none absolute right-[2%] top-[7rem] hidden text-[clamp(4.5rem,11vw,9rem)] font-semibold uppercase tracking-[-0.08em] text-[rgb(var(--overlay-color)_/_0.08)] xl:block"
      >
        {hero.backgroundWord}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div data-scroll data-scroll-speed="0.24">
          <motion.div
            className="space-y-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="glass-pill inline-flex items-center gap-3 px-4 py-2 text-[0.64rem] uppercase tracking-[0.34em] text-text-secondary"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.44 }}
            >
              <span className="h-2 w-2 rounded-full bg-primary-color shadow-[0_0_12px_rgb(var(--primary-color)/0.45)]" />
              {hero.badge}
            </motion.div>

            <div className="space-y-5">
              <motion.p
                className="text-[0.78rem] font-medium uppercase tracking-[0.42em] text-primary-light"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.44 }}
              >
                {hero.eyebrow}
              </motion.p>

              <motion.h1
                className="max-w-3xl text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-text-color"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.68 }}
              >
                {hero.headline}
              </motion.h1>

              <motion.p
                className="max-w-2xl text-base leading-8 text-text-secondary md:text-lg"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.5 }}
              >
                {hero.intro}
              </motion.p>

              <motion.div
                className="flex min-h-[2rem] flex-wrap items-center gap-3 text-sm text-text-secondary md:text-lg"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.48 }}
              >
                <span className="text-text-color">{hero.typingPrefix}</span>
                <span ref={typingTextRef} className="font-medium text-primary-color" aria-label="Animated role description" />
                <span className="hero-caret h-5 w-px bg-primary-color" />
              </motion.div>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.48 }}
            >
              <button
                type="button"
                onClick={() => requestPortfolioScrollTo({ id: "projects", offset: -110 })}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,rgb(var(--primary-color)_/_0.96),rgb(var(--accent-color)_/_0.82))] px-6 py-3.5 text-sm font-semibold text-contrast-color shadow-[0_16px_36px_rgb(var(--primary-color)_/_0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgb(var(--primary-color)_/_0.22)]"
              >
                {hero.primaryCtaLabel}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => requestPortfolioScrollTo({ id: "contact", offset: -110 })}
                className="glass-pill inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-text-color transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-color/40 hover:text-primary-color"
              >
                {hero.secondaryCtaLabel}
              </button>
            </motion.div>

            <motion.div
              className="grid gap-4 lg:grid-cols-[1.18fr_0.82fr]"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.54 }}
            >
              <div className="glass-panel-strong rounded-[28px] p-5">
                <p className="text-[0.64rem] uppercase tracking-[0.34em] text-text-secondary">{hero.capabilitySectionTitle}</p>
                <div className="mt-5 grid gap-3">
                  {hero.capabilityRows.map((row, index) => (
                    <div key={row} className="flex items-start gap-3">
                      <span className="mt-1 text-xs text-primary-color">{String(index + 1).padStart(2, "0")}</span>
                      <p className="text-sm leading-7 text-text-color">{row}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-[28px] p-5">
                <p className="text-[0.64rem] uppercase tracking-[0.34em] text-text-secondary">Socials</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="glass-pill inline-flex h-11 w-11 items-center justify-center text-base text-text-color transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-color/36 hover:text-primary-color"
                      aria-label={link.label}
                    >
                      <i className={link.iconClass} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div data-scroll data-scroll-speed="0.34">
          <motion.div
            className="relative mx-auto w-full max-w-[31rem] pt-2 lg:pt-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute left-0 right-8 top-0 h-px bg-gradient-to-r from-transparent via-primary-color/38 to-transparent" />
            <div className="absolute -left-4 top-14 h-20 w-px bg-gradient-to-b from-primary-color/60 to-transparent" />

            <div className="glass-panel-strong relative rounded-[34px] border border-[rgb(var(--glass-border)_/_0.14)] bg-[linear-gradient(155deg,rgb(var(--glass-bg-strong)_/_0.92),rgb(var(--glass-bg)_/_0.56))] p-4 md:p-5">
              <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.06),transparent_42%,transparent_74%,rgba(79,239,255,0.05))]" />

              <div className="relative space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="glass-pill inline-flex items-center gap-2 px-4 py-2 text-[0.64rem] uppercase tracking-[0.3em] text-text-secondary">
                    <span className="h-2 w-2 rounded-full bg-primary-color" />
                    {hero.featuredProfileLabel}
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm text-primary-color">
                    <Sparkles size={15} />
                    {hero.availabilityText}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[0.88fr_1fr]">
                  <div className="glass-panel relative self-stretch overflow-hidden rounded-[24px] border border-[rgb(var(--glass-border)_/_0.14)] bg-[linear-gradient(160deg,rgb(var(--glass-bg-strong)_/_0.92),rgb(var(--glass-bg)_/_0.58))] p-2.5">
                    <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(79,239,255,0.12),transparent)]" />
                    <div className="relative h-full min-h-[16rem] overflow-hidden rounded-[18px]">
                      <Image
                        src={identity.profileImageUrl}
                        alt={`Portrait of ${identity.fullName}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 80vw, 320px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="glass-panel rounded-[20px] p-4">
                      <p className="text-[0.64rem] uppercase tracking-[0.3em] text-text-secondary">{hero.currentFocusLabel}</p>
                      <p className="mt-2 text-base font-medium leading-7 text-text-color">{hero.currentFocusText}</p>
                    </div>

                    <div className="glass-panel rounded-[20px] p-4">
                      <p className="text-[0.64rem] uppercase tracking-[0.3em] text-text-secondary">{hero.primaryStackLabel}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {hero.primaryStack.map((item) => (
                          <span key={item} className="glass-pill px-3 py-1.5 text-xs text-text-color">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel flex-1 rounded-[20px] p-4">
                      <p className="text-[0.64rem] uppercase tracking-[0.3em] text-text-secondary">{hero.buildingLabel}</p>
                      <p className="mt-2 text-sm leading-7 text-text-secondary">{hero.buildingText}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {hero.stats.map((item) => (
                    <div key={item.label} className="glass-panel rounded-[18px] px-4 py-3">
                      <p className="text-[0.64rem] uppercase tracking-[0.26em] text-text-secondary">{item.label}</p>
                      <p className="mt-2 text-sm font-medium text-text-color">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
