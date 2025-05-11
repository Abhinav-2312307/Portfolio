import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-secondary-color py-12 px-8 text-center relative">
      <div className="max-w-6xl mx-auto">
        <Link href="#home" className="text-xl font-bold text-primary-color mb-6 inline-block">
          Abhinav Sahu
        </Link>

        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          <Link
            href="#home"
            className="text-text-secondary no-underline transition-colors duration-300 hover:text-primary-color"
          >
            Home
          </Link>
          <Link
            href="#about"
            className="text-text-secondary no-underline transition-colors duration-300 hover:text-primary-color"
          >
            About
          </Link>
          <Link
            href="#education"
            className="text-text-secondary no-underline transition-colors duration-300 hover:text-primary-color"
          >
            Education
          </Link>
          <Link
            href="#skills"
            className="text-text-secondary no-underline transition-colors duration-300 hover:text-primary-color"
          >
            Skills
          </Link>
          <Link
            href="#projects"
            className="text-text-secondary no-underline transition-colors duration-300 hover:text-primary-color"
          >
            Projects
          </Link>
          <Link
            href="#hobbies"
            className="text-text-secondary no-underline transition-colors duration-300 hover:text-primary-color"
          >
            Hobbies
          </Link>
          <Link
            href="#contact"
            className="text-text-secondary no-underline transition-colors duration-300 hover:text-primary-color"
          >
            Contact
          </Link>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://github.com/Abhinav-2312307"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary text-lg transition-colors duration-300 hover:text-primary-color"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/abhinav-sahu-865a01297/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary text-lg transition-colors duration-300 hover:text-primary-color"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href="https://leetcode.com/u/lucifer_debug/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary text-lg transition-colors duration-300 hover:text-primary-color"
          >
            <i className="fas fa-code"></i>
          </a>
          <a
            href="mailto:2k23.cs2312307@gmail.com"
            className="text-text-secondary text-lg transition-colors duration-300 hover:text-primary-color"
          >
            <i className="far fa-envelope"></i>
          </a>
        </div>

        <div className="pt-6 border-t border-white/10">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Abhinav Sahu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
