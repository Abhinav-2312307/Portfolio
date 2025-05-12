"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ResumeButtonProps {
  fullWidth?: boolean
}

export default function ResumeButton({ fullWidth = false }: ResumeButtonProps) {
  return (
    <Button
      className={`bg-primary-color hover:bg-primary-dark text-dark-color font-medium transition-colors ${
        fullWidth ? "w-full justify-center" : ""
      }`}
      onClick={() => window.open("/resume.pdf", "_blank")}
    >
      <Download size={16} className="mr-2" />
      Resume
    </Button>
  )
}
