"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export default function ResumeButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent border-primary-color text-primary-color hover:bg-primary-color hover:text-dark-color transition-all duration-300"
        >
          Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-4">My Resume</DialogTitle>
          <Button
            variant="outline"
            className="absolute right-4 top-4 bg-primary-color text-dark-color hover:bg-primary-dark"
            onClick={() => window.open("/resume.pdf", "_blank")}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogHeader>
        <div className="w-full h-[70vh] overflow-hidden rounded-md">
          <iframe src="/resume.pdf" className="w-full h-full border-0" title="Resume" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
