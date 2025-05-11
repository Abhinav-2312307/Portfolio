"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, ExternalLink } from "lucide-react"

type Project = {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  github?: string
  live?: string
  category: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern portfolio website built with Next.js and Tailwind CSS.",
    image: "/portf.png?height=300&width=500",
    technologies: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/username/portfolio",
    live: "https://portfolio.example.com",
    category: "web",
  },
  // {
  //   id: 2,
  //   title: "E-commerce Platform",
  //   description: "A full-stack e-commerce platform with payment integration.",
  //   image: "/placeholder.svg?height=300&width=500",
  //   technologies: ["React", "Node.js", "MongoDB", "Stripe"],
  //   github: "https://github.com/username/ecommerce",
  //   live: "https://ecommerce.example.com",
  //   category: "web",
  // },
  {
    id: 2,
    title: "JusticeAlly",
    description: "A web application that provides legal information and resources.",
    image: "/justiceAlly.png?height=300&width=500",
    technologies: ["Python", "NLP", "OpenAI API", "React", "MySQL", "Tailwind CSS", "Next.js", "Node.js"],
    github: "https://justice-ally.vercel.app/",
    category: "ai",
  },
  {
    id: 3,
    title: "Image Encryption Tool",
    description: "A web application for encrypting and decrypting images.",
    image: "/imgEnc.png?height=300&width=500",
    technologies: ["React", "Next.js", "tailwind css", "typescript"],
    github: "https://github.com/username/ai-image-generator",
    category: "mobile",
  },
  // {
  //   id: 4,
  //   title: "Mobile Fitness App",
  //   description: "A fitness tracking mobile application with workout plans.",
  //   image: "/placeholder.svg?height=300&width=500",
  //   technologies: ["React Native", "Firebase", "Redux", "Expo"],
  //   github: "https://github.com/username/fitness-app",
  //   category: "mobile",
  // },

  {
    id: 4,
    title: "PrintMyPagePSIT",
    description: "A web application for printing pages from PSIT.",
    image: "/printmypsit.png?height=300&width=500",
    technologies: ["DBMS", "React", "Tailwind CSS", "Next.js", "Node.js"],
    github: "https://print-my-page-psit.vercel.app/",
    category: "web",
  },
  {
    id: 5,
    title: "MapMyPSIT",
    description: "A web application for navigating the PSIT campus.",
    image: "/mapmypsit.png?height=300&width=500",
    technologies: ["DBMS", "React", "Tailwind CSS", "Next.js", "Node.js"],
    github: "https://map-my-psit.vercel.app/#",
    category: "web",
  },
  {
    id: 6,
    title: "Travel AI(Coming Soon)",
    description:
      "A travel planning application that uses AI to suggest itineraries and chatbot based ticket booking system.",
    image: "/travelAI.png?height=300&width=500",
    technologies: ["DBMS", "React", "Tailwind CSS", "Next.js", "Node.js", "OpenAI API", "IRCTC API", "NLP"],
    github: "https://travel-ai-red.vercel.app/",
    category: "ai",
  },
  {
    id: 7,
    title: "A Silent Voice(Coming Soon)",
    description: "A web application that help converting text or voice to hand signs.",
    image: "/silentvoice.png?height=300&width=500",
    technologies: ["DBMS", "React", "Tailwind CSS", "Next.js", "Node.js", "OpenAI API", "IRCTC API", "NLP"],
    // github: "https://travel-ai-red.vercel.app/",

    category: "ai",
  },
]

export default function Projects() {
  const [filter, setFilter] = useState("all")

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter)

  return (
    <section id="projects" className="py-20 px-8 bg-dark-color">
      <h2 className="text-center text-3xl mb-4 relative inline-block left-1/2 transform -translate-x-1/2 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-primary-color after:to-accent-color after:rounded-sm">
        Projects 🚀
      </h2>
      <p className="text-center text-text-secondary max-w-2xl mx-auto mb-12">
        Here are some of my recent projects. Each one was built to solve a specific problem or learn new technologies.
      </p>

      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "bg-primary-color text-dark-color hover:bg-primary-dark"
              : "text-text-color hover:text-primary-color"
          }
        >
          All Projects
        </Button>
        <Button
          variant={filter === "web" ? "default" : "outline"}
          onClick={() => setFilter("web")}
          className={
            filter === "web"
              ? "bg-primary-color text-dark-color hover:bg-primary-dark"
              : "text-text-color hover:text-primary-color"
          }
        >
          Web Development
        </Button>
        <Button
          variant={filter === "mobile" ? "default" : "outline"}
          onClick={() => setFilter("mobile")}
          className={
            filter === "mobile"
              ? "bg-primary-color text-dark-color hover:bg-primary-dark"
              : "text-text-color hover:text-primary-color"
          }
        >
          Mobile Apps
        </Button>
        <Button
          variant={filter === "ai" ? "default" : "outline"}
          onClick={() => setFilter("ai")}
          className={
            filter === "ai"
              ? "bg-primary-color text-dark-color hover:bg-primary-dark"
              : "text-text-color hover:text-primary-color"
          }
        >
          AI Projects
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="bg-secondary-color border-none overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="relative overflow-hidden h-48 group">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-color/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary-color transition-colors"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary-color transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-text-color">{project.title}</h3>
              <p className="text-text-secondary mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="text-xs bg-dark-color text-primary-color px-2 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
