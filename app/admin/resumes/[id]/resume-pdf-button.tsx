"use client"

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import ResumePreview from '@/components/resume-preview'
import { cleanHtmlForPDF } from '@/lib/style-converter'
import type { ResumeData } from '@/lib/types'
import { useToast } from '@/components/toast'

type StoredTemplateResume = {
  template?: string
  resumeData?: ResumeData
  versionLabel?: string
}

function safeParseJson<T>(value: unknown): T | null {
  if (!value || typeof value !== 'string') return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export default function ResumePdfButton(props: {
  storedVersionData: string
  filename?: string
}) {
  const { addToast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const stored = useMemo(() => safeParseJson<StoredTemplateResume>(props.storedVersionData), [props.storedVersionData])
  const template = stored?.template || 'template'
  const resumeData = stored?.resumeData

  const downloadPdf = async () => {
    if (!resumeData) {
      addToast('Resume data not available for PDF export', 'error')
      return
    }

    setIsExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).jsPDF

      if (!previewRef.current) throw new Error('Preview not ready')

      const cleanElement = cleanHtmlForPDF(previewRef.current)
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'fixed'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '-9999px'
      tempContainer.style.width = '800px'
      tempContainer.appendChild(cleanElement)
      document.body.appendChild(tempContainer)

      try {
        const canvas = await html2canvas(cleanElement, {
          useCORS: true,
          logging: false,
          scale: 2,
          backgroundColor: '#ffffff',
          allowTaint: true,
          imageTimeout: 0,
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = pdfWidth - 10
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        let heightLeft = imgHeight
        let position = 5

        pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight - 10

        while (heightLeft > 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight)
          heightLeft -= pdfHeight - 10
        }

        const blob = pdf.output('blob') as Blob
        const url = URL.createObjectURL(blob)
        try {
          const a = document.createElement('a')
          a.href = url
          a.download = props.filename || `${resumeData.fullName || 'Resume'}-Resume.pdf`
          document.body.appendChild(a)
          a.click()
          a.remove()
        } finally {
          URL.revokeObjectURL(url)
        }

        addToast('PDF downloaded', 'success')
      } finally {
        document.body.removeChild(tempContainer)
      }
    } catch (e: any) {
      console.error('Admin resume PDF export failed', e)
      addToast(e?.message || 'Failed to generate PDF', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={downloadPdf} disabled={isExporting}>
        {isExporting ? 'Exporting…' : 'Download PDF'}
      </Button>

      {/* Offscreen render for PDF capture */}
      <div style={{ position: 'fixed', left: -9999, top: -9999, width: 800 }} aria-hidden>
        <div ref={previewRef} className="bg-white p-6">
          <ResumePreview data={resumeData as any} template={template} />
        </div>
      </div>
    </>
  )
}
