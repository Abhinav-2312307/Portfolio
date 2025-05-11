"use client"

import type React from "react"

import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { toast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useMobile()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Initialize EmailJS with your public key
      emailjs.init("5Qsk-kdFBYd2Wqpu1")

      // Get current date and time
      const now = new Date()
      const formattedDate = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
      const dateTimeString = `${formattedDate} at ${formattedTime}`

      // Prepare template parameters - make sure these match your EmailJS template variables
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "abhinavrishi32@gmail.com",
        date_time: dateTimeString,
      }

      // Send email using EmailJS
      const result = await emailjs.send("service_oflnih7", "template_u296wlk", templateParams)

      if (result.text === "OK") {
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I will get back to you soon.",
        })

        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      text: "Pranveer Singh Institute of Technology, Kanpur, Uttar Pradesh, India",
    },
    {
      icon: "fas fa-envelope",
      text: "2k23.cs2312307@gmail.com",
    },
    {
      icon: "fas fa-graduation-cap",
      text: "B.Tech Computer Science & Engineering (2023-2027)",
    },
    {
      icon: "fas fa-code-branch",
      text: "Open to collaboration on innovative projects",
    },
  ]

  const contactOptions = [
    {
      icon: "fab fa-github",
      text: "GitHub",
      link: "https://github.com/Abhinav-2312307",
    },
    {
      icon: "fab fa-linkedin",
      text: "LinkedIn",
      link: "https://www.linkedin.com/in/abhinav-sahu-865a01297/",
    },
    {
      icon: "fas fa-code",
      text: "LeetCode",
      link: "https://leetcode.com/u/lucifer_debug/",
    },
    {
      icon: "far fa-envelope",
      text: "Email",
      link: "mailto:2k23.cs2312307@gmail.com",
    },
  ]

  return (
    <section id="contact" className="py-20 px-8 text-center bg-dark-color relative overflow-hidden">
      <h2 className="text-center text-3xl mb-12 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-primary-color after:to-accent-color after:rounded-sm">
        Get in Touch
      </h2>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-secondary-color p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-left">
                <label htmlFor="name" className="block mb-1 text-text-secondary text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-sm text-text-color text-base transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(0,255,136,0.2)]"
                  required
                />
              </div>
              <div className="mb-4 text-left">
                <label htmlFor="email" className="block mb-1 text-text-secondary text-sm">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-sm text-text-color text-base transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(0,255,136,0.2)]"
                  required
                />
              </div>
              <div className="mb-4 text-left">
                <label htmlFor="subject" className="block mb-1 text-text-secondary text-sm">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-sm text-text-color text-base transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(0,255,136,0.2)]"
                  required
                />
              </div>
              <div className="mb-4 text-left">
                <label htmlFor="message" className="block mb-1 text-text-secondary text-sm">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-sm text-text-color text-base transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-[0_0_0_2px_rgba(0,255,136,0.2)] min-h-[150px] resize-vertical"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-block py-3 px-6 rounded-md font-medium transition-all duration-300 bg-primary-color text-dark-color shadow-primary hover:bg-primary-dark hover:translate-y-[-3px] hover:shadow-lg ${
                  isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
                } ${isSubmitting ? "opacity-70" : ""}`}
                data-strength="0.2"
                data-cursor-text="Send Message"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="bg-secondary-color p-8 rounded-lg shadow-md text-left">
            <h3 className="text-xl mb-6 text-primary-color">Contact Information</h3>
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-center mb-4">
                <div className="text-primary-color mr-4 w-10 h-10 flex items-center justify-center bg-primary-color/10 rounded-full">
                  <i className={info.icon}></i>
                </div>
                <div className="text-text-secondary">{info.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {contactOptions.map((option, index) => (
            <a
              key={index}
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 py-3 px-6 bg-primary-color text-dark-color rounded-xl no-underline transition-all duration-300 font-medium hover:scale-105 hover:shadow-[0_0_15px_var(--primary-color)] ${
                isMobile ? "cursor-pointer" : "cursor-none magnetic-element"
              }`}
              data-strength="0.2"
              data-cursor-text={option.text}
            >
              <i className={`${option.icon} text-lg`}></i>
              {option.text}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
