"use client"

import { useEffect, useState } from 'react'
import { fetchWithAuth } from '@/lib/clientAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Users, Shield, FileJson, FileSpreadsheet, Video, FileText, Key, Info } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/toast'
import { useConfirm } from '@/components/confirm'
import { downloadInterviewReportPdf, type CombinedReport } from '@/lib/interview-report-pdf'

function safeParseJson<T>(value: unknown): T | null {
  if (!value || typeof value !== 'string') return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export default function AdminClientPage() {
  const [users, setUsers] = useState<any[]>([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()
  const confirm = useConfirm()
  const [meId, setMeId] = useState<string | null>(null)

  const refresh = async () => {
    const res = await fetchWithAuth('/api/admin/users')
    if (res.ok) {
      const json = await res.json().catch(() => ({}))
      setUsers(json.users || [])
      if (json?.me?.id) setMeId(String(json.me.id))
      setErr('')
    } else {
      if (res.status === 401) {
        setErr('401 Unauthorized: You are not logged in as an admin (ADMIN role). Log in with the seeded admin account.')
      } else {
        setErr(`Failed to load admin data (HTTP ${res.status})`)
      }
    }
  }

  useEffect(() => {
    ;(async () => {
      await refresh()
      setLoading(false)
    })()
  }, [])

  const deleteUser = async (user: any) => {
    const ok = await confirm({
      title: 'Delete user account?',
      description: `This will permanently delete ${user.email} and all their resumes, interviews, videos, and reports.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    if (!ok) return

    const res = await fetchWithAuth(`/api/admin/users/${user.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      addToast(json.error || 'Delete failed', 'error')
      return
    }
    addToast('User deleted', 'success')
    await refresh()
  }

  const fmtDate = (value: any) => {
    try {
      return new Date(value).toLocaleString()
    } catch {
      return ''
    }
  }

  const downloadInterviewPdf = async (it: any) => {
    try {
      let reportObj: CombinedReport | null = safeParseJson<CombinedReport>(it?.report?.content)
      if (!reportObj && it?.report?.fileUrl) {
        const r = await fetch(it.report.fileUrl)
        reportObj = (await r.json()) as CombinedReport
      }
      if (!reportObj?.interview) {
        addToast('Report not available', 'error')
        return
      }
      await downloadInterviewReportPdf(reportObj, `ai-interview-report-${it.id}.pdf`)
      addToast('PDF downloaded', 'success')
    } catch (e: any) {
      console.error('Admin PDF export failed', e)
      addToast(e?.message || 'Failed to generate PDF', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-emerald-600" />
              <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-600 mt-1">Manage users and view platform analytics</p>
          </div>
        </div>

        {/* Admin Info Card */}
        <Card className="shadow-lg border-emerald-200 bg-gradient-to-r from-emerald-50 to-sky-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Key className="w-5 h-5" />
              Admin Access
            </CardTitle>
            <CardDescription>
              Admin account is configured via environment variables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700 space-y-1">
                <p>
                  Set <span className="font-mono">ADMIN_EMAIL</span> and <span className="font-mono">ADMIN_PASSWORD</span> in your <span className="font-mono">.env</span>, then run the seed script.
                </p>
                <p>
                  For security, the password is never displayed in the UI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {err && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{err}</p>
            </CardContent>
          </Card>
        )}

        {/* Export Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-emerald-600" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download user data in various formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <a href="/api/admin/export/users" target="_blank" rel="noreferrer">
                <Button variant="outline" className="hover:bg-emerald-50">
                  <FileJson className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </a>
              <a href="/api/admin/export/users/csv" target="_blank" rel="noreferrer">
                <Button variant="outline" className="hover:bg-emerald-50">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              All Users ({users.length})
            </CardTitle>
            <CardDescription>
              View registered users and their activity counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
                <p className="text-gray-600 mt-2">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{user.email}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        {user.name && (
                          <p className="text-sm text-gray-600 mt-1">{user.name}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>{user.resumes?.length || 0} Resume{user.resumes?.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Video className="w-4 h-4" />
                            <span>{user.interviews?.length || 0} Interview{user.interviews?.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <details className="rounded-md border bg-white">
                            <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-gray-800">
                              View resumes ({user.resumes?.length || 0})
                            </summary>
                            <div className="px-3 pb-3 pt-1 space-y-2">
                              {(user.resumes || []).length === 0 ? (
                                <div className="text-sm text-gray-600">No resumes</div>
                              ) : (
                                <div className="space-y-2">
                                  {(user.resumes || []).map((r: any) => (
                                    <div key={r.id} className="flex items-center justify-between gap-3 border rounded p-2">
                                      <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{r.title || 'Untitled resume'}</div>
                                        <div className="text-xs text-gray-600">Versions: {r.versions?.length || 0} • Created: {fmtDate(r.createdAt)}</div>
                                      </div>
                                      <Link href={`/admin/resumes/${r.id}`}>
                                        <Button variant="outline" size="sm">Open</Button>
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </details>

                          <details className="rounded-md border bg-white">
                            <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-gray-800">
                              View interviews ({user.interviews?.length || 0})
                            </summary>
                            <div className="px-3 pb-3 pt-1 space-y-2">
                              {(user.interviews || []).length === 0 ? (
                                <div className="text-sm text-gray-600">No interviews</div>
                              ) : (
                                <div className="space-y-2">
                                  {(user.interviews || []).map((it: any) => (
                                    <div key={it.id} className="flex items-center justify-between gap-3 border rounded p-2">
                                      <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{it.title || 'Interview'}</div>
                                        <div className="text-xs text-gray-600">
                                          {fmtDate(it.createdAt)}
                                          {it.report?.content || it.report?.fileUrl ? ' • Report: yes' : ' • Report: no'}
                                          {it.video?.s3Key || it.video?.url ? ' • Video: yes' : ' • Video: no'}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {it.report?.content || it.report?.fileUrl ? (
                                          <Button variant="outline" size="sm" onClick={() => downloadInterviewPdf(it)}>
                                            PDF
                                          </Button>
                                        ) : null}
                                        <Link href={`/admin/interviews/${it.id}`}>
                                          <Button variant="outline" size="sm">Open</Button>
                                        </Link>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(user)}
                          disabled={meId !== null && user.id === meId}
                          title={meId !== null && user.id === meId ? 'You cannot delete yourself' : undefined}
                        >
                          Delete user
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
