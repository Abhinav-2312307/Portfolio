"use client"

import { useEffect, useState } from "react"

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsVisible(false)
          }, 500)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-dark-color flex justify-center items-center z-[9999] transition-opacity duration-500 ${
        progress === 100 ? "opacity-0" : "opacity-100"
      }`}
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <div className="text-center max-w-md w-full px-6">
        <pre className="text-left text-sm md:text-base font-mono mb-6 overflow-x-auto whitespace-pre-wrap">
          <code className="text-primary-color">import</code> <code className="text-accent-color">{"{"}</code>{" "}
          <code className="text-warning-color">Developer</code> <code className="text-accent-color">{"}"}</code>{" "}
          <code className="text-primary-color">from</code> <code className="text-success-color">'Earth'</code>;
          <br />
          <br />
          <code className="text-primary-color">const</code> <code className="text-warning-color">Abhinav</code>{" "}
          <code>=</code> <code className="text-primary-color">new</code>{" "}
          <code className="text-warning-color">Developer</code>
          <code className="text-accent-color">({"{"}</code>
          <br />
          {"  "}
          <code className="text-text-secondary">name:</code> <code className="text-success-color">'Abhinav Sahu'</code>,
          <br />
          {"  "}
          <code className="text-text-secondary">role:</code>{" "}
          <code className="text-success-color">'Full Stack Developer & Innovator'</code>,
          <br />
          {"  "}
          <code className="text-text-secondary">stack:</code> <code className="text-accent-color">[</code>
          <code className="text-success-color">'C++'</code>, <code className="text-success-color">'Next.js'</code>,{" "}
          <code className="text-success-color">'NLP'</code>, <code className="text-success-color">'AWS'</code>,{" "}
          <code className="text-success-color">'Python'</code>
          <code className="text-accent-color">]</code>,
          <br />
          {"  "}
          <code className="text-text-secondary">poweredBy:</code> <code className="text-accent-color">[</code>
          <code className="text-warning-color">anime</code>
          <code className="text-accent-color">(</code>
          <code className="text-success-color">'Eren Yeager'</code>
          <code className="text-accent-color">)</code>, <code className="text-warning-color">code</code>
          <code className="text-accent-color">()</code>, <code className="text-warning-color">curiosity</code>
          <code className="text-accent-color">()</code>, <code className="text-warning-color">vision</code>
          <code className="text-accent-color">()</code>
          <code className="text-accent-color">]</code>,
          <br />
          {"  "}
          <code className="text-text-secondary">status:</code>{" "}
          <code className="text-success-color">'Crafting innovation... please wait ⏳'</code>
          <br />
          <code className="text-accent-color">{"}"});</code>
          <br />
          <br />
          <code className="text-primary-color">await</code> <code className="text-warning-color">Abhinav</code>.
          <code className="text-primary-color">initialize</code>
          <code className="text-accent-color">();</code>
        </pre>
        <div className="w-full bg-secondary-color/30 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-color transition-all duration-300 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-shine"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
