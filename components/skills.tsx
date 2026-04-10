"use client"

import type { IconType } from "react-icons"
import { FaJava } from "react-icons/fa6"
import {
  SiCplusplus,
  SiExpress,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si"

type SkillCard = {
  accent: string
  category: string
  icon: IconType
  name: string
  order: string
}

const skillCards: SkillCard[] = [
  { accent: "#4fd9ff", category: "Languages", icon: SiCplusplus, name: "C++", order: "01" },
  { accent: "#ff8a55", category: "Languages", icon: FaJava, name: "Java", order: "02" },
  { accent: "#ffd35f", category: "Languages", icon: SiPython, name: "Python", order: "03" },
  { accent: "#ffe15f", category: "Frontend", icon: SiJavascript, name: "JavaScript", order: "04" },
  { accent: "#59d4ff", category: "Frontend", icon: SiTypescript, name: "TypeScript", order: "05" },
  { accent: "#6ce8ff", category: "Frontend", icon: SiReact, name: "React.js", order: "06" },
  { accent: "#e7edf5", category: "Frameworks", icon: SiNextdotjs, name: "Next.js", order: "07" },
  { accent: "#7de27f", category: "Backend", icon: SiNodedotjs, name: "Node.js", order: "08" },
  { accent: "#c7d1dd", category: "Backend", icon: SiExpress, name: "Express.js", order: "09" },
  { accent: "#48d08a", category: "Databases", icon: SiMongodb, name: "MongoDB", order: "10" },
  { accent: "#7fb2ff", category: "Databases", icon: SiPostgresql, name: "PostgreSQL", order: "11" },
  { accent: "#ff8f6d", category: "Tooling", icon: SiGit, name: "Git", order: "12" },
]

const rails = [
  "Tailwind CSS",
  "Bootstrap",
  "REST APIs",
  "JWT",
  "Firebase",
  "GitHub",
  "Postman",
  "Cloudinary",
  "Expo",
  "Vercel",
  "DBMS",
  "OOP",
  "System Design",
] as const

const columnSpeeds = ["-0.28", "0.22", "-0.18", "0.26"] as const
const columnOffsets = ["xl:pt-14", "xl:pt-4", "xl:pt-20", "xl:pt-8"] as const
const skillColumns = Array.from({ length: 4 }, () => [] as SkillCard[])

skillCards.forEach((item, index) => {
  skillColumns[index % skillColumns.length].push(item)
})

export default function Skills() {
  return (
    <section
      id="skills"
      data-scroll-section
      className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-24"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,18,0.98),rgba(9,13,20,0.96))]" />
      <div className="absolute inset-0 opacity-26 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-y-0 left-[7%] w-px bg-gradient-to-b from-transparent via-primary-color/26 to-transparent" />
      <div className="absolute inset-y-0 right-[8%] w-px bg-gradient-to-b from-transparent via-accent-color/18 to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-6 lg:grid-cols-[5rem_minmax(0,1fr)] lg:gap-8">
        <div
          data-scroll
          data-scroll-sticky
          data-scroll-target="#skills"
          className="hidden items-start justify-center lg:flex"
        >
          <div className="sticky top-28 flex h-[30rem] flex-col items-center justify-between">
            <span className="h-20 w-px bg-gradient-to-b from-primary-color/70 to-transparent" />
            <span className="rotate-180 text-xs uppercase tracking-[0.5em] text-text-secondary [writing-mode:vertical-rl]">
              Skills
            </span>
            <span className="h-20 w-px bg-gradient-to-b from-transparent to-primary-color/55" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-white/8 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-primary-light">Skills</p>
              <h2 className="mt-2 text-[clamp(2.1rem,4vw,3.3rem)] font-semibold tracking-[-0.05em] text-text-color">
                Core Stack
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Languages", "Frontend", "Backend", "Databases", "Tooling"].map((item) => (
                <span
                  key={item}
                  className="glass-pill px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.26em] text-text-secondary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {skillColumns.map((column, columnIndex) => (
              <div
                key={`skill-column-${columnIndex}`}
                className={`space-y-4 ${columnOffsets[columnIndex]}`}
              >
                {column.map((item) => {
                  const Icon = item.icon

                  return (
                    <article
                      key={item.name}
                      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,24,0.96),rgba(14,18,28,0.92))] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.24)] transition-[border-color,box-shadow] duration-300 hover:border-white/18 hover:shadow-[0_22px_48px_rgba(0,0,0,0.28)]"
                    >
                      <div
                        className="absolute inset-0 opacity-75"
                        style={{
                          background: `linear-gradient(140deg, rgba(255,255,255,0.08), transparent 40%, transparent 78%, ${item.accent}18)`,
                        }}
                      />

                      <div
                        className="absolute inset-x-8 bottom-[-12px] h-10 rounded-full blur-2xl"
                        style={{ backgroundColor: `${item.accent}2d` }}
                      />

                      <div className="relative flex min-h-[12.75rem] flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.62rem] uppercase tracking-[0.34em] text-text-secondary">{item.category}</p>
                            <h3 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.05em] text-text-color">{item.name}</h3>
                          </div>
                          <span className="text-[0.68rem] text-text-secondary">{item.order}</span>
                        </div>

                        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                          <div
                            className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.45rem] border text-[2rem]"
                            style={{
                              borderColor: `${item.accent}33`,
                              color: item.accent,
                              background: `linear-gradient(180deg, rgba(255,255,255,0.08), ${item.accent}12)`,
                              boxShadow: `0 18px 30px ${item.accent}16, inset 0 1px 0 rgba(255,255,255,0.08)`,
                            }}
                          >
                            <div className="absolute inset-[6px] rounded-[1.05rem] border border-white/8 bg-white/[0.03]" />
                            <Icon className="relative z-10 transition-transform duration-300 group-hover:scale-105" />
                          </div>

                          <span
                            className="h-px flex-1 rounded-full"
                            style={{
                              background: `linear-gradient(90deg, rgba(255,255,255,0.06), ${item.accent}88)`,
                            }}
                          />
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-[28px] p-4">
            <div className="flex flex-wrap gap-2">
              {rails.map((item) => (
                <span key={item} className="glass-pill px-3 py-1.5 text-xs text-text-color">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
