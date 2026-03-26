"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

const roles = ["AI Developer", "Machine Learning Builder", "Full-Stack Problem Solver", "C++ and Python Engineer"]

const socialLinks = [
  {
    href: "https://github.com/Abhinav-2312307",
    label: "GitHub",
    icon: "fab fa-github",
  },
  {
    href: "https://www.linkedin.com/in/abhinav-sahu-865a01297/",
    label: "LinkedIn",
    icon: "fab fa-linkedin",
  },
  {
    href: "https://leetcode.com/u/lucifer_debug/",
    label: "LeetCode",
    icon: "fas fa-code",
  },
  {
    href: "mailto:2k23.cs2312307@gmail.com",
    label: "Email",
    icon: "far fa-envelope",
  },
]

export default function Hero() {
  const typingTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let index = 0
    let charIndex = 0
    let isDeleting = false
    let timeoutId = 0

    const updateText = () => {
      const currentText = roles[index]

      if (!typingTextRef.current) {
        return
      }

      if (isDeleting) {
        charIndex -= 1
      } else {
        charIndex += 1
      }

      typingTextRef.current.textContent = currentText.slice(0, charIndex)

      let delay = isDeleting ? 45 : 80

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true
        delay = 1400
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        index = (index + 1) % roles.length
        delay = 260
      }

      timeoutId = window.setTimeout(updateText, delay)
    }

    timeoutId = window.setTimeout(updateText, 350)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-6 py-16 md:px-10 lg:px-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,255,136,0.16),_transparent_36%),radial-gradient(circle_at_80%_20%,_rgba(0,204,255,0.18),_transparent_28%),linear-gradient(135deg,_rgba(18,18,18,0.96),_rgba(33,33,33,0.92))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-color/50 to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-text-secondary shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-primary-color shadow-[0_0_14px_var(--primary-color)]" />
            Available for impactful builds
          </div>

          <div className="space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-primary-light">Abhinav Sahu</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              Building thoughtful AI experiences that feel fast, useful, and polished.
            </h1>
            <div className="flex min-h-[2rem] items-center gap-3 text-base text-text-secondary md:text-xl">
              <span className="text-white">I am a</span>
              <span
                ref={typingTextRef}
                className="font-medium text-primary-color"
                aria-label="Animated role description"
              />
              <span className="hero-caret h-6 w-px bg-primary-color" />
            </div>
            <p className="max-w-2xl text-base leading-8 text-text-secondary md:text-lg">
              Computer Science undergraduate focused on AI, data-driven products, and full-stack engineering. I turn
              ideas into practical builds with clean interfaces, strong fundamentals, and real user value.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#projects"
              className="inline-flex items-center justify-center rounded-full bg-primary-color px-6 py-3 text-sm font-semibold text-dark-color transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-[0_16px_36px_rgba(0,255,136,0.28)]"
            >
              Explore Projects
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-color/40 hover:bg-white/10"
            >
              Let&apos;s Connect
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-2xl font-semibold text-white">10+</p>
              <p className="mt-1 text-sm text-text-secondary">Projects spanning AI, web apps, and problem-solving.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-2xl font-semibold text-white">3x</p>
              <p className="mt-1 text-sm text-text-secondary">Core strengths in AI, data science, and engineering.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-2xl font-semibold text-white">24/7</p>
              <p className="mt-1 text-sm text-text-secondary">Curiosity for building, iterating, and learning fast.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-color/40 hover:text-primary-color"
                aria-label={link.label}
              >
                <i className={link.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-primary-color/15 blur-3xl" />
          <div className="absolute -right-4 bottom-8 h-28 w-28 rounded-full bg-accent-color/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/6 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,_rgba(255,255,255,0.1),_transparent_40%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs uppercase tracking-[0.28em] text-text-secondary">
                <span>Featured Profile</span>
                <span className="text-primary-color">Online</span>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-[#08110f]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,136,0.18),_transparent_42%)]" />
                <Image
                  src="/profile.jpg"
                  alt="Portrait of Abhinav Sahu"
                  fill
                  priority
                  sizes="(max-width: 768px) 80vw, 320px"
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-text-secondary">Focus</p>
                  <p className="mt-1 font-medium text-white">AI + Product Thinking</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-text-secondary">Stack</p>
                  <p className="mt-1 font-medium text-white">Next.js, Python, C++</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
