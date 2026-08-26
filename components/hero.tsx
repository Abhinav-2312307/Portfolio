"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowRight, Volume2, VolumeX, Swords, Compass } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { HeroContent, Identity, SocialLink } from "@/lib/portfolio/schema"
import { requestPortfolioScrollTo } from "@/lib/smooth-scroll"

type HeroProps = {
  hero?: HeroContent
  identity?: Identity
  socialLinks?: SocialLink[]
}

export default function Hero({
  hero = defaultPortfolioContent.hero,
  identity = defaultPortfolioContent.identity,
  socialLinks = defaultPortfolioContent.socialLinks,
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const typingTextRef = useRef<HTMLSpanElement>(null)
  const [muted, setMuted] = useState(true)
  const [ambientAudio, setAmbientAudio] = useState<HTMLAudioElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  // Track scroll position for parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"])
  const midgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"])
  const characterScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Sync mute state on mount
  useEffect(() => {
    const savedMuted = localStorage.getItem("portfolio-muted")
    setMuted(savedMuted !== "false")
  }, [])

  // Setup ambient campfire or forest morning breeze sound dynamically based on theme
  useEffect(() => {
    if (!mounted) return

    const src = isLight
      ? "https://assets.mixkit.co/active_storage/sfx/1188/1188-84.wav" // morning forest breeze (Hope)
      : "https://assets.mixkit.co/active_storage/sfx/2433/2433-84.wav" // crackling fire loop (Despair)

    const audio = new Audio(src)
    audio.loop = true
    audio.volume = isLight ? 0.12 : 0.25
    setAmbientAudio(audio)

    const savedMuted = localStorage.getItem("portfolio-muted")
    const isMuted = savedMuted !== "false"
    audio.muted = isMuted
    if (!isMuted) {
      audio.play().catch(() => {})
    }

    return () => {
      audio.pause()
    }
  }, [isLight, mounted])

  // Handle ambient audio play/pause when muted changes
  useEffect(() => {
    if (!ambientAudio) return
    ambientAudio.muted = muted
    if (!muted) {
      ambientAudio.play().catch(() => {})
    } else {
      ambientAudio.pause()
    }
  }, [muted, ambientAudio])

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    localStorage.setItem("portfolio-muted", String(nextMuted))
  }

  // Canvas floating elements animation: embers (dark) vs leaves/feathers (light)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    class Particle {
      x: number = 0
      y: number = 0
      size: number = 0
      speedY: number = 0
      speedX: number = 0
      opacity: number = 0
      decay: number = 0
      color: string = ""
      angle: number = 0

      constructor() {
        this.reset(true)
      }

      reset(init = false) {
        const isCurrentLight = document.documentElement.classList.contains("light")
        this.x = Math.random() * width

        if (isCurrentLight) {
          // Feathers/leaves drifting down and right
          this.y = init ? Math.random() * height : -15
          this.size = Math.random() * 3 + 1.6
          this.speedY = Math.random() * 0.7 + 0.4
          this.speedX = Math.random() * 0.4 + 0.15
          this.opacity = Math.random() * 0.5 + 0.2
          this.decay = Math.random() * 0.0008 + 0.0004
          this.angle = Math.random() * Math.PI * 2

          const rand = Math.random()
          if (rand < 0.45) {
            this.color = `rgba(255, 255, 255, ${this.opacity})` // White feather
          } else if (rand < 0.8) {
            this.color = `rgba(32, 96, 74, ${this.opacity})` // Green military leaf
          } else {
            this.color = `rgba(185, 138, 25, ${this.opacity})` // Gold leaf
          }
        } else {
          // Embers rising up
          this.y = init ? Math.random() * height : height + 10
          this.size = Math.random() * 2.5 + 0.8
          this.speedY = -(Math.random() * 1.5 + 0.6)
          this.speedX = Math.sin(Math.random() * Math.PI) * 0.4
          this.opacity = Math.random() * 0.7 + 0.3
          this.decay = Math.random() * 0.002 + 0.001

          const rand = Math.random()
          if (rand < 0.4) {
            this.color = `rgba(180, 15, 15, ${this.opacity})` // Crimson
          } else if (rand < 0.75) {
            this.color = `rgba(230, 92, 0, ${this.opacity})` // Orange
          } else {
            this.color = `rgba(212, 175, 55, ${this.opacity})` // Gold
          }
        }
      }

      update() {
        const isCurrentLight = document.documentElement.classList.contains("light")

        if (isCurrentLight) {
          this.y += this.speedY
          this.x += this.speedX + Math.sin(this.y / 40) * 0.35
          this.angle += 0.01
          this.opacity -= this.decay

          if (this.opacity <= 0 || this.y > height + 15 || this.x > width + 15 || this.x < -15) {
            this.reset(false)
          }
        } else {
          this.y += this.speedY
          this.x += this.speedX + Math.sin(this.y / 30) * 0.25
          this.opacity -= this.decay

          if (this.opacity <= 0 || this.y < -10 || this.x < -10 || this.x > width + 10) {
            this.reset(false)
          }
        }
      }

      draw(c: CanvasRenderingContext2D) {
        const isCurrentLight = document.documentElement.classList.contains("light")
        c.beginPath()

        if (isCurrentLight) {
          // Render leaves / feathers as rotated ellipses
          c.save()
          c.translate(this.x, this.y)
          c.rotate(this.angle)
          c.ellipse(0, 0, this.size * 2, this.size * 0.9, 0, 0, Math.PI * 2)
          c.fillStyle = this.color
          c.shadowBlur = this.size * 1.5
          c.shadowColor = "rgba(32, 96, 74, 0.15)"
          c.fill()
          c.restore()
        } else {
          c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          c.fillStyle = this.color
          c.shadowBlur = this.size * 2
          c.shadowColor = "rgb(180, 15, 15)"
          c.fill()
          c.shadowBlur = 0
        }
      }
    }

    const particles: Particle[] = Array.from({ length: 65 }, () => new Particle())

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.update()
        p.draw(ctx)
      })
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Role typewriter effect
  useEffect(() => {
    if (!typingTextRef.current) return
    if (prefersReducedMotion) {
      typingTextRef.current.textContent = hero.roles[0] ?? ""
      return
    }

    let roleIndex = 0
    let charIndex = 0
    let isDeleting = false
    let timeoutId: ReturnType<typeof setTimeout>

    const type = () => {
      const currentRole = hero.roles[roleIndex] ?? ""
      const span = typingTextRef.current

      if (!span) return

      if (isDeleting) {
        span.textContent = currentRole.substring(0, charIndex - 1)
        charIndex--
      } else {
        span.textContent = currentRole.substring(0, charIndex + 1)
        charIndex++
      }

      let delta = isDeleting ? 40 : 80

      if (!isDeleting && charIndex === currentRole.length) {
        delta = 2500 // hold role
        isDeleting = true
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        roleIndex = (roleIndex + 1) % hero.roles.length
        delta = 450 // hold pause
      }

      timeoutId = setTimeout(type, delta)
    }

    type()

    return () => window.clearTimeout(timeoutId)
  }, [hero.roles, prefersReducedMotion])

  // Theme-specific visuals
  const bgWallpaper = isLight
    ? hero.lightWallpaper ?? "/assets/wallpapersden.com_eren-yeager-cool-attack-on-titan_4808x3858.jpg"
    : hero.darkWallpaper ?? "/assets/berserk-knight-guts-5120x2880-18713.jpg"

  const cutoutImage = isLight
    ? hero.lightCutout ?? "/assets/Eren-Yeager-Lock-Screen-Wallpaper-4k.jpg"
    : hero.darkCutout ?? "/assets/eren-yeager-dark-wind-cliff-anime-realism-live-wallpaper-mobile-hd-4k-8k.jpg"

  return (
    <section
      ref={containerRef}
      id="home"
      data-scroll-section
      className="relative min-h-screen overflow-hidden flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 bg-dark-color transition-colors duration-700"
    >
      {/* Background Parallax Image Layer */}
      <motion.div
        style={{ y: backgroundY, opacity: opacityFade }}
        className="absolute inset-0 z-0 bg-cover bg-center"
      >
        <Image
          src={bgWallpaper}
          alt="Atmospheric theme background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left opacity-[0.24] filter saturate-[0.7] blur-[1.5px]"
        />
        {isLight ? (
          <>
            {/* Sunrise Warm Light Leak Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-color via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.2)_0%,_transparent_65%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.15)_0%,_transparent_55%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-[#07080a]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07080a] via-transparent to-transparent" />
          </>
        )}
      </motion.div>

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Audio Ambient Controller */}
      <div className="absolute right-6 bottom-6 z-20 flex items-center gap-3">
        <span className="text-[0.55rem] uppercase tracking-[0.3em] text-text-secondary/50 font-mono hidden sm:inline-block">
          {isLight
            ? muted
              ? "WINGS OF FREEDOM MUTED"
              : "LISTENING TO THE OCEAN"
            : muted
              ? "DESPAIR AMBIANCE OFF"
              : "LISTENING TO CAUSALITY"}
        </span>
        <button
          type="button"
          onClick={toggleMute}
          className={`flex h-11 w-11 items-center justify-center rounded-full border bg-black/40 backdrop-blur-sm transition-all hover:scale-105 ${
            isLight
              ? "border-emerald-800/40 text-emerald-600 hover:border-emerald-500/80 hover:text-emerald-500"
              : "border-red-800/40 text-red-500 hover:border-red-500/80 hover:text-white"
          }`}
          aria-label="Toggle ambient track"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Runic Side Coordinates (Design details) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 text-[0.55rem] uppercase tracking-[0.4em] text-text-secondary/30 font-mono [writing-mode:vertical-rl] z-10">
        <span>{isLight ? "WALL MARIA RECOVERY - DISTRICT 01" : "WALL MARIA OUTPOST - CSE DEPT"}</span>
        <span className="h-12 w-px bg-text-color/10 self-center" />
        <span>{isLight ? "WINGS OF FREEDOM // OCEAN HORIZON" : "BRAND 54.23 // FREEDOM SHIFT"}</span>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center min-h-[80vh] pt-12">
        
        {/* Editorial Text Layer */}
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-left"
        >
          <div className="space-y-4">
            {/* Thematic Badge */}
            <div
              className={`inline-flex items-center gap-3 border px-4 py-1.5 rounded-sm ${
                isLight
                  ? "border-emerald-800/30 bg-emerald-950/10"
                  : "border-red-800/30 bg-red-950/20"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  isLight
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                }`}
              />
              <span
                className={`text-[0.62rem] uppercase tracking-[0.38em] font-semibold font-mono ${
                  isLight ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {isLight ? "The Wings of Freedom" : "The Struggler's Ascent"}
              </span>
            </div>

            {/* Name/Role */}
            <p className="text-xs uppercase tracking-[0.5em] text-text-secondary/50 font-mono">
              {identity.fullName} // {isLight ? "SURVEY CORPS COMMANDER" : "SURVEY CORPS MEMBER"}
            </p>

            <h1 className="gothic-header text-[3.8rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.9] font-bold uppercase tracking-[-0.04em] text-text-color">
              {isLight ? (
                <>
                  Dream <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500">
                    &amp; Fly Free
                  </span>
                </>
              ) : (
                <>
                  Struggle <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-500">
                    &amp; Conquer
                  </span>
                </>
              )}
            </h1>
          </div>

          <p className="max-w-xl text-base md:text-lg leading-relaxed text-text-secondary">
            {isLight
              ? `${hero.intro} ${hero.lightIntroQuote ?? "\"If you begin to regret, you'll dull your future decisions and let others make choices for you. Keep moving forward, dream of the ocean.\""}`
              : `${hero.intro} ${hero.darkIntroQuote ?? "This portfolio is my weapon—forged to conquer complex backend systems and build intelligent AI products. If we do not fight, we cannot win."}`}
          </p>

          {/* Typewriter details */}
          <div className="flex items-center gap-2.5 font-mono text-sm text-text-secondary">
            <span className={isLight ? "text-emerald-600" : "text-red-500"}>&gt;_</span>
            <span>{hero.typingPrefix}</span>
            <span
              ref={typingTextRef}
              className={`font-semibold text-text-color underline ${
                isLight ? "decoration-emerald-800" : "decoration-red-800"
              }`}
            />
            <span
              className={`hero-caret h-4 w-1.5 animate-pulse ${
                isLight ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="button"
              onClick={() => requestPortfolioScrollTo({ id: "projects", offset: -90 })}
              className={`group inline-flex items-center justify-center gap-3 rounded-sm px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-primary transition-all duration-300 hover:-translate-y-0.5 ${
                isLight
                  ? "bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-600 hover:to-emerald-800"
                  : "bg-gradient-to-r from-red-800 to-red-600 hover:from-red-600 hover:to-red-800"
              }`}
            >
              <Swords size={15} />
              <span>{isLight ? "Explore Archives" : "Explore Conquests"}</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => requestPortfolioScrollTo({ id: "contact", offset: -90 })}
              className="inline-flex items-center justify-center gap-3 rounded-sm border border-text-color/10 bg-text-color/[0.02] hover:bg-text-color/[0.06] hover:border-text-color/20 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-text-color transition-all duration-300 hover:-translate-y-0.5"
            >
              <Compass size={15} />
              <span>{isLight ? "Explore the Sea" : "Join Campfire"}</span>
            </button>
          </div>
        </motion.div>

        {/* Cinematic Parallax Graphic Layer */}
        <motion.div
          style={{ y: midgroundY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          className="relative flex justify-center items-center"
        >
          {/* Wall Outline silhouette */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div
              className={`relative w-80 h-80 rounded-full border border-dashed animate-[spin_50s_linear_infinite] ${
                isLight ? "border-emerald-800/15" : "border-red-800/25"
              }`}
            />
            <div
              className={`absolute w-[22rem] h-[22rem] rounded-full border animate-[spin_80s_linear_infinite_reverse] ${
                isLight ? "border-emerald-800/5" : "border-red-800/10"
              }`}
            />
          </div>

          {/* Character visual cutout */}
          <motion.div
            style={{ scale: characterScale }}
            className="steel-runic-panel relative w-full max-w-[28rem] h-[34rem] rounded-[24px] overflow-hidden p-2 group"
          >
            {/* Corner runic borders */}
            <div
              className={`absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 ${
                isLight ? "border-emerald-600/40" : "border-red-600/40"
              }`}
            />
            <div
              className={`absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 ${
                isLight ? "border-emerald-600/40" : "border-red-600/40"
              }`}
            />
            <div
              className={`absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 ${
                isLight ? "border-emerald-600/40" : "border-red-600/40"
              }`}
            />
            <div
              className={`absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 ${
                isLight ? "border-emerald-600/40" : "border-red-600/40"
              }`}
            />

            <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-black/10">
              <Image
                src={cutoutImage}
                alt="Eren Yeager identity graphic"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-[2000ms] filter saturate-[0.8] brightness-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-color/85 via-transparent to-transparent" />

              {/* Character Identity Stencil tag */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between border-t border-text-color/10 pt-4 z-20">
                <div className="space-y-1">
                  <p className="text-[0.55rem] uppercase tracking-[0.25em] text-text-secondary/60 font-mono">
                    Current Objective
                  </p>
                  <p className="text-sm font-semibold tracking-[-0.02em] text-text-color font-sans">
                    Forging full-stack AI tools
                  </p>
                </div>
                <span
                  className={`text-[0.62rem] uppercase tracking-[0.3em] font-mono border px-2 py-0.5 rounded-sm ${
                    isLight
                      ? "text-emerald-600 border-emerald-500/30 bg-emerald-950/10"
                      : "text-red-500 border-red-500/30 bg-red-950/20"
                  }`}
                >
                  {isLight ? "[SURVEYING]" : "[ACTIVE]"}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
