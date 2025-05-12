"use client"

import { useMobile } from "@/hooks/use-mobile"
import { Laptop, Film, Rocket, Wrench } from "lucide-react"

export default function Hobbies() {
  const isMobile = useMobile()

  const hobbies = [
    {
      icon: <Laptop className="w-12 h-12 mb-4 text-white" />,
      title: "Code Crafting",
      description: "Solving complex problems and building innovative solutions through programming",
    },
    {
      icon: <Film className="w-12 h-12 mb-4 text-white" />,
      title: "Anime Exploration",
      description: "Immersing in captivating Japanese animation and storytelling",
    },
    {
      icon: <Rocket className="w-12 h-12 mb-4 text-white" />,
      title: "Cosmic Curiosity",
      description: "Exploring mysteries of the universe, astrophysics, and scientific phenomena",
    },
    {
      icon: <Wrench className="w-12 h-12 mb-4 text-white" />,
      title: "Code Archaeology",
      description: "Delving into complex systems to debug and optimize existing codebases",
    },
  ]

  return (
    <section id="hobbies" className="py-20 px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-4xl font-bold mb-16 text-white">
          Passions & Interests <span className="text-yellow-400">⭐</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hobbies.map((hobby, index) => (
            <div key={index} className="relative group" data-aos="fade-up" data-aos-delay={index * 100}>
              {/* Green border with rotating shine effect */}
              <div className="absolute inset-0 rounded-lg bg-green-400 p-4 overflow-hidden">
                {/* Inner black content area */}
                <div className="absolute inset-[12px] rounded-lg bg-black"></div>

                {/* Rotating shine effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-gradient-to-r from-transparent via-green-300/30 to-transparent rotate-shine"
                    style={{
                      transform: "rotate(45deg)",
                      animation: "rotateShine 3s linear infinite",
                    }}
                  ></div>
                </div>
              </div>

              {/* Card content */}
              <div className="relative h-full rounded-lg p-8 flex flex-col items-center text-center z-10">
                {hobby.icon}
                <h3 className="text-xl font-bold mb-3 text-white">{hobby.title}</h3>
                <p className="text-gray-300 text-sm">{hobby.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add the animation keyframes */}
      <style jsx global>{`
        @keyframes rotateShine {
          0% {
            transform: rotate(45deg) translateX(-100%);
          }
          100% {
            transform: rotate(45deg) translateX(100%);
          }
        }
        
        .rotate-shine {
          animation: rotateShine 3s linear infinite;
        }
      `}</style>
    </section>
  )
}
