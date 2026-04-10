"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Film, Laptop, Rocket, Wrench } from "lucide-react"

const hobbies = [
  {
    icon: Laptop,
    title: "Code Crafting",
    description: "Solving complex problems and building thoughtful software with strong foundations.",
  },
  {
    icon: Film,
    title: "Anime Exploration",
    description: "Enjoying cinematic storytelling, character arcs, and imaginative world building.",
  },
  {
    icon: Rocket,
    title: "Cosmic Curiosity",
    description: "Following astrophysics, space discoveries, and the deeper questions behind them.",
  },
  {
    icon: Wrench,
    title: "Code Archaeology",
    description: "Tracing through systems, debugging edge cases, and refining existing codebases.",
  },
]

export default function Hobbies() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="hobbies"
      className="relative overflow-hidden bg-[linear-gradient(145deg,rgb(var(--dark-color))_0%,rgb(var(--secondary-color)_/_0.92)_52%,rgb(var(--dark-color))_100%)] px-8 py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgb(var(--primary-color)_/_0.12),transparent_30%),radial-gradient(circle_at_78%_20%,rgb(var(--accent-color)_/_0.14),transparent_28%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.32em] text-primary-color">Beyond the build</p>
          <h2 className="text-4xl font-semibold text-text-color md:text-5xl">
            Passions & Interests <span className="text-primary-color">shape the work too.</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-text-secondary md:text-lg">
            The same curiosity that drives the product work also shows up in storytelling, systems thinking, and an
            obsession with understanding how things really work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {hobbies.map((hobby, index) => {
            const Icon = hobby.icon

            return (
              <motion.div
                key={hobby.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                className="liquid-glass relative overflow-hidden rounded-[1.8rem] border border-white/15 p-6 shadow-liquid dark:border-white/10"
              >
                <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.2),transparent_38%,rgba(255,255,255,0.04)_100%)] dark:bg-[linear-gradient(150deg,rgba(255,255,255,0.1),transparent_38%,rgba(0,0,0,0.08)_100%)]" />
                <div className="absolute inset-x-[18%] top-0 h-24 rounded-full bg-[radial-gradient(circle,_rgb(var(--primary-color)_/_0.18),_transparent_70%)] blur-3xl" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="glass-pill mb-6 inline-flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/15 text-primary-color shadow-glass dark:border-white/10">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-semibold text-text-color">{hobby.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">{hobby.description}</p>

                  <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-primary-color">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-color" />
                    Personal energy source
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
