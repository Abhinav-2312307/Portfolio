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

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { SkillCard, SkillsContent } from "@/lib/portfolio/schema"

const skillIconMap: Record<string, IconType> = {
  cplusplus: SiCplusplus,
  express: SiExpress,
  git: SiGit,
  java: FaJava,
  javascript: SiJavascript,
  mongodb: SiMongodb,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  postgresql: SiPostgresql,
  python: SiPython,
  react: SiReact,
  typescript: SiTypescript,
}

const columnOffsets = ["xl:pt-14", "xl:pt-4", "xl:pt-20", "xl:pt-8"] as const

function splitSkillColumns(cards: SkillCard[]) {
  const columns = Array.from({ length: 4 }, () => [] as SkillCard[])

  cards.forEach((item, index) => {
    columns[index % columns.length].push(item)
  })

  return columns
}

type SkillsProps = {
  skills?: SkillsContent
}

export default function Skills({ skills = defaultPortfolioContent.skills }: SkillsProps) {
  const skillColumns = splitSkillColumns(skills.cards)

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
              {skills.sectionLabel}
            </span>
            <span className="h-20 w-px bg-gradient-to-b from-transparent to-primary-color/55" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-white/8 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-primary-light">{skills.sectionLabel}</p>
              <h2 className="mt-2 text-[clamp(2.1rem,4vw,3.3rem)] font-semibold tracking-[-0.05em] text-text-color">
                {skills.title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.categories.map((item) => (
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
              <div key={`skill-column-${columnIndex}`} className={`space-y-4 ${columnOffsets[columnIndex]}`}>
                {column.map((item) => {
                  const Icon = skillIconMap[item.iconName] ?? SiReact

                  return (
                    <article
                      key={`${item.order}-${item.name}`}
                      className="skill-card group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,24,0.96),rgba(14,18,28,0.92))] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.24)] transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-white/22 hover:shadow-[0_28px_56px_rgba(0,0,0,0.36)]"
                      style={{
                        "--skill-accent": item.accent,
                      } as React.CSSProperties}
                    >
                      <div
                        className="absolute inset-0 opacity-75 transition-opacity duration-[420ms] group-hover:opacity-100"
                        style={{
                          background: `linear-gradient(140deg, rgba(255,255,255,0.08), transparent 40%, transparent 78%, ${item.accent}18)`,
                        }}
                      />

                      {/* Hover glow overlay */}
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-[420ms] group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(ellipse at 50% 100%, ${item.accent}12, transparent 60%)`,
                        }}
                      />

                      <div
                        className="absolute inset-x-8 bottom-[-12px] h-10 rounded-full blur-2xl transition-all duration-[420ms] group-hover:bottom-[-8px] group-hover:h-14 group-hover:blur-3xl"
                        style={{ backgroundColor: `${item.accent}2d` }}
                      />

                      <div className="relative flex min-h-[12.75rem] flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.62rem] uppercase tracking-[0.34em] text-text-secondary transition-colors duration-300 group-hover:text-text-color/70">{item.category}</p>
                            <h3 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.05em] text-text-color">{item.name}</h3>
                          </div>
                          <span className="text-[0.68rem] text-text-secondary transition-colors duration-300 group-hover:text-text-color/50">{item.order}</span>
                        </div>

                        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                          <div
                            className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.45rem] border text-[2rem] transition-all duration-[420ms] group-hover:scale-110 group-hover:rotate-3"
                            style={{
                              borderColor: `${item.accent}33`,
                              color: item.accent,
                              background: `linear-gradient(180deg, rgba(255,255,255,0.08), ${item.accent}12)`,
                              boxShadow: `0 18px 30px ${item.accent}16, inset 0 1px 0 rgba(255,255,255,0.08)`,
                            }}
                          >
                            <div className="absolute inset-[6px] rounded-[1.05rem] border border-white/8 bg-white/[0.03]" />
                            <Icon className="relative z-10 transition-transform duration-[420ms] group-hover:scale-110" />
                          </div>

                          <span
                            className="h-px flex-1 origin-right rounded-full transition-all duration-[420ms] group-hover:scale-x-110"
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
              {skills.rails.map((item) => (
                <span key={item} className="glass-pill px-3 py-1.5 text-xs text-text-color transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-color/30 hover:text-primary-color hover:shadow-[0_8px_20px_rgb(var(--primary-color)_/_0.1)]">
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
