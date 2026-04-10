"use client"

import { ArrowUpRight } from "lucide-react"

import { requestPortfolioScrollTo } from "@/lib/smooth-scroll"

const storyPoints = [
  "I approach projects like products, not isolated demos.",
  "I care about visual hierarchy, clear interaction, and system-level structure together.",
  "I learn fast, iterate hard, and keep refining until the experience feels intentional.",
]

const stats = [
  { label: "Years Coding", value: "2+" },
  { label: "Projects Built", value: "10+" },
  { label: "Problems Solved", value: "550+" },
  { label: "Focus Area", value: "AI + Full Stack" },
]

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(9,13,20,0.94))]" />
      <div className="absolute inset-y-0 left-[8%] w-px bg-gradient-to-b from-transparent via-primary-color/20 to-transparent" />
      <div className="absolute right-[10%] top-[18%] h-[15rem] w-[20rem] bg-[radial-gradient(circle,rgba(79,239,255,0.1),transparent_70%)] blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-primary-light">About</p>
            <h2 className="mt-3 text-[clamp(2.4rem,5vw,4.1rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-text-color">
              Building with curiosity and product discipline.
            </h2>
          </div>

          <div className="glass-panel-strong rounded-[30px] p-6">
            <p className="text-base leading-8 text-text-color">
              I&apos;m a Computer Science undergraduate who enjoys turning ambitious ideas into usable digital products.
              My work sits at the intersection of AI, full-stack engineering, and interface design, with a strong bias
              toward clarity over noise.
            </p>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              What keeps me interested is the full journey: understanding the problem, shaping the experience, building
              the system, and then refining the rough edges until the result feels solid.
            </p>
          </div>

          <button
            type="button"
            onClick={() => requestPortfolioScrollTo({ id: "contact", offset: -110 })}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgb(var(--primary-color)_/_0.94),rgb(var(--accent-color)_/_0.84))] px-6 py-3.5 text-sm font-semibold text-contrast-color shadow-[0_14px_34px_rgb(var(--primary-color)_/_0.16)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Let&apos;s Work Together
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div className="glass-panel rounded-[30px] p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-text-secondary">How I work</p>
            <div className="mt-5 space-y-4">
              {storyPoints.map((point, index) => (
                <div key={point} className="flex items-start gap-4">
                  <span className="mt-1 text-xs text-primary-color">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-7 text-text-secondary">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((item) => (
              <div key={item.label} className="glass-panel rounded-[24px] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-text-secondary">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-text-color">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
