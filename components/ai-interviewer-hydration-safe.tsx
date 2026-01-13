"use client"

import { useEffect, useState } from "react"
import { AIInterviewer } from "@/components/ai-interviewer"

export default function AIInterviewerHydrationSafe() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return <AIInterviewer />
}
