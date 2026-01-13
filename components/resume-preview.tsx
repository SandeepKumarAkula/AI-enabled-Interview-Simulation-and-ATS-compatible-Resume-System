"use client"

import { Card } from "@/components/ui/card"
import ClassicTemplate from "@/components/templates/classic-template"
import ModernTemplate from "@/components/templates/modern-template"
import MinimalTemplate from "@/components/templates/minimal-template"
import ATSFriendlyTemplate from "@/components/templates/ats-friendly-template"
import TwoColumnTemplate from "@/components/templates/two-column-template"
import AcademicTemplate from "@/components/templates/academic-template"
import ElegantTemplate from "@/components/templates/elegant-template"
import type { ResumeData } from "@/lib/types"

interface ResumePreviewProps {
  data: ResumeData
  template: string
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate data={data} />
      case "modern":
        return <ModernTemplate data={data} />
      case "minimal":
        return <MinimalTemplate data={data} />
      case "ats-friendly":
        return <ATSFriendlyTemplate data={data} />
      case "two-column":
        return <TwoColumnTemplate data={data} />
      case "academic":
        return <AcademicTemplate data={data} />
      case "elegant":
        return <ElegantTemplate data={data} />
      default:
        return <ClassicTemplate data={data} />
    }
  }

  return (
    <Card className="sticky top-24 bg-white shadow-lg h-fit overflow-hidden border-0">
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto text-xs">{renderTemplate()}</div>
    </Card>
  )
}
