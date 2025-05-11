"use client"

import { useState, useEffect, useRef } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function Skills() {
  const [activeTab, setActiveTab] = useState("programming")
  const progressBarsRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateProgressBars()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (progressBarsRef.current) {
      observer.observe(progressBarsRef.current)
    }

    return () => {
      if (progressBarsRef.current) {
        observer.unobserve(progressBarsRef.current)
      }
    }
  }, [activeTab])

  const animateProgressBars = () => {
    const progressBars = document.querySelectorAll(".progress-fill")
    progressBars.forEach((bar) => {
      const progress = bar.getAttribute("data-progress")
      if (progress) {
        bar.classList.add("animate-progress")
        ;(bar as HTMLElement).style.width = `${progress}%`
      }
    })
  }

  return (
    <section id="skills" className="py-20 px-8 bg-secondary-color">
      <h2
        className="text-center text-3xl mb-12 relative inline-block left-1/2 transform -translate-x-1/2 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-primary-color after:to-accent-color after:rounded-sm"
        data-scroll
        data-scroll-speed="1"
      >
        Technical Skills
      </h2>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-12 flex-wrap gap-2" data-scroll data-scroll-speed="0.5">
          <button
            className={`py-2 px-6 bg-dark-color text-text-color border-none rounded-md ${
              isMobile ? "cursor-pointer" : "cursor-none"
            } text-base transition-all duration-300 ${
              activeTab === "programming" ? "bg-primary-color text-dark-color" : "hover:bg-primary-color/20"
            }`}
            onClick={() => setActiveTab("programming")}
          >
            Programming
          </button>
          <button
            className={`py-2 px-6 bg-dark-color text-text-color border-none rounded-md ${
              isMobile ? "cursor-pointer" : "cursor-none"
            } text-base transition-all duration-300 ${
              activeTab === "technologies" ? "bg-primary-color text-dark-color" : "hover:bg-primary-color/20"
            }`}
            onClick={() => setActiveTab("technologies")}
          >
            Technologies
          </button>
          <button
            className={`py-2 px-6 bg-dark-color text-text-color border-none rounded-md ${
              isMobile ? "cursor-pointer" : "cursor-none"
            } text-base transition-all duration-300 ${
              activeTab === "tools" ? "bg-primary-color text-dark-color" : "hover:bg-primary-color/20"
            }`}
            onClick={() => setActiveTab("tools")}
          >
            Tools
          </button>
          <button
            className={`py-2 px-6 bg-dark-color text-text-color border-none rounded-md ${
              isMobile ? "cursor-pointer" : "cursor-none"
            } text-base transition-all duration-300 ${
              activeTab === "soft" ? "bg-primary-color text-dark-color" : "hover:bg-primary-color/20"
            }`}
            onClick={() => setActiveTab("soft")}
          >
            Soft Skills
          </button>
        </div>

        <div ref={progressBarsRef} data-scroll data-scroll-speed="0.7">
          {activeTab === "programming" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fab fa-cpp"></i>
                </div>
                <h3 className="text-lg mb-4">C/C++</h3>
                <p className="text-text-secondary">
                  Primary programming language with strong understanding of OOP concepts, STL, and algorithms.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="90"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fab fa-python"></i>
                </div>
                <h3 className="text-lg mb-4">Python</h3>
                <p className="text-text-secondary">
                  Proficient in Python for data analysis, machine learning, and general-purpose programming.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="85"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fas fa-code"></i>
                </div>
                <h3 className="text-lg mb-4">Java</h3>
                <p className="text-text-secondary">
                  Familiar with Java for object-oriented programming and Android app development.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="70"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "technologies" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fas fa-brain"></i>
                </div>
                <h3 className="text-lg mb-4">Artificial Intelligence</h3>
                <p className="text-text-secondary">
                  Knowledge of AI concepts, algorithms, and applications in solving real-world problems.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="75"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3 className="text-lg mb-4">Data Science</h3>
                <p className="text-text-secondary">
                  Experience with data analysis, visualization, and extracting insights from datasets.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="70"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fas fa-database"></i>
                </div>
                <h3 className="text-lg mb-4">Databases</h3>
                <p className="text-text-secondary">
                  Working knowledge of database design, SQL, and data management principles.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="65"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fab fa-git-alt"></i>
                </div>
                <h3 className="text-lg mb-4">Git & GitHub</h3>
                <p className="text-text-secondary">
                  Proficient in version control, collaboration, and project management using Git and GitHub.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="80"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fas fa-code-branch"></i>
                </div>
                <h3 className="text-lg mb-4">VS Code</h3>
                <p className="text-text-secondary">
                  Experienced with VS Code for efficient coding, debugging, and project management.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="85"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fab fa-android"></i>
                </div>
                <h3 className="text-lg mb-4">Android Studio</h3>
                <p className="text-text-secondary">
                  Basic knowledge of Android app development and the Android Studio environment.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="60"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "soft" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3 className="text-lg mb-4">Problem Solving</h3>
                <p className="text-text-secondary">
                  Strong analytical thinking and creative approach to solving complex technical challenges.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="85"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="text-lg mb-4">Teamwork</h3>
                <p className="text-text-secondary">
                  Effective collaboration, communication, and contribution in team environments.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="80"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-dark-color p-8 rounded-md text-center transition-transform duration-300 hover:translate-y-[-10px] hover:shadow-lg shadow-md relative overflow-hidden z-10 ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                }`}
                data-strength="0.1"
              >
                <div className="text-2xl text-primary-color mb-4">
                  <i className="fas fa-book-reader"></i>
                </div>
                <h3 className="text-lg mb-4">Continuous Learning</h3>
                <p className="text-text-secondary">
                  Passion for acquiring new knowledge and adapting to emerging technologies.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden mt-1">
                    <div
                      className="progress-fill h-full bg-primary-color rounded-sm w-0 transition-all duration-[1.5s] ease-in-out"
                      data-progress="90"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
