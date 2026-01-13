import { NextRequest, NextResponse } from "next/server"
import { customATSAgent } from "@/lib/custom-ats-agent"

/**
 * ENTERPRISE ATS TRAINING API
 * ==========================
 * Endpoints for training and evaluating the custom ATS agent
 * 
 * Industry-standard training pipeline:
 * 1. Single feedback training
 * 2. Batch training for rapid improvement
 * 3. Performance metrics and insights
 * 4. Configuration management
 */

/**
 * POST /api/train-agent
 * Train agent on single resume with user feedback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      resumeId, 
      rating, 
      feedback,
      action,
      validationScore,
      trainingSet
    } = body

    // Validate inputs
    if (!rating) {
      return NextResponse.json(
        { error: "rating is required (1-10)" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: "rating must be between 1 and 10" },
        { status: 400 }
      )
    }

    // Handle single feedback training
    if (action === "feedback" || !action) {
      if (!resumeId) {
        return NextResponse.json(
          { error: "resumeId is required for feedback training" },
          { status: 400 }
        )
      }

      // Train on single resume
      customATSAgent.learnFromFeedback(
        resumeId, 
        rating, 
        feedback || "",
        validationScore
      )

      const insights = customATSAgent.getAgentInsights()

      return NextResponse.json({
        success: true,
        message: "Agent trained on single resume feedback",
        agentState: {
          version: insights.version,
          totalResumesTrained: insights.totalResumesTrained,
          averageUserRating: insights.averageUserRating,
          agentAccuracy: insights.agentAccuracy,
          performanceMetrics: insights.performanceMetrics,
          improvementTrend: insights.performanceMetrics?.improvementTrend
        }
      })
    }

    // Handle batch training
    if (action === "batch") {
      if (!trainingSet || !Array.isArray(trainingSet)) {
        return NextResponse.json(
          { error: "trainingSet array is required for batch training" },
          { status: 400 }
        )
      }

      const batchResult = await customATSAgent.batchTrain(trainingSet)

      const insights = customATSAgent.getAgentInsights()

      return NextResponse.json({
        success: true,
        message: `Batch trained on ${trainingSet.length} resumes`,
        batchResult: {
          samplesProcessed: trainingSet.length,
          improvedAccuracy: batchResult.improvedAccuracy,
          patternsLearned: batchResult.patternsLearned
        },
        agentState: {
          version: insights.version,
          totalResumesTrained: insights.totalResumesTrained,
          agentAccuracy: insights.agentAccuracy,
          performanceMetrics: insights.performanceMetrics
        }
      })
    }

    return NextResponse.json(
      { error: "Invalid action specified" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Agent training error:", error)
    return NextResponse.json(
      { error: "Failed to train agent", details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/train-agent
 * Retrieve comprehensive agent insights and state
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")

    const insights = customATSAgent.getAgentInsights()

    // Return different data based on requested action
    if (action === "full") {
      return NextResponse.json({
        success: true,
        agentState: insights,
        scoringFactors: customATSAgent.getCustomScoringFactors(),
        patternAnalysis: customATSAgent.getPatternAnalysis()
      })
    }

    if (action === "config") {
      return NextResponse.json({
        success: true,
        config: customATSAgent.exportAgentConfig()
      })
    }

    if (action === "patterns") {
      return NextResponse.json({
        success: true,
        patterns: customATSAgent.getPatternAnalysis()
      })
    }

    // Default: return basic insights
    return NextResponse.json({
      success: true,
      agentState: {
        version: insights.version,
        status: insights.isLearning ? "trained" : "untrained",
        totalResumesTrained: insights.totalResumesTrained,
        averageUserRating: insights.averageUserRating,
        agentAccuracy: insights.agentAccuracy,
        complianceMode: insights.complianceMode,
        lastUpdated: insights.lastUpdated,
        performanceMetrics: insights.performanceMetrics,
        improvementTrend: insights.performanceMetrics?.improvementTrend,
        recommendedAction: insights.performanceMetrics?.recommendedAction
      },
      scoringFactors: customATSAgent.getCustomScoringFactors()
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
 * PUT /api/train-agent
 * Update agent configuration or perform administrative actions
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config } = body

    if (action === "import-config") {
      const success = customATSAgent.importAgentConfig(config)
      return NextResponse.json({
        success,
        message: success ? "Configuration imported successfully" : "Failed to import configuration"
      })
    }

    if (action === "reset") {
      customATSAgent.resetToDefaults()
      return NextResponse.json({
        success: true,
        message: "Agent reset to factory defaults"
      })
    }

    return NextResponse.json(
      { error: "Invalid action specified" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Agent configuration error:", error)
    return NextResponse.json(
      { error: "Failed to update agent configuration", details: String(error) },
      { status: 500 }
    )
  }
}

