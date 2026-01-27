import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getUserFromToken, requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import ResumePdfButton from './resume-pdf-button'

export default async function AdminResumePage(props: { params: Promise<{ id: string }> }) {
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

  const resume = await prisma.resume.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      versions: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!resume) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-600 font-semibold">Resume not found</div>
          <Link href="/admin" className="text-emerald-600 hover:underline">Back to Admin</Link>
        </div>
      </div>
    )
  }

  const latestTemplateVersion = resume.versions.find((v) => !!v.data) || null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Resume</h1>
            <div className="text-sm text-gray-600">
              Owner: {resume.user?.email}{resume.user?.name ? ` (${resume.user.name})` : ''}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {latestTemplateVersion?.data ? (
              <ResumePdfButton
                storedVersionData={latestTemplateVersion.data}
                filename={`resume-${resume.id}-latest.pdf`}
              />
            ) : null}
            <Link href="/admin" className="text-sm text-emerald-700 hover:underline">Back</Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow p-4 space-y-2">
          <div className="text-sm text-gray-600">Title</div>
          <div className="text-lg font-semibold">{resume.title || 'Untitled resume'}</div>
          {resume.description ? (
            <>
              <div className="text-sm text-gray-600 mt-2">Description</div>
              <div className="text-sm text-gray-800">{resume.description}</div>
            </>
          ) : null}
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="font-semibold">Versions ({resume.versions.length})</div>
          <div className="mt-3 space-y-3">
            {resume.versions.map((v) => (
              <details key={v.id} className="border rounded-md">
                <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium">
                  {new Date(v.createdAt).toLocaleString()} • {v.data ? 'Template resume' : v.fileUrl ? 'File upload' : 'Unknown'}
                </summary>
                <div className="px-3 pb-3 pt-2 space-y-2">
                  {v.fileUrl ? (
                    <div className="text-sm">
                      File URL: <a className="text-emerald-700 hover:underline" href={v.fileUrl} target="_blank" rel="noreferrer">Open</a>
                    </div>
                  ) : null}

                  {v.data ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <ResumePdfButton
                        storedVersionData={v.data}
                        filename={`resume-${resume.id}-${v.id}.pdf`}
                      />
                      <span className="text-xs text-gray-600">(Exports the saved template resume)</span>
                    </div>
                  ) : null}

                  {v.data ? (
                    <details className="border rounded-md">
                      <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium text-gray-700">
                        View raw JSON
                      </summary>
                      <div className="px-3 pb-3 pt-2">
                        <pre className="text-xs bg-slate-50 border rounded p-3 overflow-auto max-h-[420px]">{v.data}</pre>
                      </div>
                    </details>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
