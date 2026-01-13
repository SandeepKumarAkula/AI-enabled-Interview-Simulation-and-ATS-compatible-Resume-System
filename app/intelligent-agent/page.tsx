"use client"

import { IntelligentAgentTrainer } from "@/components/intelligent-agent-trainer"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function IntelligentAgentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="border-b border-purple-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Intelligent AI Agent
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Real machine learning agent with neural networks and reinforcement learning capabilities.
            Train the agent on your hiring decisions to improve its decision-making over time.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <IntelligentAgentTrainer />
      </main>
    </div>
  )
}
