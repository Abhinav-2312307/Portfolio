"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  const typingTextRef = useRef<HTMLDivElement>(null)
  const texts = ["AI Developer", "Data Science Enthusiast", "C++ Programmer", "Python Developer"]

  useEffect(() => {
    let index = 0
    let charIndex = 0
    let isDeleting = false
    let typingSpeed = 100

    const type = () => {
      const currentText = texts[index]

      if (typingTextRef.current) {
        if (isDeleting) {
          // Deleting text
          typingTextRef.current.textContent = currentText.substring(0, charIndex - 1)
          charIndex--
          typingSpeed = 50
        } else {
          // Typing text
          typingTextRef.current.textContent = currentText.substring(0, charIndex + 1)
          charIndex++
          typingSpeed = 100
        }

        // If finished typing
        if (!isDeleting && charIndex === currentText.length) {
          isDeleting = true
          typingSpeed = 2000 // Pause at the end
        }

        // If finished deleting
        if (isDeleting && charIndex === 0) {
          isDeleting = false
          index = (index + 1) % texts.length
          typingSpeed = 500 // Pause before typing next
        }
      }

      setTimeout(type, typingSpeed)
    }

    // Start the typing effect
    setTimeout(type, 1000)
  }, [])

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-color to-dark-color p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient z-[-1]"></div>

      <div className="flex flex-col md:flex-row md:gap-16 items-center text-center md:text-left max-w-6xl w-full z-10">
        <div className="relative" data-scroll data-scroll-speed="0.3">
          <div className="absolute top-1/2 left-1/2 w-[280px] h-[280px] rounded-full border-2 border-dashed border-primary-color animate-rotate"></div>
          <Image
            src="/profile.jpg"
            alt="Abhinav Sahu"
            width={250}
            height={250}
            className="rounded-full border-5 border-primary-color object-cover m-8 shadow-[0_0_30px_var(--primary-color)] animate-float relative z-10 magnetic-element"
            data-strength="0.15"
          />
        </div>

        <div className="max-w-[600px]" data-scroll data-scroll-speed="0.5">
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-primary-color to-accent-color bg-clip-text text-transparent inline-block relative">
            Abhinav Sahu
          </h1>
          <div ref={typingTextRef} className="text-xl text-text-secondary mb-8 min-h-[2.5rem]"></div>
          <p className="mb-8 text-text-secondary text-base leading-7">
            Passionate AI and Data Science enthusiast with a strong foundation in C++ and Python programming. Currently
            pursuing B.Tech in Computer Science & Engineering at Pranveer Singh Institute of Technology.
          </p>

          <div className="flex flex-wrap gap-4 md:justify-start justify-center">
            <Link
              href="#projects"
              className="inline-block py-3 px-6 rounded-md font-medium no-underline transition-all duration-300 bg-primary-color text-dark-color shadow-primary hover:bg-primary-dark hover:translate-y-[-3px] hover:shadow-lg magnetic-element"
              data-strength="0.2"
              data-cursor-text="View Projects"
            >
              View Projects
            </Link>
            <Link
              href="#contact"
              className="inline-block py-3 px-6 rounded-md font-medium no-underline transition-all duration-300 bg-transparent text-primary-color border-2 border-primary-color hover:bg-primary-color hover:text-dark-color hover:translate-y-[-3px] hover:shadow-lg magnetic-element"
              data-strength="0.2"
              data-cursor-text="Contact Me"
            >
              Contact Me
            </Link>
          </div>

          <div className="flex gap-6 mt-8 md:justify-start justify-center">
            <a
              href="https://github.com/Abhinav-2312307"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="GitHub"
              className="text-xl text-text-color w-[45px] h-[45px] flex items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:text-primary-color hover:translate-y-[-5px] hover:bg-primary-color/10 magnetic-element"
              data-strength="0.3"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/abhinav-sahu-865a01297/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="LinkedIn"
              className="text-xl text-text-color w-[45px] h-[45px] flex items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:text-primary-color hover:translate-y-[-5px] hover:bg-primary-color/10 magnetic-element"
              data-strength="0.3"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://leetcode.com/u/lucifer_debug/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="LeetCode"
              className="text-xl text-text-color w-[45px] h-[45px] flex items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:text-primary-color hover:translate-y-[-5px] hover:bg-primary-color/10 magnetic-element"
              data-strength="0.3"
            >
              <i className="fas fa-code"></i>
            </a>
            <a
              href="mailto:2k23.cs2312307@gmail.com"
              data-cursor-text="Email"
              className="text-xl text-text-color w-[45px] h-[45px] flex items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:text-primary-color hover:translate-y-[-5px] hover:bg-primary-color/10 magnetic-element"
              data-strength="0.3"
            >
              <i className="far fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
