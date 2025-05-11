"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import ResumeButton from "./resume-button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("light-mode")
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-3 bg-dark-color/90 backdrop-blur-md shadow-md" : "py-5 bg-dark-color/60 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-color">
          Portfolio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("about")}
            className="text-text-color hover:text-primary-color transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("education")}
            className="text-text-color hover:text-primary-color transition-colors"
          >
            Education
          </button>
          <button
            onClick={() => scrollToSection("skills")}
            className="text-text-color hover:text-primary-color transition-colors"
          >
            Skills
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="text-text-color hover:text-primary-color transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection("hobbies")}
            className="text-text-color hover:text-primary-color transition-colors"
          >
            Hobbies
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-text-color hover:text-primary-color transition-colors"
          >
            Contact
          </button>
          <ResumeButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-text-color hover:text-primary-color"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="mr-2 text-text-color hover:text-primary-color"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-text-color hover:text-primary-color"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full bg-dark-color/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] py-4" : "max-h-0 py-0 overflow-hidden"
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <button
            onClick={() => scrollToSection("about")}
            className="text-text-color hover:text-primary-color transition-colors py-2 text-left"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("education")}
            className="text-text-color hover:text-primary-color transition-colors py-2 text-left"
          >
            Education
          </button>
          <button
            onClick={() => scrollToSection("skills")}
            className="text-text-color hover:text-primary-color transition-colors py-2 text-left"
          >
            Skills
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="text-text-color hover:text-primary-color transition-colors py-2 text-left"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection("hobbies")}
            className="text-text-color hover:text-primary-color transition-colors py-2 text-left"
          >
            Hobbies
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-text-color hover:text-primary-color transition-colors py-2 text-left"
          >
            Contact
          </button>
          <div className="py-2" onClick={() => setIsOpen(false)}>
            <ResumeButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
