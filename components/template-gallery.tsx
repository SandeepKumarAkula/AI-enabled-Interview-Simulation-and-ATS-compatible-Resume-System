"use client"

import { RESUME_TEMPLATES } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion";

interface TemplateGalleryProps {
  onSelectTemplate?: (templateId: string) => void
}
export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const router = useRouter();

 const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const smoothReveal: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="border-b border-[#f0f0f0] bg-gradient-to-b from-white via-[#ecfdf5] to-[#ffffff]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-6xl px-6 py-32 text-center flex flex-col items-center justify-center"
        >
          {/* Animated Headline */}
          <motion.h1
            variants={smoothReveal}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1a1a] mb-6 leading-tight tracking-tight max-w-5xl"
          >
            Build Your{" "}
            <span className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] bg-clip-text text-transparent">
              Professional Resume
            </span>
            , Check ATS Score & Prepare for{" "}
            <span className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] bg-clip-text text-transparent">
              Interviews
            </span>{" "}
            with AI
          </motion.h1>

          {/* Animated Subtext */}
          <motion.p
            variants={smoothReveal}
            className="text-base sm:text-lg md:text-xl text-[#555555] max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Choose from our modern, ATS-friendly templates. Edit easily, export as PDF, 
            and enhance your chances with AI-powered resume analysis & interview preparation tools.
          </motion.p>

    
        </motion.div>
      

    </header>

  {/* Gallery */}
  <main id="templates" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {RESUME_TEMPLATES.map((template, index) => (
            <div
              key={template.id}
              className="group flex flex-col h-full rounded-lg border border-[#e0e0e0] overflow-hidden hover:border-[#2ecc71] hover:shadow-lg transition-all duration-300 bg-white"
            >
             {/* Resume Preview */}
<div className="relative bg-gradient-to-b from-[#ffffff] to-[#f9fafb] flex items-center justify-center overflow-hidden group-hover:shadow-md rounded-t-xl transition-all duration-300">
  <div className="relative w-full aspect-[3/4] flex items-center justify-center bg-white border-b border-[#e5e7eb] rounded-t-lg shadow-sm hover:shadow-md transition-all duration-500">
    <Image
      src={template.preview || "/placeholder.svg"}
      alt={`${template.name} template preview`}
      width={400}
      height={533} // 3:4 aspect ratio (avoids distortion)
      quality={template.quality || 100}
      className={`object-${template.fit || "contain"} w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]`}
    />
  </div>
</div>

              {/* Content */}
  <div className="flex flex-col flex-1 p-5">
                <h3 className="text-base font-semibold text-[#222222] mb-1">{template.name}</h3>
                <p className="text-sm text-[#666666] mb-5 flex-1">{template.description}</p>
                <Button
                  onClick={() => {
                    // navigate to dynamic template page for deep links
                    router.push(`/templates/${template.id}`)
                    if (onSelectTemplate) onSelectTemplate(template.id)
                  }}
                  className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white font-medium transition-colors"
                >
                  <span>Select</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  )
}
