"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { fetchWithAuth } from "@/lib/clientAuth"
import { downloadInterviewReportPdf, type CombinedReport } from "@/lib/interview-report-pdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, FileText, Video, Calendar } from "lucide-react"
import { useToast } from "@/components/toast"

function safeParseJson<T>(value: unknown): T | null {
  if (!value || typeof value !== "string") return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export default function InterviewReportPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const { addToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [interview, setInterview] = useState<any | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetchWithAuth(`/api/interviews/${id}`)
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json.error || "Failed to load interview")
        setInterview(json.interview)
      } catch (e: any) {
        setError(e?.message || "Failed to load")
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const report: CombinedReport | null = useMemo(() => {
    const raw = interview?.report?.content
    return safeParseJson<CombinedReport>(raw)
  }, [interview])

  const createdAt = interview?.createdAt ? new Date(interview.createdAt).toLocaleString() : ""
  const title = interview?.title || "Interview"

  const downloadPdf = async () => {
    try {
      // Prefer DB content; fall back to fetching from fileUrl (older records)
      let reportObj: CombinedReport | null = report
      if (!reportObj && interview?.report?.fileUrl) {
        const r = await fetch(interview.report.fileUrl)
        reportObj = (await r.json()) as CombinedReport
      }
      if (!reportObj?.interview) {
        addToast('Report not available', 'error')
        return
      }

      await downloadInterviewReportPdf(reportObj, `ai-interview-report-${id}.pdf`)
    } catch (e: any) {
      console.error('PDF export failed', e)
      addToast(e?.message || 'Failed to generate PDF', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/interviews">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {createdAt}
              </div>
            </div>
          </div>
          {interview?.video?.url && (
            <a href={interview.video.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4 mr-2" />
                Recording
              </Button>
            </a>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
            <p className="text-gray-600 mt-2">Loading report...</p>
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle>Report not available</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/dashboard/interviews">
                <Button variant="outline">Back to Interviews</Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Performance Report
              </CardTitle>
              <CardDescription>
                This is the exact saved report from the completed interview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {interview?.video?.url && (
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Recording
                  </div>
                  <video
                    src={interview.video.url}
                    controls
                    preload="none"
                    playsInline
                    className="w-full rounded-lg border bg-black"
                  />
                </div>
              )}
              {report?.interview ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                      <div className="text-xs text-gray-600">Readiness</div>
                      <div className="text-2xl font-bold text-emerald-700">{report.interview.interviewReadinessScore ?? 0}%</div>
                    </div>
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded">
                      <div className="text-xs text-gray-600">Suitability</div>
                      <div className="text-2xl font-bold text-sky-700">{report.interview.roleSuitabilityScore ?? 0}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-emerald-700 mb-2">Strengths</h3>
                      <ul className="space-y-1">
                        {(report.interview.strengths || []).map((s, i) => (
                          <li key={i} className="text-sm text-gray-700">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-orange-700 mb-2">Improvements</h3>
                      <ul className="space-y-1">
                        {(report.interview.improvements || []).map((s, i) => (
                          <li key={i} className="text-sm text-gray-700">• {s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {(report.interview.askedTopics || []).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800 mb-2">Topics Covered</h3>
                      <div className="text-sm text-gray-700">{(report.interview.askedTopics || []).join(", ")}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-600">Report saved, but could not be parsed for display.</div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={downloadPdf}>
                <FileText className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
