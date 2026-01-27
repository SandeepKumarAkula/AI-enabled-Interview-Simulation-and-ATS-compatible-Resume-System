"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchWithAuth } from "@/lib/clientAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/components/toast"
import { useConfirm } from "@/components/confirm"

export default function AtsHistoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()
  const confirm = useConfirm()

  const refresh = async () => {
    const res = await fetchWithAuth("/api/ats")
    if (res.ok) {
      const json = await res.json().catch(() => ({}))
      setItems(json.items || [])
    }
  }

  const deleteItem = async (id: string) => {
    const ok = await confirm({
      title: 'Delete ATS report?',
      description: 'This will remove the report from your ATS history.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    if (!ok) return
    const res = await fetchWithAuth(`/api/ats/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      addToast(json.error || 'Delete failed', 'error')
      return
    }
    await refresh()
    addToast('Deleted from ATS history', 'success')
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
              ATS History
            </h1>
            <p className="text-gray-600 mt-1">Your saved ATS scores and reports</p>
          </div>
          <Link href="/ats">
            <Button>New ATS Analysis</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
            <p className="text-gray-600 mt-2">Loading ATS history...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No saved ATS analyses yet</p>
              <p className="text-sm text-gray-500 mt-1">Run an ATS analysis and click “Save Result”.</p>
              <Link href="/ats">
                <Button className="mt-4">Go to ATS</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((it) => (
              <Card key={it.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span className="text-lg font-semibold">Score: {it.score} / 100</span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(it.createdAt).toLocaleString()}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {it.resume?.title ? `Resume: ${it.resume.title}` : "(Not linked to a saved resume)"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <Button variant="outline" size="sm" onClick={() => deleteItem(it.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                  <details className="bg-white rounded-md border p-4">
                    <summary className="cursor-pointer font-medium">View raw report JSON</summary>
                    <pre className="mt-3 text-xs whitespace-pre-wrap break-words text-gray-700">
                      {it.analysis}
                    </pre>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
