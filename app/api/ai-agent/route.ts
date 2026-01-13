import { NextRequest, NextResponse } from 'next/server'
import { aiAgentEngine, type ResumFeatures, type HiringDecision } from '@/lib/rl-ats-agent'

/**
 * AI Agent API Routes
 * Premium AI-powered recruitment intelligence endpoints
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, features, candidateId, hired, performanceRating, jobDescription } = body

    if (action === 'decide') {
      // Make a hiring decision with AI Agent
      if (!features) {
        return NextResponse.json({ error: 'Features required' }, { status: 400 })
      }

      const decision: HiringDecision = aiAgentEngine.makeDecision(
        features as ResumFeatures,
        jobDescription
      )

      // Save engine state after decision
      aiAgentEngine.saveToLocalStorage()

      return NextResponse.json({
        success: true,
        decision,
        message: 'AI Agent Decision: Advanced reinforcement learning analysis'
      })
    } else if (action === 'train') {
      // Train AI Agent from outcome
      if (!candidateId || hired === undefined) {
        return NextResponse.json(
          { error: 'candidateId and hired status required' },
          { status: 400 }
        )
      }

      aiAgentEngine.learnFromOutcome(candidateId, hired, performanceRating)
      aiAgentEngine.decayExploration()
      aiAgentEngine.saveToLocalStorage()

      const insights = aiAgentEngine.getInsights()

      return NextResponse.json({
        success: true,
        message: 'AI Agent learning update completed',
        insights,
        trainingHistory: aiAgentEngine.getTrainingHistory().slice(-5)
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Agent API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'insights') {
      const insights = aiAgentEngine.getInsights()
      return NextResponse.json({
        success: true,
        insights
      })
    } else if (action === 'recent-decisions') {
      const decisions = aiAgentEngine.getRecentDecisions(10)
      return NextResponse.json({
        success: true,
        recentDecisions: decisions
      })
    } else if (action === 'history') {
      const history = aiAgentEngine.getTrainingHistory()
      return NextResponse.json({
        success: true,
        trainingHistory: history
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Agent API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
