import { NextRequest, NextResponse } from 'next/server';
import { rlATSAgent, type ResumFeatures, type HiringDecision } from '@/lib/rl-ats-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, features, candidateId, hired, performanceRating, jobDescription } = body;

    if (action === 'decide') {
      // Make a hiring decision
      if (!features) {
        return NextResponse.json({ error: 'Features required' }, { status: 400 });
      }

      const decision: HiringDecision = rlATSAgent.makeDecision(
        features as ResumFeatures,
        jobDescription
      );

      // Save agent state after decision
      rlATSAgent.saveToLocalStorage();

      return NextResponse.json({
        success: true,
        decision,
        message: 'Hiring decision made using reinforcement learning'
      });
    } else if (action === 'train') {
      // Train the agent from outcome
      if (!candidateId || hired === undefined) {
        return NextResponse.json(
          { error: 'candidateId and hired status required' },
          { status: 400 }
        );
      }

      rlATSAgent.learnFromOutcome(candidateId, hired, performanceRating);
      rlATSAgent.decayExploration();
      rlATSAgent.saveToLocalStorage();

      const insights = rlATSAgent.getInsights();

      return NextResponse.json({
        success: true,
        message: 'Agent learned from outcome',
        insights,
        trainingHistory: rlATSAgent.getTrainingHistory().slice(-5)
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in RL ATS agent:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'insights') {
      const insights = rlATSAgent.getInsights();
      return NextResponse.json({
        success: true,
        insights
      });
    } else if (action === 'recent-decisions') {
      const limit = parseInt(searchParams.get('limit') || '10');
      const decisions = rlATSAgent.getRecentDecisions(limit);
      return NextResponse.json({
        success: true,
        decisions
      });
    } else if (action === 'history') {
      const history = rlATSAgent.getTrainingHistory();
      return NextResponse.json({
        success: true,
        trainingHistory: history
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'RL ATS Agent is running',
        endpoints: {
          decide: 'POST with action=decide, features',
          train: 'POST with action=train, candidateId, hired, performanceRating',
          insights: 'GET with action=insights',
          recentDecisions: 'GET with action=recent-decisions',
          history: 'GET with action=history'
        }
      });
    }
  } catch (error: any) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
