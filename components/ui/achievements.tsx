"use client"

import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function Achievements() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const isMobile = useMobile()

  const achievements = [
    {
      title: "GDGoC Challenge Winner",
      subtitle: "Rank 1st in FullStack Development",
      year: "2025",
      description:
        "Secured first position in Google Developer Groups on Campus challenge, demonstrating exceptional full-stack development skills and innovative problem-solving approach.",
      icon: "🏆",
      category: "Competition",
    },
    {
      title: "IIIT Sonepat National Hackathon",
      subtitle: "Finalist",
      year: "2025",
      description:
        "Reached final round in competitive national-level hackathon. Recognized for addressing rural tech challenges and sustainable AgriTech innovation.",
      icon: "🚀",
      category: "Hackathon",
    },
    {
      title: "HackO'clock by GDG",
      subtitle: "Finalist - IILM University",
      year: "2025",
      description:
        "Selected as finalist in hackathon organized by Google Developers Group. Recognized for building a functional, problem-solving prototype.",
      icon: "💡",
      category: "Hackathon",
    },
    {
      title: "LeetCode Expert",
      subtitle: "400+ Problems Solved",
      year: "Present",
      description:
        "Solved 400+ coding problems across all difficulty levels, demonstrating strong problem-solving skills and algorithmic thinking.",
      icon: "🧠",
      category: "Coding",
    },
  ]

  return (
    <section id="achievements" className="py-20 px-8 bg-dark-color relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-center text-3xl mb-4 relative inline-block w-full after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-primary-color after:to-accent-color after:rounded-sm">
          Achievements & Recognition
        </h2>
        <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
          Celebrating milestones and recognition earned through dedication, innovation, and continuous learning in
          technology and competitive programming.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`bg-secondary-color rounded-lg p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10 relative overflow-hidden ${
                isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
              }`}
              data-strength="0.15"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0 mt-1">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 bg-primary-color/20 text-primary-color rounded-full border border-primary-color/30">
                      {achievement.category}
                    </span>
                    <span className="text-text-secondary text-sm font-medium">{achievement.year}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-text-color mb-1">{achievement.title}</h3>
                  <p className="text-primary-color font-medium mb-3">{achievement.subtitle}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{achievement.description}</p>
                </div>
              </div>

              {/* Hover effect */}
              <div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-color to-accent-color transition-all duration-300 ${
                  hoveredIndex === index ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Achievement stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-secondary-color/50 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-primary-color mb-1">1st</div>
            <div className="text-text-secondary text-sm">Competition Rank</div>
          </div>
          <div className="bg-secondary-color/50 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-primary-color mb-1">3</div>
            <div className="text-text-secondary text-sm">Hackathon Finals</div>
          </div>
          <div className="bg-secondary-color/50 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-primary-color mb-1">400+</div>
            <div className="text-text-secondary text-sm">Problems Solved</div>
          </div>
          <div className="bg-secondary-color/50 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-primary-color mb-1">2025</div>
            <div className="text-text-secondary text-sm">Active Year</div>
          </div>
        </div>
      </div>
    </section>
  )
}
