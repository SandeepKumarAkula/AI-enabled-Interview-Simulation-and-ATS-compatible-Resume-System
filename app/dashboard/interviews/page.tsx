"use client"
import { useEffect, useState } from 'react'
import { fetchWithAuth } from '@/lib/clientAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Video, FileText, Calendar, PlayCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/toast'
import { useConfirm } from '@/components/confirm'

export default function InterviewsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()
  const confirm = useConfirm()

  const refresh = async () => {
    const res = await fetchWithAuth('/api/interviews')
    if (res.ok) setItems(await res.json().then(r => r.interviews || []))
  }


  const deleteInterview = async (id: string) => {
    const ok = await confirm({
      title: 'Delete interview?',
      description: 'This will remove the interview from your dashboard history.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    if (!ok) return
    const res = await fetchWithAuth(`/api/interviews/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      addToast(json.error || 'Delete failed', 'error')
      return
    }
    await refresh()
    addToast('Interview deleted', 'success')
  }

  useEffect(() => {
    ;(async () => {
      await refresh()
      setLoading(false)
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              My Interviews
            </h1>
            <p className="text-gray-600 mt-1">Review your interview sessions and reports</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Interviews ({items.length})</h2>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
              <p className="text-gray-600 mt-2">Loading interviews...</p>
            </div>
          ) : items.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="py-12 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No interviews yet</p>
                <p className="text-sm text-gray-500 mt-1">Start your first AI interview to see it here</p>
                <Link href="/ai-interview">
                  <Button className="mt-4 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {items.map((interview) => (
                <Card key={interview.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-emerald-600" />
                      {interview.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(interview.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {interview.video?.url && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <PlayCircle className="w-4 h-4" />
                          Interview Recording
                        </h3>
                        <video
                          src={interview.video.url}
                          controls
                          preload="none"
                          playsInline
                          className="w-full max-w-2xl rounded-lg shadow-md"
                        />
                      </div>
                    )}
                    {(interview.report?.fileUrl || interview.report?.content) && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Performance Report
                        </h3>
                        <Link href={`/dashboard/interviews/${interview.id}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                        </Link>
                      </div>
                    )}

                    <div>
                      <Button variant="destructive" size="sm" onClick={() => deleteInterview(interview.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
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
