"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Brain, TrendingUp, Zap, Database, Code2, AlertCircle, CheckCircle, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/toast"

interface MLFeatureVector {
  technicalScore: number
  communicationScore: number
  leadershipScore: number
  innovationScore: number
  cultureAlignmentScore: number
  jobFitScore: number
}

interface AgentDecision {
  score: number
  decision: "hire" | "consider" | "reject"
  confidence: number
  reasoning: string
  agentThinking: string
}

interface AgentInsights {
  version: string
  status: string
  neuralNetwork: {
    architecture: number[]
    activationFunctions: string[]
    totalParameters: string
  }
  decisionStats: {
    totalDecisions: number
    hireDecisions: number
    rejectDecisions: number
    hireRate: number
  }
  accuracy: string
  improvementTrend: string
  memorySize: {
    successfulHires: number
    rejectedCandidates: number
    totalDecisions: number
  }
  learningProgress: {
    totalEpochs: number
    recentLosses: Array<{ epoch: number; loss: number }>
  }
}

export function IntelligentAgentTrainer() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<"test" | "train" | "dashboard">("dashboard")
  const [agentInsights, setAgentInsights] = useState<AgentInsights | null>(null)
  const [loading, setLoading] = useState(false)

  // Test features
  const [testFeatures, setTestFeatures] = useState<MLFeatureVector>({
    technicalScore: 75,
    communicationScore: 70,
    leadershipScore: 65,
    innovationScore: 80,
    cultureAlignmentScore: 75,
    jobFitScore: 80
  })
  const [testResume, setTestResume] = useState("Software Engineer with 5 years experience")
  const [testDecision, setTestDecision] = useState<AgentDecision | null>(null)

  // Training data
  const [trainingFeatures, setTrainingFeatures] = useState<MLFeatureVector>({
    technicalScore: 80,
    communicationScore: 75,
    leadershipScore: 70,
    innovationScore: 85,
    cultureAlignmentScore: 80,
    jobFitScore: 85
  })
  const [trainingOutcome, setTrainingOutcome] = useState<"hired" | "rejected">("hired")
  const [trainingFeedback, setTrainingFeedback] = useState("")
  const [training, setTraining] = useState(false)

  // Load agent insights
  useEffect(() => {
    fetchAgentInsights()
    const interval = setInterval(fetchAgentInsights, 5000) // Auto-refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAgentInsights = async () => {
    try {
      const response = await fetch("/api/intelligent-agent/insights")
      if (response.ok) {
        const data = await response.json()
        setAgentInsights(data.agentInsights)
      }
    } catch (error) {
      console.error("Failed to fetch agent insights:", error)
    }
  }

  const handleTestAgent = async () => {
    if (!testResume.trim()) {
      addToast("Please enter resume text", "error")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/intelligent-agent/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: testFeatures,
          resumeText: testResume,
          action: "decide"
        })
      })

      if (response.ok) {
        const data = await response.json()
        setTestDecision(data.decision)
        addToast("Agent made a decision", "success")
      } else {
        const error = await response.json()
        addToast(error.error || "Failed to get decision", "error")
      }
    } catch (error) {
      console.error("Test error:", error)
      addToast("Failed to test agent", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleTrainAgent = async () => {
    try {
      setTraining(true)
      const response = await fetch("/api/intelligent-agent/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: trainingFeatures,
          resumeText: `Training sample - ${trainingOutcome}`,
          outcome: trainingOutcome,
          feedback: trainingFeedback,
          action: "train"
        })
      })

      if (response.ok) {
        const data = await response.json()
        addToast(`Agent learned: ${data.learning.learningMessage}`, "success")
        
        // Reset form
        setTrainingFeedback("")
        
        // Refresh insights
        await fetchAgentInsights()
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

  const handleExportAgent = async () => {
    try {
      const response = await fetch("/api/intelligent-agent/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export" })
      })

      if (response.ok) {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data.state, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `intelligent-agent-${Date.now()}.json`
        a.click()
        addToast("Agent exported", "success")
      }
    } catch (error) {
      console.error("Export error:", error)
      addToast("Failed to export agent", "error")
    }
  }

  const updateTestFeature = (key: keyof MLFeatureVector, value: number) => {
    setTestFeatures({ ...testFeatures, [key]: Math.min(100, Math.max(0, value)) })
  }

  const updateTrainingFeature = (key: keyof MLFeatureVector, value: number) => {
    setTrainingFeatures({ ...trainingFeatures, [key]: Math.min(100, Math.max(0, value)) })
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Brain className="w-10 h-10" />
              Intelligent AI Agent
            </h1>
            <p className="text-purple-100 mt-2">Neural network-based hiring decision maker with learning capabilities</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-100 mb-2">Agent Accuracy</div>
            <div className="text-4xl font-bold">{agentInsights?.accuracy || "—"}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(["dashboard", "test", "train"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === tab
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && agentInsights && (
        <div className="space-y-6">
          {/* Agent Architecture */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-600" />
              Neural Network Architecture
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{agentInsights.neuralNetwork.architecture[0]}</div>
                <div className="text-xs text-gray-600 mt-1">Input Layer</div>
                <div className="text-xs text-gray-500">Features</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl text-blue-400">→</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{agentInsights.neuralNetwork.architecture[1]}</div>
                <div className="text-xs text-gray-600 mt-1">Hidden Layer 1</div>
                <div className="text-xs text-gray-500">ReLU</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl text-blue-400">→</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{agentInsights.neuralNetwork.architecture[2]}</div>
                <div className="text-xs text-gray-600 mt-1">Hidden Layer 2</div>
                <div className="text-xs text-gray-500">ReLU</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl text-blue-400">→</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{agentInsights.neuralNetwork.architecture[3]}</div>
                <div className="text-xs text-gray-600 mt-1">Output</div>
                <div className="text-xs text-gray-500">Score 0-100</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200 text-sm">
              <div className="font-semibold text-gray-700 mb-2">Model Statistics:</div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>Total Parameters: <span className="font-mono font-semibold">{agentInsights.neuralNetwork.totalParameters}</span></div>
                <div>Activation: <span className="font-mono font-semibold">{agentInsights.neuralNetwork.activationFunctions.join(" → ")}</span></div>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-gray-600 text-sm font-medium mb-2">Total Decisions</div>
              <div className="text-3xl font-bold text-green-600">{agentInsights.decisionStats.totalDecisions}</div>
              <div className="text-xs text-gray-500 mt-2">Resume evaluations</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="text-gray-600 text-sm font-medium mb-2">Learning Epochs</div>
              <div className="text-3xl font-bold text-blue-600">{agentInsights.learningProgress.totalEpochs}</div>
              <div className="text-xs text-gray-500 mt-2">Training iterations</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="text-gray-600 text-sm font-medium mb-2">Memory Size</div>
              <div className="text-3xl font-bold text-orange-600">{agentInsights.memorySize.totalDecisions}</div>
              <div className="text-xs text-gray-500 mt-2">Decision records</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-gray-600 text-sm font-medium mb-2">Trend</div>
              <div className="text-lg font-bold text-purple-600 capitalize">{agentInsights.improvementTrend}</div>
              <div className="text-xs text-gray-500 mt-2">Performance trajectory</div>
            </Card>
          </div>

          {/* Decision Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Decision Distribution</h3>
              {agentInsights.decisionStats.totalDecisions > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Hire", value: agentInsights.decisionStats.hireDecisions },
                        { name: "Reject", value: agentInsights.decisionStats.rejectDecisions }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No decisions yet - agent is initializing
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Learning Progress</h3>
              {agentInsights.learningProgress.totalEpochs > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={agentInsights.learningProgress.recentLosses}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="loss"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No learning history yet
                </div>
              )}
            </Card>
          </div>

          {/* Agent Status */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Agent Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 font-medium">Version</div>
                <div className="font-mono text-sm mt-2">{agentInsights.version}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 font-medium">Status</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold capitalize">{agentInsights.status}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 font-medium">Hire Rate</div>
                <div className="text-2xl font-bold text-purple-600 mt-2">{agentInsights.decisionStats.hireRate}%</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Test Tab */}
      {activeTab === "test" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Input */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Test Agent Decision</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Resume Text</label>
                <Textarea
                  placeholder="Paste resume here..."
                  value={testResume}
                  onChange={(e) => setTestResume(e.target.value)}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Feature Scores</label>
                {(Object.keys(testFeatures) as Array<keyof MLFeatureVector>).map(key => (
                  <div key={key} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <label>{key.replace(/([A-Z])/g, " $1").trim()}</label>
                      <span className="font-bold text-purple-600">{testFeatures[key]}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={testFeatures[key]}
                      onChange={(e) => updateTestFeature(key, parseInt(e.target.value))}
                      className="w-full"
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleTestAgent} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Test Agent"}
              </Button>
            </div>
          </Card>

          {/* Test Output */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold mb-4">Agent Decision</h3>
            
            {testDecision ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-white rounded-lg border-2 border-purple-200">
                  <div className="text-sm text-gray-600 mb-2">DECISION SCORE</div>
                  <div className="text-4xl font-bold text-purple-600">{testDecision.score}</div>
                  <div className="text-xs text-gray-500 mt-1">out of 100</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Decision</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    testDecision.decision === "hire"
                      ? "bg-green-100 text-green-800"
                      : testDecision.decision === "consider"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {testDecision.decision.toUpperCase()}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Confidence</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${testDecision.confidence}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{testDecision.confidence}% confidence</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Reasoning</div>
                  <p className="text-sm text-gray-600">{testDecision.reasoning}</p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-200 max-h-64 overflow-y-auto">
                  <div className="text-sm font-semibold text-gray-700 mb-2">🧠 Agent Thinking</div>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                    {testDecision.agentThinking}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Test the agent with resume and feature scores
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Train Tab */}
      {activeTab === "train" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Training Input */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-green-600" />
              Train Agent with Outcome
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Feature Scores</label>
                {(Object.keys(trainingFeatures) as Array<keyof MLFeatureVector>).map(key => (
                  <div key={key} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <label>{key.replace(/([A-Z])/g, " $1").trim()}</label>
                      <span className="font-bold text-green-600">{trainingFeatures[key]}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={trainingFeatures[key]}
                      onChange={(e) => updateTrainingFeature(key, parseInt(e.target.value))}
                      className="w-full"
                      disabled={training}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Actual Outcome</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTrainingOutcome("hired")}
                    className={`flex-1 py-2 px-3 rounded font-medium transition ${
                      trainingOutcome === "hired"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    disabled={training}
                  >
                    ✓ Hired
                  </button>
                  <button
                    onClick={() => setTrainingOutcome("rejected")}
                    className={`flex-1 py-2 px-3 rounded font-medium transition ${
                      trainingOutcome === "rejected"
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    disabled={training}
                  >
                    ✕ Rejected
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Feedback (Optional)</label>
                <Textarea
                  placeholder="Why was this decision made?"
                  value={trainingFeedback}
                  onChange={(e) => setTrainingFeedback(e.target.value)}
                  rows={3}
                  disabled={training}
                />
              </div>

              <Button onClick={handleTrainAgent} disabled={training} className="w-full bg-green-600 hover:bg-green-700">
                {training ? "Training..." : "Train Agent"}
              </Button>
            </div>
          </Card>

          {/* Training Info */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <h3 className="text-lg font-semibold mb-4">How Agent Learning Works</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">🧠 Neural Network</h4>
                <p className="text-sm text-gray-700">
                  The agent uses a 3-layer neural network (6 → 16 → 8 → 1) to make decisions based on feature scores.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">📚 Backpropagation</h4>
                <p className="text-sm text-gray-700">
                  When you provide the actual outcome, the agent adjusts its internal weights using backpropagation algorithm.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">📈 Continuous Improvement</h4>
                <p className="text-sm text-gray-700">
                  Each training iteration improves the agent's ability to predict hiring outcomes for similar candidates.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">💾 Memory</h4>
                <p className="text-sm text-gray-700">
                  Agent stores all decisions and training data to improve pattern recognition over time.
                </p>
              </div>

              <Button onClick={handleExportAgent} variant="outline" className="w-full mt-4">
                <Download className="w-4 h-4 mr-2" />
                Export Trained Agent
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
