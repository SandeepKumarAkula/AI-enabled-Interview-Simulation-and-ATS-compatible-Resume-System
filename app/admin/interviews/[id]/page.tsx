import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getUserFromToken, requireAdmin } from '@/lib/auth'
import { getPresignedDownloadUrl } from '@/lib/s3'
import ReportPdfButton from './report-pdf-button'

export default async function AdminInterviewPage(props: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get('token')?.value
  const user = await getUserFromToken(token)
  if (!user) redirect('/auth/login')
  try {
    requireAdmin(user)
  } catch {
    redirect('/dashboard/resumes')
  }

  const { id } = await props.params
  if (!id) redirect('/admin')

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      video: true,
      report: true,
    },
  })

  if (!interview) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-600 font-semibold">Interview not found</div>
          <Link href="/admin" className="text-emerald-600 hover:underline">Back to Admin</Link>
        </div>
      </div>
    )
  }

  let signedVideoUrl: string | null = null
  if (interview.video?.s3Key) {
    try {
      signedVideoUrl = await getPresignedDownloadUrl(interview.video.s3Key, 60 * 10)
    } catch {
      signedVideoUrl = interview.video?.url || null
    }
  } else {
    signedVideoUrl = interview.video?.url || null
  }

  const hasReport = !!(interview.report?.content || interview.report?.fileUrl)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Interview</h1>
            <div className="text-sm text-gray-600">
              Owner: {interview.user?.email}{interview.user?.name ? ` (${interview.user.name})` : ''}
            </div>
            <div className="text-sm text-gray-600">{new Date(interview.createdAt).toLocaleString()}</div>
          </div>
          <Link href="/admin" className="text-sm text-emerald-700 hover:underline">Back</Link>
        </div>

        <div className="bg-white rounded-lg border shadow p-4 space-y-2">
          <div className="text-sm text-gray-600">Title</div>
          <div className="text-lg font-semibold">{interview.title || 'Interview'}</div>
        </div>

        <div className="bg-white rounded-lg border shadow p-4 space-y-3">
          <div className="font-semibold">Recording</div>
          {signedVideoUrl ? (
            <video src={signedVideoUrl} controls preload="none" playsInline className="w-full rounded-lg border" />
          ) : (
            <div className="text-sm text-gray-600">No recording attached</div>
          )}
        </div>

        <div className="bg-white rounded-lg border shadow p-4 space-y-3">
          <div className="font-semibold">Report</div>
          {hasReport ? (
            <div className="flex flex-wrap items-center gap-3">
              <ReportPdfButton
                interviewId={interview.id}
                reportContent={interview.report?.content}
                reportFileUrl={interview.report?.fileUrl}
              />
              {interview.report?.fileUrl ? (
                <a href={interview.report.fileUrl} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                  Open raw report JSON
                </a>
              ) : null}
              <span className="text-xs text-gray-600">(Admin downloads report as PDF)</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">No report saved</div>
          )}

          {interview.report?.content ? (
            <details className="border rounded-md">
              <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium">View report JSON</summary>
              <div className="px-3 pb-3 pt-2">
                <pre className="text-xs bg-slate-50 border rounded p-3 overflow-auto max-h-[420px]">{interview.report.content}</pre>
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </div>
  )
}
