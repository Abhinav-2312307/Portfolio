"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"

export default function About() {
  const progressRef = useRef<HTMLDivElement>(null)
  const countersRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    let animationStarted = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            animationStarted = true
            animateCounters()
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
    )

    if (countersRef.current) {
      observer.observe(countersRef.current)
    }

    return () => {
      if (countersRef.current) {
        observer.unobserve(countersRef.current)
      }
    }
  }, [])

  const animateCounters = () => {
    const counters = document.querySelectorAll(".stat-number")

    counters.forEach((counter) => {
      const targetText = counter.textContent || "0+"
      const target = Number.parseInt(targetText.replace(/\D/g, ""))
      let count = 0
      const duration = 2000 // 2 seconds
      const frameDuration = 1000 / 60 // for 60fps
      const totalFrames = Math.round(duration / frameDuration)
      const increment = target / totalFrames

      const timer = setInterval(() => {
        count += increment

        if (count >= target) {
          counter.textContent = `${target}+`
          clearInterval(timer)
        } else {
          counter.textContent = `${Math.floor(count)}+`
        }
      }, frameDuration)
    })
  }

  return (
    <section id="about" className="py-20 px-8 bg-secondary-color">
      <h2
        className="text-center text-3xl mb-12 relative inline-block left-1/2 transform -translate-x-1/2 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-primary-color after:to-accent-color after:rounded-sm"
        data-scroll
        data-scroll-speed="1"
      >
        About Me
      </h2>

      <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
        <div className="flex-1" data-scroll data-scroll-speed="0.5">
          <h3 className="text-xl mb-4 text-primary-color">Hello, I'm Abhinav!</h3>
          <p className="mb-6 text-text-secondary leading-7">
            I am a passionate Computer Science student with a deep interest in Artificial Intelligence and Data Science.
            My journey in technology began with a curiosity about how computers work and evolved into a passion for
            creating innovative solutions using programming.
          </p>
          <p className="mb-6 text-text-secondary leading-7">
            Currently pursuing my B.Tech in Computer Science & Engineering at Pranveer Singh Institute of Technology, I
            focus on developing my skills in C++ and Python programming, as well as exploring the fascinating world of
            AI and machine learning.
          </p>
          <p className="mb-6 text-text-secondary leading-7">
            I believe in continuous learning and pushing the boundaries of what's possible with technology. When I'm not
            coding, you can find me exploring the latest advancements in tech, watching anime, or delving into the
            mysteries of the universe through astrophysics.
          </p>
          <Link
            href="#contact"
            className={`inline-block py-3 px-6 mt-4 rounded-md font-medium no-underline transition-all duration-300 bg-primary-color text-dark-color shadow-primary hover:bg-primary-dark hover:translate-y-[-3px] hover:shadow-lg ${
              isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
            }`}
            data-strength="0.2"
            data-cursor-text="Let's Connect"
          >
            Let's Connect
          </Link>
        </div>

        <div
          ref={countersRef}
          className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6"
          data-scroll
          data-scroll-speed="0.8"
        >
          <div
            className={`bg-dark-color p-6 rounded-md text-center shadow-md transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg ${
              isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
            }`}
            data-strength="0.1"
          >
            <div className="stat-number text-2xl font-bold text-primary-color mb-1">2+</div>
            <div className="text-sm text-text-secondary">Years of Coding</div>
          </div>

          <div
            className={`bg-dark-color p-6 rounded-md text-center shadow-md transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg ${
              isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
            }`}
            data-strength="0.1"
          >
            <div className="stat-number text-2xl font-bold text-primary-color mb-1">6+</div>
            <div className="text-sm text-text-secondary">Projects Completed</div>
          </div>

          <div
            className={`bg-dark-color p-6 rounded-md text-center shadow-md transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg ${
              isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
            }`}
            data-strength="0.1"
          >
            <div className="stat-number text-2xl font-bold text-primary-color mb-1">10+</div>
            <div className="text-sm text-text-secondary">Courses Completed</div>
          </div>

          <div
            className={`bg-dark-color p-6 rounded-md text-center shadow-md transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg ${
              isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
            }`}
            data-strength="0.1"
          >
            <div className="stat-number text-2xl font-bold text-primary-color mb-1">300+</div>
            <div className="text-sm text-text-secondary">Coding Problems Solved</div>
          </div>
        </div>
      </div>
    </section>
  )
}
