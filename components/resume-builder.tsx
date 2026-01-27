"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ResumeDraftForm from "@/components/resume-draft-form"
import ResumePreview from "@/components/resume-preview"
import LatexEditor from "@/components/latex-editor"
import { ChevronLeft, Download, Loader2, FileJson, Code, Save } from "lucide-react"
import type { ResumeData } from "@/lib/types"
import { cleanHtmlForPDF } from "@/lib/style-converter"
import { DEFAULT_RESUME_DATA } from "@/lib/default-resume-data"
import { fetchWithAuth } from "@/lib/clientAuth"
import { useToast } from "@/components/toast"

interface ResumeBuilderProps {
  template: string
  onBack: () => void
  resumeId?: string
  initialResumeData?: ResumeData
}

export default function ResumeBuilder({ template, onBack, resumeId, initialResumeData }: ResumeBuilderProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const { addToast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedResumeId, setSavedResumeId] = useState<string | null>(resumeId || null)
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData || DEFAULT_RESUME_DATA)
  const [editorMode, setEditorMode] = useState<"form" | "latex">("form")
  const [versionLabel, setVersionLabel] = useState<string>("")

  const generatePdfBlob = async (): Promise<Blob> => {
    if (!previewRef.current) throw new Error("Preview not ready")

    const html2canvas = (await import("html2canvas")).default
    const jsPDF = (await import("jspdf")).jsPDF

    const cleanElement = cleanHtmlForPDF(previewRef.current)
    const tempContainer = document.createElement("div")
    tempContainer.style.position = "fixed"
    tempContainer.style.left = "-9999px"
    tempContainer.style.top = "-9999px"
    tempContainer.style.width = "800px"
    tempContainer.appendChild(cleanElement)
    document.body.appendChild(tempContainer)

    try {
      const canvas = await html2canvas(cleanElement, {
        useCORS: true,
        logging: false,
        scale: 2,
        backgroundColor: "#ffffff",
        allowTaint: true,
        imageTimeout: 0,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth - 10
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 5

      pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight - 10

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight - 10
      }

      return pdf.output("blob") as Blob
    } finally {
      document.body.removeChild(tempContainer)
    }
  }

  const handleSaveToDashboard = async () => {
    setIsSaving(true)
    try {
      if (!resumeData.fullName) throw new Error("Please enter your name before saving")

      const title = `${resumeData.fullName} - ${template}`
      const effectiveLabel = versionLabel?.trim() || (savedResumeId ? "Update" : "Initial")
      const data = JSON.stringify({ template, resumeData, versionLabel: effectiveLabel })

      // DB-only save (no upload). Template resumes are stored as JSON in resume history.
      if (savedResumeId) {
        // Keep the parent resume title up-to-date for edited resumes.
        try {
          await fetchWithAuth(`/api/resumes/${savedResumeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
          })
        } catch {
          // Non-blocking: version save is the critical path.
        }

        const res = await fetchWithAuth(`/api/resumes/${savedResumeId}/versions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json.error || "Failed to save a new version")
        setVersionLabel("")
        addToast("Saved as a new resume version", "success")
      } else {
        const res = await fetchWithAuth("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, data }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json.error || "Failed to save")
        if (json.resumeId) setSavedResumeId(json.resumeId)
        setVersionLabel("")
        addToast("Saved to your resume history", "success")
      }
    } catch (e: any) {
      addToast(e?.message || "Failed to save", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resumeData.fullName) {
      addToast("Please enter your name before downloading", "error")
      return
    }

    setIsExporting(true)
    try {
      const blob = await generatePdfBlob()
      const url = URL.createObjectURL(blob)
      try {
        const a = document.createElement("a")
        a.href = url
        a.download = `${resumeData.fullName}-Resume.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      } finally {
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      addToast("Failed to generate PDF. Please try again.", "error")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page toolbar (non-sticky) — global Header in layout.tsx is the site header */}
      <div className="border-b border-[#e0e0e0] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[#2ecc71] hover:text-[#27ae60] transition-colors font-medium"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <h1 className="text-lg font-semibold text-[#222222]">Resume Builder</h1>

            <div className="flex gap-2 mx-auto">
              <button
                onClick={() => setEditorMode("form")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  editorMode === "form" ? "bg-[#2ecc71] text-white" : "bg-[#f0f0f0] text-[#222222] hover:bg-[#e0e0e0]"
                }`}
              >
                <FileJson className="h-4 w-4" />
                Form
              </button>
              <button
                onClick={() => setEditorMode("latex")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  editorMode === "latex" ? "bg-[#2ecc71] text-white" : "bg-[#f0f0f0] text-[#222222] hover:bg-[#e0e0e0]"
                }`}
              >
                <Code className="h-4 w-4" />
                LaTeX
              </button>
            </div>

            <Button
              onClick={handleSaveToDashboard}
              disabled={isSaving}
              variant="outline"
              className="font-medium"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </Button>

            <div className="w-full sm:w-[220px]">
              <Input
                value={versionLabel}
                onChange={(e) => setVersionLabel(e.target.value)}
                placeholder="Version name (optional)"
                className="h-9"
              />
            </div>

            <Button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-medium ml-auto"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Download PDF</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Editor Panel - Responsive Height */}
          <div className="bg-[#f7f7f7] rounded-lg border border-[#e0e0e0] p-6 flex flex-col">
            {editorMode === "form" ? (
              <ResumeDraftForm data={resumeData} onChange={setResumeData} />
            ) : (
              <LatexEditor data={resumeData} onChange={setResumeData} />
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
            <div ref={previewRef} className="p-6">
              <ResumePreview data={resumeData} template={template} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
