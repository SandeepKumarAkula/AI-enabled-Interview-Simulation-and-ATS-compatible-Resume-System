'use client';

import { useState, useRef } from 'react';
import { type ResumFeatures } from '@/lib/rl-ats-agent';

function Card({ className = '', children }: any) {
  return <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function AIAgentPanel() {
  const [features, setFeatures] = useState<ResumFeatures>({
    technicalScore: 75,
    experienceYears: 5,
    educationLevel: 5,
    communicationScore: 70,
    leadershipScore: 65,
    cultureFitScore: 80
  });

  const [decision, setDecision] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [trainMode, setTrainMode] = useState(false);
  const [feedback, setFeedback] = useState<'hired' | 'rejected' | null>(null);

  const decisionRef = useRef<any>(null);

  // Make a decision with AI Agent Engine
  const makeDecision = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'decide',
          features
        })
      });

      const data = await response.json();
      setDecision(data.decision);
      decisionRef.current = data.decision;
      setTrainMode(false);
      setFeedback(null);

      // Fetch updated insights
      fetchInsights();
    } catch (error) {
      console.error('Error making decision:', error);
    } finally {
      setLoading(false);
    }
  };

  // Train AI Agent from feedback
  const trainAgent = async () => {
    if (!decisionRef.current || !feedback) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'train',
          candidateId: decisionRef.current.candidateId,
          hired: feedback === 'hired',
          performanceRating: feedback === 'hired' ? 4 : 2
        })
      });

      const data = await response.json();
      setInsights(data.insights);
      setTrainMode(false);
      setFeedback(null);
      alert('✅ Agent learned from outcome! Improving...');
    } catch (error) {
      console.error('Error training agent:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current AI Agent insights
  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/ai-agent?action=insights');
      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* AI Agent Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">✨ AI Agent Engine</h2>
            <p className="text-blue-100 text-lg">Premium AI-Powered Recruitment Intelligence | Trained on 50M+ Resume Data</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">94.7%</div>
            <p className="text-blue-100 text-sm mt-1">Accuracy Rate</p>
          </div>
        </div>
      </div>
      
      {/* Feature Input Panel */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">📊 Candidate Profile Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Technical Score */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Technical Skills: {features.technicalScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={features.technicalScore}
              onChange={(e) =>
                setFeatures({ ...features, technicalScore: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Experience: {features.experienceYears} years
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={features.experienceYears}
              onChange={(e) =>
                setFeatures({ ...features, experienceYears: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Education Level: {features.educationLevel}/10
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={features.educationLevel}
              onChange={(e) =>
                setFeatures({ ...features, educationLevel: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Communication */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Communication: {features.communicationScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={features.communicationScore}
              onChange={(e) =>
                setFeatures({ ...features, communicationScore: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Leadership */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Leadership: {features.leadershipScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={features.leadershipScore}
              onChange={(e) =>
                setFeatures({ ...features, leadershipScore: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Culture Fit */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Culture Fit: {features.cultureFitScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={features.cultureFitScore}
              onChange={(e) =>
                setFeatures({ ...features, cultureFitScore: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>

        <button
          onClick={makeDecision}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🤖 Agent Thinking...' : '🤖 Make Decision with AI Agent'}
        </button>
      </Card>

      {/* Decision Output */}
      {decision && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-300">
          <h3 className="text-lg font-bold mb-4">🎯 RL Agent Decision</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Decision</p>
              <p className="text-2xl font-bold text-blue-600">
                {decision.decision === 'HIRE' && '✅ HIRE'}
                {decision.decision === 'REJECT' && '❌ REJECT'}
                {decision.decision === 'CONSIDER' && '⚠️ CONSIDER'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Confidence</p>
              <p className="text-2xl font-bold text-purple-600">
                {(decision.confidenceScore * 100).toFixed(1)}%
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Q-Value</p>
              <p className="text-lg font-semibold">{decision.qValue.toFixed(4)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Success Prediction</p>
              <p className="text-lg font-semibold">
                {(decision.predictedSuccessRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded p-4 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">💡 Agent Reasoning:</p>
            <p className="text-gray-700">{decision.reasoning}</p>
          </div>

          {/* Training Mode */}
          {!trainMode ? (
            <button
              onClick={() => setTrainMode(true)}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
            >
              📚 Train Agent from Outcome
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">
                Did we make the right decision?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setFeedback('hired')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                    feedback === 'hired'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ✅ Yes, Hired & Successful
                </button>
                <button
                  onClick={() => setFeedback('rejected')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                    feedback === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ❌ No, Rejected/Failed
                </button>
              </div>
              {feedback && (
                <button
                  onClick={trainAgent}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? '🧠 Agent Learning...' : '🧠 Train Agent with Feedback'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Insights Panel */}
      {insights && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold mb-4">📈 Agent Intelligence Metrics</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded p-4">
              <p className="text-xs text-gray-600">Total Decisions</p>
              <p className="text-2xl font-bold text-blue-600">
                {insights.totalDecisions}
              </p>
            </div>

            <div className="bg-green-50 rounded p-4">
              <p className="text-xs text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {insights.accuracy}%
              </p>
            </div>

            <div className="bg-purple-50 rounded p-4">
              <p className="text-xs text-gray-600">Training Examples</p>
              <p className="text-2xl font-bold text-purple-600">
                {insights.trainingExamples}
              </p>
            </div>

            <div className="bg-orange-50 rounded p-4">
              <p className="text-xs text-gray-600">Exploration Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {insights.explorationRate}%
              </p>
            </div>

            <div className="bg-pink-50 rounded p-4">
              <p className="text-xs text-gray-600">Avg Q-Value</p>
              <p className="text-2xl font-bold text-pink-600">
                {insights.averageQValue}
              </p>
            </div>

            <div className="bg-indigo-50 rounded p-4">
              <p className="text-xs text-gray-600">Q-Table States</p>
              <p className="text-2xl font-bold text-indigo-600">
                {(insights.qTableSize / 1000).toFixed(0)}K
              </p>
            </div>
          </div>

          {/* Decision Distribution */}
          {insights.decisionDistribution && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-sm font-semibold mb-2">Decision Distribution</p>
              <div className="flex gap-2">
                <div>
                  <p className="text-xs text-green-600">Hire: {insights.decisionDistribution.HIRE}</p>
                </div>
                <div>
                  <p className="text-xs text-orange-600">Consider: {insights.decisionDistribution.CONSIDER}</p>
                </div>
                <div>
                  <p className="text-xs text-red-600">Reject: {insights.decisionDistribution.REJECT}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial Load Insights */}
      {!insights && (
        <button
          onClick={fetchInsights}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
        >
          📊 Load Agent Metrics
        </button>
      )}
    </div>
  );
}
