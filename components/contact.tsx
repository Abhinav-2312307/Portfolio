"use client"

import type React from "react"
import { ArrowUpRight, Mail, MapPin, MessageSquare, Send, Swords } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import emailjs from "@emailjs/browser"
import { useTheme } from "next-themes"

import { toast } from "@/hooks/use-toast"
import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { ContactContent, Identity, SocialLink } from "@/lib/portfolio/schema"
import { cn } from "@/lib/utils"

const contactIconMap = {
  mail: Mail,
  "map-pin": MapPin,
  "user-round": Swords,
}

type ContactProps = {
  contact?: ContactContent
  identity?: Identity
  socialLinks?: SocialLink[]
}

export default function Contact({
  contact = defaultPortfolioContent.contact,
  identity = defaultPortfolioContent.identity,
  socialLinks = defaultPortfolioContent.socialLinks,
}: ContactProps) {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    name: "",
    subject: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const clickAudioRef = useRef<HTMLAudioElement | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  useEffect(() => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav")
    audio.volume = 0.2
    clickAudioRef.current = audio
  }, [])

  const playClickSound = () => {
    const isMuted = localStorage.getItem("portfolio-muted") !== "false"
    if (!isMuted && clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0
      clickAudioRef.current.play().catch(() => {})
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    playClickSound()

    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

    if (!publicKey || !serviceId || !templateId) {
      toast({
        title: "Email setup missing",
        description: "Add the EmailJS credentials to your env configuration.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      emailjs.init(publicKey)

      const now = new Date()
      const formattedDate = now.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        weekday: "long",
        year: "numeric",
      })
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })

      const result = await emailjs.send(serviceId, templateId, {
        date_time: `${formattedDate} at ${formattedTime}`,
        from_email: formData.email,
        from_name: formData.name,
        message: formData.message,
        subject: formData.subject,
        to_email: contact.formRecipientEmail || identity.primaryEmail,
      })

      if (result.text === "OK") {
        toast({
          title: "Message dispatched to coordinates!",
          description: "Your correspondence has been sent to the Survey Command.",
        })

        setFormData({
          email: "",
          message: "",
          name: "",
          subject: "",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Failed transmission",
        description: "There was a disruption in the link flow. Try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20 bg-dark-color transition-colors duration-700">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(110,5,5,0.06)_0%,_transparent_65%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        
        {/* Header Block */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <div
            className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-sm ${
              isLight
                ? "border-emerald-800/30 bg-emerald-950/10 text-emerald-600"
                : "border-red-800/30 bg-red-950/10 text-red-500"
            }`}
          >
            <Swords size={12} className={`${isLight ? "text-emerald-500" : "text-red-500"} animate-pulse`} />
            <span className="text-[0.62rem] uppercase tracking-[0.38em] font-semibold font-mono">
              {isLight ? "THE DAWN ASSEMBLY" : "THE CAMPFIRE ASSEMBLY"}
            </span>
          </div>

          <h2 className="gothic-header text-4xl md:text-5xl font-bold uppercase tracking-[-0.04em] text-text-color">
            {contact.title}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-text-secondary">
            {isLight
              ? `${contact.description} "Dream of the tomorrow. Stand together at dawn, ready to make the final move."`
              : `${contact.description} "Struggle, endure, contend. There is no paradise to escape to. Join the campfire."`}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          
          {/* Form dossier container */}
          <div className="steel-runic-panel p-6 md:p-8 rounded-[24px] border border-text-color/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-text-color/5 pb-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-sm border ${
                  isLight
                    ? "border-emerald-800/25 bg-emerald-950/5 text-emerald-650"
                    : "border-red-800/30 bg-red-950/20 text-red-500"
                }`}
              >
                <MessageSquare size={16} />
              </div>
              <div>
                <p className="text-[0.55rem] font-mono uppercase tracking-[0.25em] text-text-secondary/40">
                  Dossier dispatch
                </p>
                <h3 className="text-lg font-bold uppercase text-text-color tracking-tight">{contact.formTitle}</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-left">
                  <span className={`mb-2 block text-[0.65rem] uppercase tracking-widest ${isLight ? "text-text-secondary/80" : "text-white/50"}`}>
                    Your Name
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-sm border text-sm px-4 py-3 focus:outline-none transition-colors",
                      isLight
                        ? "bg-black/5 border-text-color/10 text-text-color focus:border-emerald-600"
                        : "bg-black/60 border-white/5 text-white focus:border-red-800"
                    )}
                    required
                  />
                </label>

                <label className="block text-left">
                  <span className={`mb-2 block text-[0.65rem] uppercase tracking-widest ${isLight ? "text-text-secondary/80" : "text-white/50"}`}>
                    Your Email
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-sm border text-sm px-4 py-3 focus:outline-none transition-colors",
                      isLight
                        ? "bg-black/5 border-text-color/10 text-text-color focus:border-emerald-600"
                        : "bg-black/60 border-white/5 text-white focus:border-red-800"
                    )}
                    required
                  />
                </label>
              </div>

              <label className="block text-left">
                <span className={`mb-2 block text-[0.65rem] uppercase tracking-widest ${isLight ? "text-text-secondary/80" : "text-white/50"}`}>
                  Subject Coordinate
                </span>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={cn(
                    "w-full rounded-sm border text-sm px-4 py-3 focus:outline-none transition-colors",
                    isLight
                      ? "bg-black/5 border-text-color/10 text-text-color focus:border-emerald-600"
                      : "bg-black/60 border-white/5 text-white focus:border-red-800"
                  )}
                  required
                />
              </label>

              <label className="block text-left">
                <span className={`mb-2 block text-[0.65rem] uppercase tracking-widest ${isLight ? "text-text-secondary/80" : "text-white/50"}`}>
                  Correspondence Message
                </span>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={cn(
                    "w-full rounded-sm border text-sm px-4 py-3 min-h-[160px] resize-y focus:outline-none transition-colors",
                    isLight
                      ? "bg-black/5 border-text-color/10 text-text-color focus:border-emerald-600"
                      : "bg-black/60 border-white/5 text-white focus:border-red-800"
                  )}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "group w-full inline-flex items-center justify-center gap-3 border px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] rounded-sm transition-all disabled:opacity-50",
                  isLight
                    ? "border-emerald-800 bg-emerald-950/10 text-emerald-805 hover:bg-emerald-900/10 hover:border-emerald-500 hover:text-emerald-700"
                    : "border-red-800 bg-red-950/20 text-red-500 hover:bg-red-900/20 hover:border-red-500"
                )}
              >
                <Send size={13} />
                <span>{isSubmitting ? contact.submittingLabel : contact.submitLabel}</span>
              </button>
            </form>
          </div>

          {/* Info Panels */}
          <div className="space-y-6">
            <div className="steel-runic-panel p-6 rounded-[24px] border border-text-color/5">
              <p className="text-[0.55rem] font-mono uppercase tracking-[0.25em] text-text-secondary/40 border-b border-text-color/5 pb-2 mb-4">
                {contact.infoTitle}
              </p>
              <div className="space-y-4">
                {contact.infoItems.map((item) => {
                  const Icon = contactIconMap[item.iconName as keyof typeof contactIconMap] ?? Mail

                  return (
                    <div key={item.label} className="flex items-start gap-4 rounded-sm border border-text-color/5 bg-black/5 p-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center border ${
                          isLight
                            ? "border-emerald-800/25 bg-emerald-950/5 text-emerald-700"
                            : "border-red-800/30 bg-red-950/20 text-red-500"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-[0.62rem] font-mono uppercase tracking-[0.2em] text-text-secondary/40">{item.label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-text-color font-sans">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="steel-runic-panel p-6 rounded-[24px] border border-text-color/5">
              <div className="flex items-center justify-between gap-4 border-b border-text-color/5 pb-2 mb-4">
                <p className="text-[0.55rem] font-mono uppercase tracking-[0.25em] text-text-secondary/40">
                  {contact.socialTitle}
                </p>
                <ArrowUpRight size={14} className={isLight ? "text-emerald-600" : "text-red-500"} />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">{contact.socialDescription}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {socialLinks.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    target={option.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={option.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className={cn(
                      "text-[0.68rem] font-mono uppercase tracking-wider px-4 py-3 border rounded-sm text-center transition-all",
                      isLight
                        ? "border-emerald-800/10 bg-white/20 text-text-secondary hover:text-emerald-700 hover:border-emerald-800/25"
                        : "border-white/5 bg-black/40 text-text-secondary hover:text-white hover:border-white/10"
                    )}
                  >
                    <i className={`${option.iconClass} mr-2`} />
                    {option.label}
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
