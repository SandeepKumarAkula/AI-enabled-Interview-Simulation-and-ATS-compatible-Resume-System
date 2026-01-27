"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, CheckCircle, TrendingUp, Brain, Zap, RefreshCw, Download, Upload } from "lucide-react"
import { useToast } from "@/components/toast"
import { useConfirm } from "@/components/confirm"

interface AgentState {
  version: string
  status: string
  totalResumesTrained: number
  averageUserRating: number
  agentAccuracy: number
  complianceMode: boolean
  lastUpdated: string
  performanceMetrics: {
    totalAnalyzed: number
    averageScore: number
    improvementTrend: string
    recommendedAction: string
  }
  scoringFactors: string[]
}

interface PatternInsight {
  pattern: string
  weight: number
  frequency: number
  successRate: number
}

export function ATSTrainingDashboard() {
  const { addToast } = useToast()
  const confirm = useConfirm()
  const [agentState, setAgentState] = useState<AgentState | null>(null)
  const [patterns, setPatterns] = useState<PatternInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "train" | "patterns" | "settings">("overview")
  
  // Training form state
  const [resumeId, setResumeId] = useState("")
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState("")
  const [training, setTraining] = useState(false)

  // Load agent state
  useEffect(() => {
    fetchAgentState()
  }, [])

  const fetchAgentState = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/train-agent?action=full")
      if (response.ok) {
        const data = await response.json()
        setAgentState(data.agentState)
        setPatterns(data.patternAnalysis || [])
      }
    } catch (error) {
      console.error("Failed to fetch agent state:", error)
      addToast("Failed to load agent state", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleTrainFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resumeId.trim()) {
      addToast("Please enter a resume ID", "error")
      return
    }

    if (rating < 1 || rating > 10) {
      addToast("Rating must be between 1 and 10", "error")
      return
    }

    try {
      setTraining(true)
      const response = await fetch("/api/train-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          rating: parseInt(String(rating)),
          feedback,
          action: "feedback"
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAgentState(data.agentState)
        addToast("Agent trained successfully!", "success")
        
        // Reset form
        setResumeId("")
        setRating(5)
        setFeedback("")
        
        // Refresh state
        await fetchAgentState()
      } else {
        const error = await response.json()
        addToast(error.error || "Training failed", "error")
      }
    } catch (error) {
      console.error("Training error:", error)
      addToast("Failed to train agent", "error")
    } finally {
      setTraining(false)
    }
  }

  const handleReset = async () => {
    const ok = await confirm({
      title: 'Reset ATS agent?',
      description: 'This will reset the agent to factory defaults. This cannot be undone.',
      confirmText: 'Reset',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    if (!ok) return

    try {
      const response = await fetch("/api/train-agent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" })
      })

      if (response.ok) {
        addToast("Agent reset successfully", "success")
        await fetchAgentState()
      } else {
        addToast("Failed to reset agent", "error")
      }
    } catch (error) {
      console.error("Reset error:", error)
      addToast("Failed to reset agent", "error")
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/train-agent?action=config")
      if (response.ok) {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data.config, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ats-agent-config-${Date.now()}.json`
        a.click()
        addToast("Configuration exported", "success")
      }
    } catch (error) {
      console.error("Export error:", error)
      addToast("Failed to export configuration", "error")
    }
  }

  if (!agentState) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Brain className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-gray-600">Loading ATS Agent...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="w-8 h-8" />
              ATS Agent Training Dashboard
            </h1>
            <p className="text-blue-100 mt-2">Enterprise-grade AI-powered resume analysis system</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{agentState.agentAccuracy}%</div>
            <p className="text-blue-100">Agent Accuracy</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(["overview", "train", "patterns", "settings"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-gray-600 text-sm font-medium">Resumes Trained</div>
              <div className="text-3xl font-bold mt-2">{agentState.totalResumesTrained}</div>
              <div className="text-xs text-gray-500 mt-1">Total analyzed</div>
            </Card>

            <Card className="p-4">
              <div className="text-gray-600 text-sm font-medium">Avg Rating</div>
              <div className="text-3xl font-bold mt-2">{agentState.averageUserRating.toFixed(1)}/10</div>
              <div className="text-xs text-gray-500 mt-1">User satisfaction</div>
            </Card>

            <Card className="p-4">
              <div className="text-gray-600 text-sm font-medium">Status</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-bold capitalize">{agentState.status}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Learning active</div>
            </Card>

            <Card className="p-4">
              <div className="text-gray-600 text-sm font-medium">Trend</div>
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold capitalize">{agentState.performanceMetrics.improvementTrend}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Performance trend</div>
            </Card>
          </div>

          {/* Recommendation Alert */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Recommendation</h3>
                <p className="text-blue-800 text-sm mt-1">{agentState.performanceMetrics.recommendedAction}</p>
              </div>
            </div>
          </Card>

          {/* Compliance Status */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Compliance & Standards
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>EEOC Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>ADA Accessible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Bias Detection Enabled</span>
              </div>
            </div>
          </Card>

          {/* Scoring Factors */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Scoring Factors ({agentState.scoringFactors.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {agentState.scoringFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Training Tab */}
      {activeTab === "train" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Training Form */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Train on Feedback</h3>
            <form onSubmit={handleTrainFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Resume ID</label>
                <Input
                  placeholder="e.g., resume-001, john-doe-2024"
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  disabled={training}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating: <span className="text-lg font-bold text-blue-600">{rating}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full"
                  disabled={training}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Feedback (Optional)</label>
                <Textarea
                  placeholder="Any comments about this resume analysis..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  disabled={training}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={training}
              >
                {training ? "Training..." : "Train Agent"}
              </Button>
            </form>
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Training Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Agent Accuracy</span>
                  <span className="font-semibold">{agentState.agentAccuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${agentState.agentAccuracy}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-3">Last Updated</div>
                <div className="text-gray-600 text-sm">
                  {agentState.lastUpdated 
                    ? new Date(agentState.lastUpdated).toLocaleString()
                    : "Never"
                  }
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">Agent Version</div>
                <div className="text-gray-600 text-sm font-mono">{agentState.version}</div>
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Learning Mode</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  agentState.status === "trained" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {agentState.status === "trained" ? "✓ Active" : "⚠ Initializing"}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === "patterns" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pattern Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Pattern</th>
                    <th className="text-right py-2 font-semibold">Weight</th>
                    <th className="text-right py-2 font-semibold">Frequency</th>
                    <th className="text-right py-2 font-semibold">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {patterns.map((p, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2">{p.pattern}</td>
                      <td className="text-right font-mono text-sm">{p.weight.toFixed(2)}</td>
                      <td className="text-right">{p.frequency}</td>
                      <td className="text-right">
                        <span className={`${
                          p.successRate > 0.7 ? "text-green-600" : 
                          p.successRate > 0.5 ? "text-yellow-600" : 
                          "text-red-600"
                        }`}>
                          {(p.successRate * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pattern Distribution Chart */}
          {patterns.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Weight Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={patterns.map(p => ({ name: p.pattern, value: p.weight }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.slice(0, 8)}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patterns.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 360 / patterns.length}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agent Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Agent Version</label>
                <div className="text-gray-600 font-mono text-sm mt-1">{agentState.version}</div>
              </div>

              <div>
                <label className="text-sm font-medium">Compliance Mode</label>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  agentState.complianceMode 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {agentState.complianceMode ? "✓ Enabled" : "✗ Disabled"}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Total Training Samples</label>
                <div className="text-gray-600 text-sm mt-1">{agentState.totalResumesTrained} resumes</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-yellow-200 bg-yellow-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-900">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-yellow-800 text-sm mb-4">
              These actions cannot be undone. Please proceed with caution.
            </p>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Configuration
              </Button>

              <Button
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100"
                onClick={handleReset}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Factory Defaults
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
