"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchWithAuth } from "@/lib/clientAuth"
import ResumeBuilder from "@/components/resume-builder"
import type { ResumeData } from "@/lib/types"

function safeParseJson<T>(value: unknown): T | null {
  if (!value || typeof value !== "string") return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

type StoredTemplateResume = {
  template?: string
  resumeData?: ResumeData
}

export default function EditResumeVersionPage() {
  const params = useParams<{ id: string; versionId: string }>()
  const id = params?.id
  const versionId = params?.versionId
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resume, setResume] = useState<any | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetchWithAuth(`/api/resumes/${id}`)
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json.error || "Failed to load resume")
        setResume(json.resume)
      } catch (e: any) {
        setError(e?.message || "Failed to load")
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const version = useMemo(() => {
    const versions: any[] = resume?.versions || []
    return versions.find((v) => v.id === versionId) || null
  }, [resume, versionId])

  const stored: StoredTemplateResume | null = useMemo(() => {
    return safeParseJson<StoredTemplateResume>(version?.data)
  }, [version])

  const template = stored?.template || "template"
  const initialResumeData = stored?.resumeData

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto text-gray-600">Loading version editor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-red-600 font-semibold">{error}</div>
          <button
            className="mt-3 text-emerald-600 hover:underline"
            onClick={() => router.push("/dashboard/resumes")}
          >
            Back to My Resumes
          </button>
        </div>
      </div>
    )
  }

  if (!version) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-gray-900 font-semibold">Version not found.</div>
          <button
            className="mt-3 text-emerald-600 hover:underline"
            onClick={() => router.push("/dashboard/resumes")}
          >
            Back to My Resumes
          </button>
        </div>
      </div>
    )
  }

  if (!version.data) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-gray-900 font-semibold">This version is not editable as a template.</div>
          <div className="text-gray-600 mt-2">Only template-created versions (saved as JSON) can be edited.</div>
          <button
            className="mt-3 text-emerald-600 hover:underline"
            onClick={() => router.push("/dashboard/resumes")}
          >
            Back to My Resumes
          </button>
        </div>
      </div>
    )
  }

  return (
    <ResumeBuilder
      template={template}
      resumeId={id}
      initialResumeData={initialResumeData}
      onBack={() => router.push("/dashboard/resumes")}
    />
  )
}
