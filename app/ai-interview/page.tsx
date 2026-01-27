import AIInterviewerHydrationSafe from "@/components/ai-interviewer-hydration-safe"
import ProtectedRoute from "@/components/protected-route"

export const metadata = {
  title: "AI Interviewer | AI²SARS",
  description: "Live AI-powered interview simulation with adaptive questions, coding pad, and video-aware feedback.",
}

export default function AIInterviewPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <AIInterviewerHydrationSafe />
      </main>
    </ProtectedRoute>
  )
}
