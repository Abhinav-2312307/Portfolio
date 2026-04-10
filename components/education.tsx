"use client"

import { motion, useReducedMotion } from "framer-motion"
import { GraduationCap, School, Sparkles, University } from "lucide-react"

const educationItems = [
  {
    Icon: University,
    meta: "2023 - 2027",
    points: ["B.Tech in Computer Science & Engineering", "AKTU University", "CGPA: 8.07"],
    speed: "0.22",
    title: "Pranveer Singh Institute of Technology",
  },
  {
    Icon: School,
    meta: "2021 - 2023",
    points: ["Intermediate (12th) - 86%", "High School (10th) - 93.4%"],
    speed: "0.34",
    title: "Delhi Public School, Barra Kanpur",
  },
]

export default function Education() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      id="education"
      className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,22,0.96),rgba(7,10,16,0.98))]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:86px_86px]" />
      <div className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-color/28 to-transparent" />
      <div className="absolute right-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-primary-light">Education</p>
            <h2 className="mt-3 text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-text-color">
              Journey
            </h2>
          </div>

          <div className="glass-pill inline-flex items-center gap-2 self-start px-4 py-2 text-xs uppercase tracking-[0.3em] text-text-secondary">
            <Sparkles size={14} className="text-primary-color" />
            Foundations that shape the builds
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-primary-color/55 via-accent-color/28 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-8">
            {educationItems.map((item, index) => {
              const isRight = index % 2 === 1
              const Icon = item.Icon

              return (
                <div
                  key={item.title}
                  className="relative md:grid md:grid-cols-2 md:gap-10"
                >
                  <div className={isRight ? "md:col-start-2" : undefined}>
                    <motion.article
                      className="glass-panel-strong relative ml-12 rounded-[30px] border border-white/10 p-6 md:ml-0"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: isRight ? 36 : -36, y: 30 }}
                      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, amount: 0.28 }}
                      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div
                        className={`absolute left-[-2.65rem] top-8 flex h-8 w-8 items-center justify-center rounded-full border border-primary-color/35 bg-dark-color text-primary-color shadow-[0_0_24px_rgb(var(--primary-color)/0.16)] md:top-10 ${
                          isRight ? "md:left-[-2.65rem]" : "md:left-auto md:right-[-2.65rem]"
                        }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-primary-color" />
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <div className="glass-pill inline-flex h-14 w-14 items-center justify-center rounded-[18px] text-primary-color">
                          <Icon size={24} />
                        </div>
                        <span className="text-xs uppercase tracking-[0.28em] text-text-secondary">{item.meta}</span>
                      </div>

                      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-text-color">{item.title}</h3>

                      <div className="mt-5 space-y-3">
                        {item.points.map((point) => (
                          <div key={point} className="flex items-start gap-3">
                            <GraduationCap size={16} className="mt-1 shrink-0 text-primary-color" />
                            <p className="text-sm leading-7 text-text-secondary">{point}</p>
                          </div>
                        ))}
                      </div>
                    </motion.article>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
