"use client"

import { useState } from "react"
import Link from "next/link"
import TemplateGallery from "@/components/template-gallery"
import ResumeBuilder from "@/components/resume-builder"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const FeatureCard = ({
    title,
    description,
    btnText,
    href,
    variant = "solid",
    imageSrc
  }: {
    title: string
    description: string
    btnText: string
    href: string
    variant?: "solid" | "outline"
    imageSrc: string
  }) => (
    <div className="w-full rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-200 p-5">

      <div className="flex items-center justify-between gap-6">

        {/* Image + Text */}
        <div className="flex items-start gap-4 flex-1">
          
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
            <Image 
              src={imageSrc} 
              alt={title} 
              width={64} 
              height={64}
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-700">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>

        </div>

        {/* Button */}
        <Button 
          variant={variant === "outline" ? "outline" : "default"} 
          asChild
          className={`
            px-5 py-2 text-sm font-medium rounded-md
            transition-colors
            ${variant === "outline"
              ? "border-gray-300 text-gray-700 hover:bg-[#2ecc71] hover:text-white hover:border-[#2ecc71]"
              : "bg-green-600 hover:bg-green-700 text-white"}
          `}
        >
          <Link href={href}>{btnText}</Link>
        </Button>

      </div>
    </div>
  )

  // When template selected → show builder only
  if (selectedTemplate) {
    return <ResumeBuilder template={selectedTemplate} onBack={() => setSelectedTemplate(null)} />
  }

  return (
    <>
      {/* Full-width template gallery (contains hero) */}
      <TemplateGallery onSelectTemplate={setSelectedTemplate} />

      {/* Feature card container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">

        <section className="mt-6 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* --- AI INTERVIEW CARD --- */}
            <FeatureCard
              title="AI Interview Simulator"
              description="Practice dynamic AI-generated interview questions with voice/mic support."
              btnText="Start Interview"
              href="/ai-interview"
              imageSrc="/images/Ai_interview.png"   // <-- Put image inside public/images/
            />

            {/* --- ATS CARD --- */}
            <FeatureCard
              title="ATS Resume Score"
              description="Upload your resume and get instant ATS scoring & improvement suggestions."
              btnText="Check Score"
              href="/ats"
              
              imageSrc="/images/ats_check.png"       // <-- Put image inside public/images/
            />

          </div>

        </section>
      </div>
    </>
  )
}
