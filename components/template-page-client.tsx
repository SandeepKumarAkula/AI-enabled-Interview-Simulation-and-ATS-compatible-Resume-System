"use client"

import ResumeBuilder from "@/components/resume-builder"
import { useRouter } from "next/navigation"
import React from "react"

export default function TemplatePageClient({ templateId }: { templateId: string }) {
  const router = useRouter()

  return <ResumeBuilder template={templateId} onBack={() => router.push('/')} />
}
