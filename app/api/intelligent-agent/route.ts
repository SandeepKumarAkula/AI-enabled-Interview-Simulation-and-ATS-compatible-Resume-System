import { NextRequest, NextResponse } from "next/server"
import { intelligentATSAgent } from "@/lib/intelligent-ats-agent"

/**
 * INTELLIGENT AI AGENT API
 * ========================
 * Real machine learning endpoints for the ATS agent
 * Uses neural networks and reinforcement learning
 */

/**
 * POST /api/intelligent-agent/decide
 * Make a hiring decision using the trained AI agent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      features, // MLFeatureVector
      resumeText,
      jobDescription,
      action
    } = body

    if (!features || !resumeText) {
      return NextResponse.json(
        { error: "features and resumeText are required" },
        { status: 400 }
      )
    }

    // Validate feature vector
    if (
      !features.technicalScore ||
      !features.communicationScore ||
      !features.leadershipScore ||
      !features.innovationScore ||
      !features.cultureAlignmentScore ||
      !features.jobFitScore
    ) {
      return NextResponse.json(
        { error: "All feature scores are required" },
        { status: 400 }
      )
    }

    if (action === "train") {
      // Training mode - learn from outcome
      const { outcome } = body

      if (!outcome || !["hired", "rejected"].includes(outcome)) {
        return NextResponse.json(
          { error: "outcome must be 'hired' or 'rejected'" },
          { status: 400 }
        )
      }

      const learningResult = await intelligentATSAgent.learnFromOutcome(
        features,
        outcome,
        body.feedback
      )

      const insights = intelligentATSAgent.getAgentInsights()

      return NextResponse.json({
        success: true,
        message: "Agent learned from outcome",
        learning: learningResult,
        agentInsights: {
          version: insights.version,
          accuracy: insights.accuracy,
          decisionStats: insights.decisionStats,
          improvementTrend: insights.improvementTrend,
          memorySize: insights.memorySize
        }
      })
    } else {
      // Decision mode - make prediction
      const decision = await intelligentATSAgent.makeDecision(
        features,
        resumeText,
        jobDescription
      )

      const insights = intelligentATSAgent.getAgentInsights()

      return NextResponse.json({
        success: true,
        decision,
        agentState: {
          version: insights.version,
          accuracy: insights.accuracy,
          decisionsMade: insights.decisionStats.totalDecisions,
          improvementTrend: insights.improvementTrend
        }
      })
    }
  } catch (error) {
    console.error("Agent decision error:", error)
    return NextResponse.json(
      { error: "Failed to process agent decision", details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/intelligent-agent/insights
 * Get comprehensive agent insights and performance metrics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")

    if (action === "full-report") {
      const report = intelligentATSAgent.getPerformanceReport()
      return NextResponse.json({
        success: true,
        report
      })
    }

    const insights = intelligentATSAgent.getAgentInsights()

    return NextResponse.json({
      success: true,
      agentInsights: {
        version: insights.version,
        status: insights.agentStatus,
        neuralNetwork: {
          architecture: insights.neuralNetworkLayers,
          activationFunctions: ["ReLU", "ReLU", "Sigmoid"],
          totalParameters: (
            insights.neuralNetworkLayers[0] * insights.neuralNetworkLayers[1] +
            insights.neuralNetworkLayers[1] * insights.neuralNetworkLayers[2] +
            insights.neuralNetworkLayers[2] * insights.neuralNetworkLayers[3]
          ).toLocaleString()
        },
        decisionStats: insights.decisionStats,
        accuracy: `${insights.accuracy}%`,
        improvementTrend: insights.improvementTrend,
        memorySize: insights.memorySize,
        learningProgress: {
          totalEpochs: insights.learningHistory.length,
          recentLosses: insights.learningHistory.slice(-5).map(l => ({
            epoch: l.epoch,
            loss: Math.round(l.loss * 1000) / 1000
          }))
        }
      }
    })
  } catch (error) {
    console.error("Agent insights error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve agent insights", details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/intelligent-agent/manage
 * Manage agent configuration and state
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, state } = body

    if (action === "export") {
      const agentState = intelligentATSAgent.exportAgentState()
      return NextResponse.json({
        success: true,
        state: agentState
      })
    }

    if (action === "import") {
      if (!state) {
        return NextResponse.json(
          { error: "state is required for import" },
          { status: 400 }
        )
      }

      const success = intelligentATSAgent.importAgentState(state)
      return NextResponse.json({
        success,
        message: success ? "Agent state imported" : "Failed to import agent state"
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Agent management error:", error)
    return NextResponse.json(
      { error: "Failed to manage agent", details: String(error) },
      { status: 500 }
    )
  }
}
