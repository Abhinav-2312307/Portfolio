"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import ResumeButton from "./resume-button"
import { useActiveSection } from "@/hooks/use-active-section"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  // Define all sections for the scroll spy
  const sections = ["about", "education", "skills", "projects", ,"achievements","hobbies", "contact"]
  const activeSection = useActiveSection(sections, 150)

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsOpen(false)
  }

  // Helper function to determine if a section is active
  const isActive = (section: string) => activeSection === section

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-2 bg-dark-color/90 backdrop-blur-md shadow-md" : "py-3 bg-dark-color/60 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-color">
          Abhinav
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`relative px-2 py-1 text-sm lg:text-base transition-colors ${
                isActive(section) ? "text-primary-color font-medium" : "text-text-color hover:text-primary-color"
              }`}
            >
              <span className="capitalize">{section}</span>
              {isActive(section) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-color rounded-full" />
              )}
            </button>
          ))}
          <ResumeButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-text-color hover:text-primary-color ml-2"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2 text-text-color hover:text-primary-color"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-text-color hover:text-primary-color"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Improved */}
      <div
        className={`md:hidden absolute w-full bg-dark-color/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] py-4" : "max-h-0 py-0 overflow-hidden"
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-3">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                isActive(section)
                  ? "bg-secondary-color/30 text-primary-color font-medium"
                  : "text-text-color hover:bg-secondary-color/10"
              }`}
            >
              {isActive(section) && <span className="w-1 h-5 bg-primary-color rounded-full mr-3" />}
              <span className="capitalize">{section}</span>
            </button>
          ))}
          <div className="py-3 px-4" onClick={() => setIsOpen(false)}>
            <ResumeButton fullWidth />
          </div>
        </div>
      </div>
    </nav>
  )
}
