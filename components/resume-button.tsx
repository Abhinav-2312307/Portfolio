"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import { cn } from "@/lib/utils"

interface ResumeButtonProps {
  className?: string
  fullWidth?: boolean
  resumeUrl?: string
}

export default function ResumeButton({
  className,
  fullWidth = false,
  resumeUrl = defaultPortfolioContent.identity.resumeUrl,
}: ResumeButtonProps) {
  return (
    <Button
      className={cn(
        "glass-pill border border-[rgb(var(--glass-border)_/_0.18)] bg-[linear-gradient(135deg,rgb(var(--glass-bg-strong)_/_0.88),rgb(var(--glass-bg)_/_0.68))] font-medium text-text-color shadow-[0_14px_32px_rgb(var(--overlay-color)_/_0.12)] transition-all hover:-translate-y-0.5 hover:border-[rgb(var(--primary-color)_/_0.3)] hover:text-primary-color hover:shadow-[0_18px_36px_rgb(var(--overlay-color)_/_0.16)]",
        fullWidth && "w-full justify-center",
        className,
      )}
      onClick={() => window.open(resumeUrl, "_blank")}
    >
      <Download size={16} className="mr-2" />
      Resume
    </Button>
  )
}
