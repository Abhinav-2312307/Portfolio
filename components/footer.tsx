import Link from "next/link"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { FooterContent, Identity, NavigationItem, SocialLink } from "@/lib/portfolio/schema"

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
  return (
    <footer className="relative overflow-hidden px-8 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="liquid-glass rounded-[2rem] border border-white/15 px-6 py-10 text-center shadow-liquid dark:border-white/10 md:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgb(var(--primary-color)_/_0.12),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgb(var(--accent-color)_/_0.1),_transparent_30%)]" />

          <div className="relative z-10">
            <Link href="#home" className="inline-flex items-center gap-3 rounded-full px-4 py-2">
              <span className="glass-pill inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 font-semibold text-primary-color dark:border-white/10">
                {identity.initials}
              </span>
              <span className="text-xl font-semibold text-text-color">{identity.fullName}</span>
            </Link>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-secondary md:text-base">{footer.description}</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="glass-pill rounded-full border border-white/12 px-4 py-2 text-sm capitalize text-text-secondary transition-colors hover:text-primary-color dark:border-white/10"
                >
                  {item.label.toLowerCase()}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="glass-pill inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-text-secondary transition-colors hover:text-primary-color dark:border-white/10"
                  aria-label={link.label}
                >
                  <i className={link.iconClass}></i>
                </a>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 text-sm text-text-secondary">
              &copy; {new Date().getFullYear()} {identity.fullName}. {footer.copyrightLabel}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
