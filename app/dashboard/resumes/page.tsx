"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchWithAuth } from '@/lib/clientAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Calendar, Trash2, Pencil } from 'lucide-react'
import { useToast } from '@/components/toast'
import { useConfirm } from '@/components/confirm'

function getVersionLabel(version: any, idx: number) {
  const fallback = `Version ${idx + 1}`

  // Back-compat if something still returns a label field
  if (typeof version?.label === 'string' && version.label.trim()) return version.label.trim()

  // Preferred: store versionLabel inside the JSON saved in ResumeVersion.data
  if (typeof version?.data === 'string' && version.data.trim()) {
    try {
      const parsed = JSON.parse(version.data)
      const label = typeof parsed?.versionLabel === 'string' ? parsed.versionLabel.trim() : ''
      if (label) return label
    } catch {
      // ignore malformed JSON
    }
  }

  return fallback
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const { addToast } = useToast()
  const confirm = useConfirm()

  useEffect(() => {
    ;(async () => {
      const res = await fetchWithAuth('/api/resumes')
      if (res.ok) setResumes(await res.json().then(r => r.resumes || []))
    })()
  }, [])

  const refresh = async () => {
    const res = await fetchWithAuth('/api/resumes')
    if (res.ok) {
      setResumes(await res.json().then(r => r.resumes || []))
    } else {
      addToast('Failed to refresh resumes', 'error')
    }
  }

  const deleteResume = async (resumeId: string) => {
    const ok = await confirm({
      title: 'Delete resume?',
      description: 'This will delete this resume and all saved versions.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    if (!ok) return
    const res = await fetchWithAuth(`/api/resumes/${resumeId}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      addToast(json.error || 'Delete failed', 'error')
      return
    }
    await refresh()
    addToast('Resume deleted', 'success')
  }

  const deleteVersion = async (resumeId: string, versionId: string) => {
    const ok = await confirm({
      title: 'Delete version?',
      description: 'This will delete only this version from your history.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    if (!ok) return
    const res = await fetchWithAuth(`/api/resumes/${resumeId}/versions/${versionId}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      addToast(json.error || 'Delete failed', 'error')
      return
    }
    await refresh()
    addToast('Version deleted', 'success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              My Resumes
            </h1>
            <p className="text-gray-600 mt-1">Create resumes from templates and save versions (no uploads)</p>
          </div>
        </div>

        {/* Templates CTA */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Create a Resume from Templates
            </CardTitle>
            <CardDescription>
              Open a template, fill your details, and click Save — it will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 items-center justify-between">
            <div className="text-sm text-gray-600">
              Tip: Use Edit to update and create new versions.
            </div>
            <Link href="/#templates">
              <Button className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700">
                Browse Templates
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Resumes List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Resumes ({resumes.length})</h2>
          {resumes.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No saved resumes yet</p>
                <p className="text-sm text-gray-500 mt-1">Create one from Templates and click Save</p>
                <div className="mt-4">
                  <Link href="/#templates">
                    <Button variant="outline">Browse Templates</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {resumes.map((resume) => (
                <Card key={resume.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{resume.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                              {resume.versions?.length || 0} version{resume.versions?.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {resume.versions?.length > 0 && (
                            <div className="mt-3 space-y-1">
                              {resume.versions.map((v: any, idx: number) => (
                                <div key={v.id} className="text-sm text-gray-600 flex items-center justify-between gap-3">
                                  <div>
                                  {v.fileUrl ? (
                                    <a
                                      href={v.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-600 hover:underline"
                                    >
                                      {getVersionLabel(v, idx)}
                                    </a>
                                  ) : v.data ? (
                                    <span className="text-emerald-700">{getVersionLabel(v, idx)} (template)</span>
                                  ) : (
                                    <span>{getVersionLabel(v, idx)}</span>
                                  )}
                                  {' '}— {new Date(v.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Link href={`/dashboard/resumes/${resume.id}/versions/${v.id}/edit`}>
                                      <Button type="button" size="icon" variant="outline" title="Edit this version">
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                    </Link>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="destructive"
                                      onClick={() => deleteVersion(resume.id, v.id)}
                                      title="Delete version"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/resumes/${resume.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit / Update
                          </Button>
                        </Link>

                        {resume.versions?.[0]?.fileUrl ? (
                          <a href={resume.versions[0].fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </a>
                        ) : null}

                        <Button variant="destructive" size="sm" onClick={() => deleteResume(resume.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
