"use client"

import type React from "react"

import { ArrowUpRight, Mail, MapPin, MessageSquare, Send, UserRound } from "lucide-react"
import { useState } from "react"
import emailjs from "@emailjs/browser"

import { toast } from "@/hooks/use-toast"

const contactInfo = [
  {
    Icon: MapPin,
    label: "Location",
    value: "Kanpur, Uttar Pradesh, India",
  },
  {
    Icon: Mail,
    label: "Primary Email",
    value: "abhinavrishi32@gmail.com",
  },
  {
    Icon: UserRound,
    label: "Current Role",
    value: "B.Tech CSE student building AI and product-focused systems",
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      emailjs.init("5Qsk-kdFBYd2Wqpu1")

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

      const result = await emailjs.send("service_oflnih7", "template_u296wlk", {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "abhinavrishi32@gmail.com",
        date_time: `${formattedDate} at ${formattedTime}`,
      })

      if (result.text === "OK") {
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. I’ll get back to you soon.",
        })

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

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,16,0.98),rgba(11,16,24,0.95))]" />
      <div className="absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-primary-color/22 to-transparent" />
      <div className="absolute right-[-8%] top-[14%] h-[16rem] w-[20rem] bg-[radial-gradient(circle,rgba(90,121,255,0.12),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.34em] text-primary-light">Contact</p>
          <h2 className="mt-3 text-[clamp(2.4rem,5vw,4.1rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-text-color">
            Let&apos;s build something useful and sharp.
          </h2>
          <p className="mt-5 text-sm leading-7 text-text-secondary md:text-base">
            If you want to collaborate, talk through an idea, or bring me into a product that needs stronger
            engineering and design thinking, reach out here.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="glass-panel-strong rounded-[32px] p-6 md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="glass-pill inline-flex h-12 w-12 items-center justify-center rounded-[16px] text-primary-color">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-text-secondary">Message</p>
                <h3 className="mt-1 text-xl font-semibold text-text-color">Start the conversation</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-left">
                  <span className="mb-2 block text-sm text-text-secondary">Your Name</span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="glass-input w-full rounded-2xl px-4 py-3 text-base text-text-color focus:outline-none"
                    required
                  />
                </label>

                <label className="block text-left">
                  <span className="mb-2 block text-sm text-text-secondary">Your Email</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input w-full rounded-2xl px-4 py-3 text-base text-text-color focus:outline-none"
                    required
                  />
                </label>
              </div>

              <label className="block text-left">
                <span className="mb-2 block text-sm text-text-secondary">Subject</span>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="glass-input w-full rounded-2xl px-4 py-3 text-base text-text-color focus:outline-none"
                  required
                />
              </label>

              <label className="block text-left">
                <span className="mb-2 block text-sm text-text-secondary">Message</span>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="glass-input min-h-[180px] w-full resize-y rounded-2xl px-4 py-3 text-base text-text-color focus:outline-none"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgb(var(--primary-color)_/_0.94),rgb(var(--accent-color)_/_0.84))] px-6 py-3.5 text-sm font-semibold text-contrast-color shadow-[0_14px_34px_rgb(var(--primary-color)_/_0.16)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
              >
                <Send size={16} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="glass-panel rounded-[30px] p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.3em] text-text-secondary">Contact Details</p>
              <div className="mt-5 space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.Icon

                  return (
                    <div key={item.label} className="flex items-start gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
                      <div className="glass-pill inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-primary-color">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-text-secondary">{item.label}</p>
                        <p className="mt-2 text-sm leading-7 text-text-color">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="glass-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-text-secondary">Elsewhere</p>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">
                    You can also reach me through the platforms below.
                  </p>
                </div>
                <ArrowUpRight size={16} className="text-primary-color" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {contactOptions.map((option) => (
                  <a
                    key={option.text}
                    href={option.link}
                    target={option.link.startsWith("mailto:") ? undefined : "_blank"}
                    rel={option.link.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="glass-pill inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-text-color transition-all duration-300 hover:border-primary-color/30 hover:text-primary-color"
                  >
                    <i className={`${option.icon} text-base`} />
                    {option.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
