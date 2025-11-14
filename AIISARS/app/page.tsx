"use client"

import { useState } from "react"
import TemplateGallery from "@/components/template-gallery"
import ResumeBuilder from "@/components/resume-builder"

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  if (selectedTemplate) {
    return <ResumeBuilder template={selectedTemplate} onBack={() => setSelectedTemplate(null)} />
  }

  return <TemplateGallery onSelectTemplate={setSelectedTemplate} />
}
