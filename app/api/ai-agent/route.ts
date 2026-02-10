import { NextRequest, NextResponse } from 'next/server';
import { CustomATSAgent } from '@/lib/custom-ats-agent-complete';
import { IntelligentATSAgent } from '@/lib/intelligent-ats-agent-complete';
import { AIAgentEngine } from '@/lib/rl-ats-agent-complete';
import { getCustomAgentConfig, getIntelligentAgentConfig, getRLAgentConfig } from '@/lib/ats-agent-config';

// Initialize agents as singletons
let customAgent: CustomATSAgent | null = null;
let intelligentAgent: IntelligentATSAgent | null = null;
let rlAgent: AIAgentEngine | null = null;

/**
 * Initialize all AI agents with their configurations
 */
function initializeAgents() {
  if (!customAgent) {
    const customConfig = getCustomAgentConfig();
    customAgent = new CustomATSAgent(customConfig);
  }
  if (!intelligentAgent) {
    const intelligentConfig = getIntelligentAgentConfig();
    intelligentAgent = new IntelligentATSAgent(intelligentConfig);
  }
  if (!rlAgent) {
    const rlConfig = getRLAgentConfig();
    rlAgent = new AIAgentEngine(rlConfig);
  }
}

interface ResumeFeatures {
  technicalScore: number; // 0-100
  experienceYears: number; // 0-50
  educationLevel: number; // 1-10
  communicationScore: number; // 0-100
  leadershipScore: number; // 0-100
  cultureFitScore: number; // 0-100
}

interface AgentDecision {
  decision: 'HIRE' | 'CONSIDER' | 'REJECT';
  confidence: number;
  reasoning: string[];
  scores: Record<string, number>;
  metadata: {
    processedAt: string;
    agentType: string;
    algorithmVersion: string;
  };
}

/**
 * Get decision from RL (Q-Learning) agent
 */
async function getRLAgentDecision(features: ResumeFeatures, jobDescription?: string): Promise<AgentDecision> {
  if (!rlAgent) throw new Error('RL agent not initialized');

  const decision = rlAgent.makeDecision(
    {
      technical: Math.min(100, features.technicalScore),
      experience: Math.min(50, features.experienceYears),
      communication: Math.min(100, features.communicationScore),
      cultureFit: Math.min(100, features.cultureFitScore),
      education: Math.min(10, features.educationLevel),
      leadership: Math.min(100, features.leadershipScore)
    } as any,
    jobDescription
  );

  return {
    decision: decision.decision as 'HIRE' | 'CONSIDER' | 'REJECT',
    confidence: decision.confidence || 0.5,
    reasoning: decision.reasoning || ['Q-Learning evaluated candidate profile'],
    scores: {
      technical: features.technicalScore,
      experience: features.experienceYears * 10,
      education: (features.educationLevel / 10) * 100,
      communication: features.communicationScore,
      leadership: features.leadershipScore,
      cultureFit: features.cultureFitScore
    },
    metadata: {
      processedAt: new Date().toISOString(),
      agentType: 'AIAgentEngine',
      algorithmVersion: '4.0-q-learning'
    }
  };
}

/**
 * Get decision from custom agent
 */
async function getCustomAgentDecision(features: ResumeFeatures, jobDescription?: string): Promise<AgentDecision> {
  if (!customAgent) throw new Error('Custom agent not initialized');

  const result = customAgent.analyzeResume(jobDescription || '', features as any);

  return {
    decision: result.decision as 'HIRE' | 'CONSIDER' | 'REJECT',
    confidence: result.confidence || 0.5,
    reasoning: result.reasoning || ['Pattern matching analysis complete'],
    scores: {
      technical: features.technicalScore,
      experience: features.experienceYears * 10,
      education: (features.educationLevel / 10) * 100,
      communication: features.communicationScore,
      leadership: features.leadershipScore,
      cultureFit: features.cultureFitScore
    },
    metadata: {
      processedAt: new Date().toISOString(),
      agentType: 'CustomATSAgent',
      algorithmVersion: '2.0-ml-pattern'
    }
  };
}

/**
 * Get decision from intelligent (neural network) agent
 */
async function getIntelligentAgentDecision(features: ResumeFeatures, jobDescription?: string): Promise<AgentDecision> {
  if (!intelligentAgent) throw new Error('Intelligent agent not initialized');

  const result = intelligentAgent.makeDecision(
    {
      technical: features.technicalScore,
      experience: features.experienceYears,
      education: features.educationLevel,
      communication: features.communicationScore,
      leadership: features.leadershipScore,
      cultureFit: features.cultureFitScore
    } as any,
    jobDescription
  );

  return {
    decision: result.decision as 'HIRE' | 'CONSIDER' | 'REJECT',
    confidence: result.confidence || 0.5,
    reasoning: result.reasoning || ['Neural network evaluation complete'],
    scores: {
      technical: features.technicalScore,
      experience: features.experienceYears * 10,
      education: (features.educationLevel / 10) * 100,
      communication: features.communicationScore,
      leadership: features.leadershipScore,
      cultureFit: features.cultureFitScore
    },
    metadata: {
      processedAt: new Date().toISOString(),
      agentType: 'IntelligentATSAgent',
      algorithmVersion: '3.0-neural-net'
    }
  };
}

/**
 * Get ensemble decision
 */
async function getEnsembleDecision(features: ResumeFeatures, jobDescription?: string): Promise<AgentDecision> {
  const customDecision = await getCustomAgentDecision(features, jobDescription);
  const intelligentDecision = await getIntelligentAgentDecision(features, jobDescription);
  const rlDecision = await getRLAgentDecision(features, jobDescription);

  const ensembleConfidence =
    (customDecision.confidence * 0.3 + intelligentDecision.confidence * 0.35 + rlDecision.confidence * 0.35);

  const decisionCounts = { HIRE: 0, CONSIDER: 0, REJECT: 0 };
  decisionCounts[customDecision.decision]++;
  decisionCounts[intelligentDecision.decision]++;
  decisionCounts[rlDecision.decision]++;

  const ensembleDecision = Object.entries(decisionCounts).sort(([, a], [, b]) => b - a)[0][0] as
    | 'HIRE'
    | 'CONSIDER'
    | 'REJECT';

  return {
    decision: ensembleDecision,
    confidence: ensembleConfidence,
    reasoning: [
      `Ensemble consensus: ${ensembleDecision}`,
      `Custom (30%): ${customDecision.decision} (${(customDecision.confidence * 100).toFixed(1)}%)`,
      `Neural (35%): ${intelligentDecision.decision} (${(intelligentDecision.confidence * 100).toFixed(1)}%)`,
      `Q-Learning (35%): ${rlDecision.decision} (${(rlDecision.confidence * 100).toFixed(1)}%)`
    ],
    scores: customDecision.scores,
    metadata: {
      processedAt: new Date().toISOString(),
      agentType: 'EnsembleAI',
      algorithmVersion: '5.0-ensemble-voting'
    }
  };
}

/**
 * POST - Make decisions or train agents
 */
export async function POST(request: NextRequest) {
  try {
    initializeAgents();

    const body = await request.json();
    const { action, agentType = 'ensemble', features, jobDescription, candidateId, hired, performanceRating } = body;

    if (action === 'decide') {
      if (!features) {
        return NextResponse.json({ error: 'Features required' }, { status: 400 });
      }

      let decision: AgentDecision;

      if (agentType === 'custom') {
        decision = await getCustomAgentDecision(features, jobDescription);
      } else if (agentType === 'intelligent') {
        decision = await getIntelligentAgentDecision(features, jobDescription);
      } else if (agentType === 'rl') {
        decision = await getRLAgentDecision(features, jobDescription);
      } else {
        decision = await getEnsembleDecision(features, jobDescription);
      }

      return NextResponse.json({
        success: true,
        decision,
        message: `Decision made using ${agentType} approach`
      });
    } else if (action === 'train') {
      if (!candidateId || hired === undefined) {
        return NextResponse.json({ error: 'candidateId and hired status required' }, { status: 400 });
      }

      if (agentType === 'rl' && rlAgent) {
        rlAgent.learnFromOutcome(candidateId, hired, performanceRating || 3);
        rlAgent.decayExploration();
      }

      return NextResponse.json({
        success: true,
        message: `${agentType} agent learned from outcome`,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('AI Agent API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET - Get insights and agent information
 */
export async function GET(request: NextRequest) {
  try {
    initializeAgents();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'insights') {
      return NextResponse.json({
        success: true,
        insights: {
          customAgent: !!customAgent ? { status: 'initialized', type: 'Pattern-Matching ML' } : null,
          intelligentAgent: !!intelligentAgent ? { status: 'initialized', type: 'Deep Neural Network' } : null,
          rlAgent: !!rlAgent ? { status: 'initialized', type: 'Q-Learning RL' } : null,
          timestamp: new Date().toISOString()
        }
      });
    } else if (action === 'status') {
      return NextResponse.json({
        success: true,
        agents: {
          custom: { initialized: !!customAgent, type: 'CustomATSAgent' },
          intelligent: { initialized: !!intelligentAgent, type: 'IntelligentATSAgent' },
          rl: { initialized: !!rlAgent, type: 'AIAgentEngine' }
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'AI Agent API - Multi-agent decision system',
        version: '2.0',
        agents: [
          { name: 'CustomATSAgent', type: 'Pattern-Matching ML', version: '2.0' },
          { name: 'IntelligentATSAgent', type: 'Deep Neural Network', version: '3.0' },
          { name: 'AIAgentEngine', type: 'Q-Learning Reinforcement', version: '4.0' }
        ]
      });
    }
  } catch (error: any) {
    console.error('AI Agent API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
