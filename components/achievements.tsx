"use client"

import { Brain, Medal, Rocket, Trophy } from "lucide-react"

const achievements = [
  {
    Icon: Trophy,
    title: "GDGoC Challenge Winner",
    subtitle: "Rank 1 in full-stack development",
    year: "2025",
    category: "Competition",
    description:
      "Won the Google Developer Groups on Campus challenge by delivering a stronger full-stack solution with clear execution and problem framing.",
  },
  {
    Icon: Rocket,
    title: "National Hackathon Finalist",
    subtitle: "IIIT Sonepat",
    year: "2025",
    category: "Hackathon",
    description:
      "Reached the final round with a working product concept focused on solving real rural-tech and AgriTech problems.",
  },
  {
    Icon: Medal,
    title: "Multiple Hackathon Finals",
    subtitle: "GDG, IILM, and Sunhacks",
    year: "2025",
    category: "Recognition",
    description:
      "Repeatedly selected into final rounds across different hackathons, showing consistent execution under time pressure.",
  },
  {
    Icon: Brain,
    title: "Competitive Coding Growth",
    subtitle: "550+ problems solved",
    year: "Present",
    category: "Coding",
    description:
      "Built stronger problem-solving habits through consistent practice across algorithms, data structures, and implementation-heavy questions.",
  },
]

const stats = [
  { label: "Best Finish", value: "1st Place" },
  { label: "Hackathon Finals", value: "4+" },
  { label: "Problems Solved", value: "550+" },
  { label: "Momentum", value: "Still building" },
]

export default function Achievements() {
  return (
    <section id="achievements" className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,18,0.98),rgba(10,14,22,0.94))]" />
      <div className="absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-primary-color/22 to-transparent" />
      <div className="absolute left-[-6%] top-[20%] h-[15rem] w-[18rem] bg-[radial-gradient(circle,rgba(79,239,255,0.1),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.34em] text-primary-light">Achievements</p>
          <h2 className="mt-3 text-[clamp(2.4rem,5vw,4.1rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-text-color">
            Wins that came from shipping, competing, and staying consistent.
          </h2>
          <p className="mt-5 text-sm leading-7 text-text-secondary md:text-base">
            Recognition matters most when it reflects real execution. These milestones came from building under
            pressure, iterating quickly, and keeping quality high enough to stand out.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {achievements.map((achievement) => {
            const Icon = achievement.Icon

            return (
              <article key={achievement.title} className="glass-panel rounded-[28px] p-6">
                <div className="flex items-start gap-4">
                  <div className="glass-pill inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] text-primary-color">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="glass-pill px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-primary-color">
                        {achievement.category}
                      </span>
                      <span className="text-xs uppercase tracking-[0.24em] text-text-secondary">{achievement.year}</span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-text-color">{achievement.title}</h3>
                    <p className="mt-2 text-sm font-medium text-primary-color">{achievement.subtitle}</p>
                    <p className="mt-4 text-sm leading-7 text-text-secondary">{achievement.description}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="glass-panel rounded-[24px] p-5 text-center">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-text-secondary">{item.label}</p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-text-color">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
