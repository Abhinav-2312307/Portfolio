"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download } from "lucide-react"

interface ResumeButtonProps {
  fullWidth?: boolean
  className?: string
}

export default function ResumeButton({ fullWidth = false, className }: ResumeButtonProps) {
  return (
    <Button
      className={cn(
        "glass-pill border border-[rgb(var(--glass-border)_/_0.18)] bg-[linear-gradient(135deg,rgb(var(--glass-bg-strong)_/_0.88),rgb(var(--glass-bg)_/_0.68))] font-medium text-text-color shadow-[0_14px_32px_rgb(var(--overlay-color)_/_0.12)] transition-all hover:-translate-y-0.5 hover:border-[rgb(var(--primary-color)_/_0.3)] hover:text-primary-color hover:shadow-[0_18px_36px_rgb(var(--overlay-color)_/_0.16)]",
        fullWidth && "w-full justify-center",
        className,
      )}
      onClick={() => window.open("/resume.pdf", "_blank")}
    >
      <Download size={16} className="mr-2" />
      Resume
    </Button>
  )
}
