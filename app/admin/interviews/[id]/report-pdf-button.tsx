"use client"

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { downloadInterviewReportPdf, type CombinedReport } from '@/lib/interview-report-pdf'
import { useToast } from '@/components/toast'

function safeParseJson<T>(value: unknown): T | null {
  if (!value || typeof value !== 'string') return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export default function ReportPdfButton(props: {
  interviewId: string
  reportContent?: string | null
  reportFileUrl?: string | null
  filename?: string
}) {
  const { addToast } = useToast()

  const parsed = useMemo(() => safeParseJson<CombinedReport>(props.reportContent), [props.reportContent])

  const onDownload = async () => {
    try {
      let reportObj: CombinedReport | null = parsed

      if (!reportObj && props.reportFileUrl) {
        const res = await fetch(props.reportFileUrl)
        reportObj = (await res.json()) as CombinedReport
      }

      if (!reportObj?.interview) {
        addToast('Report not available', 'error')
        return
      }

      await downloadInterviewReportPdf(reportObj, props.filename || `ai-interview-report-${props.interviewId}.pdf`)
      addToast('PDF downloaded', 'success')
    } catch (e: any) {
      console.error('Admin PDF export failed', e)
      addToast(e?.message || 'Failed to generate PDF', 'error')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={onDownload}>
      Download PDF
    </Button>
  )
}
