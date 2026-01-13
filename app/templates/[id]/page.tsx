import React from "react"
import TemplatePageClient from "@/components/template-page-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TemplatePage({ params }: PageProps) {
  // Await params to unwrap the Promise (required in Next.js 15+)
  const { id } = await params
  return <TemplatePageClient templateId={id} />
}
