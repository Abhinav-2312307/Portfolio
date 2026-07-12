"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { FooterContent, Identity, NavigationItem, SocialLink } from "@/lib/portfolio/schema"
import { cn } from "@/lib/utils"

type FooterProps = {
  footer?: FooterContent
  identity?: Identity
  items?: NavigationItem[]
  socialLinks?: SocialLink[]
}

export default function Footer({
  footer = defaultPortfolioContent.footer,
  identity = defaultPortfolioContent.identity,
  items = defaultPortfolioContent.navigation.items,
  socialLinks = defaultPortfolioContent.socialLinks,
}: FooterProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"
  
  const triggerSecretEasterEgg = () => {
    if (isLight) {
      alert(
        "Dreamer, you have uncovered the Wings of Freedom. Beyond the walls, there is hope.\n\n\"We will see the ocean. Beyond the walls, there is freedom.\" — Armin Arlert\n\n[Dossier verified: Abhinav Sahu, CSE 2027]"
      )
    } else {
      alert(
        "Struggler, you have uncovered the Brand of Sacrifice. Causality has brought you here.\n\n\"Keep moving forward, even if you die, even after you die.\" — Eren Yeager\n\n[Dossier verified: Abhinav Sahu, CSE 2027]"
      )
    }
  }

  return (
    <footer className="relative overflow-hidden px-8 py-12 bg-dark-color transition-colors duration-700">
      {/* Background Graphic Visual Fade: Guts/Eren standing cliff side silhouette */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom opacity-[0.06] saturate-[0.5]"
        style={{ backgroundImage: "url('/assets/eren-yeager-dark-wind-cliff-anime-realism-live-wallpaper-mobile-hd-4k-8k.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-color via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="steel-runic-panel rounded-[24px] px-6 py-12 text-center border border-text-color/5 md:px-10">
          
          <div className="relative z-10 space-y-8">
            
            {/* Brand Logo Identity */}
            <Link href="#home" className="inline-flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-sm border font-bold font-mono",
                  isLight
                    ? "border-emerald-800/30 bg-emerald-950/10 text-emerald-600"
                    : "border-red-800/30 bg-red-950/20 text-red-500"
                )}
              >
                {identity.initials}
              </span>
              <span className="text-xl font-bold uppercase tracking-tight text-text-color font-sans">{identity.fullName}</span>
            </Link>

            {/* Description */}
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-text-secondary">
              {footer.description} Designing AI-first products and systems under Causality's control.
            </p>

            {/* Nav anchors */}
            <div className="flex flex-wrap justify-center gap-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "text-[0.62rem] font-mono uppercase tracking-widest px-4 py-2 border transition-colors rounded-sm",
                    isLight
                      ? "border-emerald-800/10 bg-white/20 text-text-secondary hover:text-emerald-600 hover:border-emerald-950/85"
                      : "border-white/5 bg-black/40 text-text-secondary hover:text-red-500 hover:border-red-950/80"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Social linkages */}
            <div className="flex justify-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center border transition-all rounded-sm hover:-translate-y-0.5",
                    isLight
                      ? "border-emerald-800/10 bg-white/20 text-text-secondary hover:text-emerald-650 hover:border-emerald-950/80"
                      : "border-white/5 bg-black/40 text-text-secondary hover:text-red-500 hover:border-red-950/80"
                  )}
                  aria-label={link.label}
                >
                  <i className={link.iconClass}></i>
                </a>
              ))}
            </div>

            {/* Easter Egg Brand of Sacrifice Trigger */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={triggerSecretEasterEgg}
                className="group relative cursor-help p-2 opacity-25 hover:opacity-100 transition-opacity duration-300"
                aria-label="Secret Brand of Sacrifice"
              >
                {isLight ? (
                  /* Wings of Freedom Vector SVG */
                  <svg
                    width="20"
                    height="24"
                    viewBox="0 0 20 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-emerald-800/60 group-hover:fill-emerald-600 transition-colors filter group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  >
                    <path d="M3 13C3 13 4.5 9 8 8C9.5 7.5 10.5 8 11.5 8.5C11.5 8.5 9.5 10 9 11.5C8.5 13 9 14.5 9 14.5C9 14.5 7 13.5 6 14.5C5 15.5 5 17 5 17C5 17 6.5 16 8 16.5C9.5 17 10 18.5 10 18.5C10 18.5 8.5 19.5 7 19.5C5.5 19.5 4 18 4 18C4 18 4.5 20.5 7.5 21C10.5 21.5 12 19 12 19C12 19 12.5 21 15 20.5C17.5 20 18 17 18 17C18 17 17 18 15.5 17.5C14 17 13.5 15.5 13.5 15.5C13.5 15.5 15 16.5 16.5 15.5C18 14.5 18 12.5 18 12.5C18 12.5 16 13 15 12C14 11 14.5 9.5 14.5 9.5C14.5 9.5 15.5 11 17 10.5C18.5 10 19 7 19 7C19 7 17.5 8.5 15 8C12.5 7.5 11 9 11 9C11 9 10.5 6.5 7.5 6C4.5 5.5 3 8 3 8C3 8 4 6.5 6 6.5C8 6.5 9 8.5 9 8.5C9 8.5 7.5 9.5 6 9.5C4.5 9.5 3 11 3 11C3 11 4.5 11 6 12C7.5 13 8 14.5 8 14.5C8 14.5 6 15 5 14C4 13 3 13 3 13Z" />
                  </svg>
                ) : (
                  /* Brand of Sacrifice Vector SVG */
                  <svg
                    width="20"
                    height="28"
                    viewBox="0 0 20 28"
                    fill="none"
                    xmlns="http://www.w3.org/2500/svg"
                    className="fill-white/60 group-hover:fill-red-600 transition-colors filter group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                  >
                    <path d="M10 2C9.5 2 9 3 9 4.5V11L4 7.5L3 9L9 13.5V17L2 15L1 16.5L9 20.5V26C9 27 9.5 27.5 10 27.5C10.5 27.5 11 27 11 26V20.5L19 16.5L18 15L11 17V13.5L17 9L16 7.5L11 11V4.5C11 3 10.5 2 10 2Z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Copyright & stamp */}
            <div className="text-[0.62rem] font-mono text-text-secondary/50 border-t border-text-color/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span>&copy; {new Date().getFullYear()} {identity.fullName}. {footer.copyrightLabel}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 uppercase",
                  isLight ? "text-emerald-600/60" : "text-red-500/50"
                )}
              >
                <Shield size={10} className="animate-pulse" />
                {isLight ? "System Active // Freedom Lock" : "System Active // Causality Lock"}
              </span>
            </div>

          </div>

        </div>
      </div>
    </footer>
  )
}
