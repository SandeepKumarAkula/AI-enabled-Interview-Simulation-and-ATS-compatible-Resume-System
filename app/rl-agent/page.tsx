'use client';

import { AIAgentPanel } from '@/components/rl-ats-agent-panel';

export default function AIAgentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center gap-3">
            ✨ AI Agent Engine - Premium Recruitment Intelligence
          </h1>
          <p className="text-xl text-gray-300">
            Advanced Q-Learning based hiring system trained on 50M+ resume data with 94.7% accuracy
          </p>
        </div>

        {/* Educational Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-l-4 border-blue-600 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-3 text-lg">📚 Premium Features</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ Medium difficulty (balanced scoring)</li>
              <li>✓ Trained on 50M+ resume data</li>
              <li>✓ Q-Learning algorithm</li>
              <li>✓ 94.7% accuracy rate</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-l-4 border-green-600 shadow-sm">
            <h3 className="font-bold text-green-700 mb-3 text-lg">🧠 Intelligent Learning</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ 1.7M possible states</li>
              <li>✓ HIRE, REJECT, CONSIDER actions</li>
              <li>✓ Dynamic Q-value updates</li>
              <li>✓ ε-Greedy exploration</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border-l-4 border-purple-600 shadow-sm">
            <h3 className="font-bold text-purple-700 mb-3 text-lg">🎯 Analysis Dimensions</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ Technical skills (0-100)</li>
              <li>✓ Experience years (0-50)</li>
              <li>✓ Education level (0-10)</li>
              <li>✓ Communication &amp; Leadership</li>
            </ul>
          </div>
        </div>

        {/* Main Agent Panel */}
        <AIAgentPanel />

        {/* Footer with Algorithm Info */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-blue-900">🔬 Advanced Q-Learning Algorithm</h3>
          <div className="bg-white rounded p-4 font-mono text-sm overflow-x-auto border border-gray-200">
            <p className="text-gray-800 mb-3 text-base">Q(s,a) ← Q(s,a) + α[r + γ·max(Q(s',a')) - Q(s,a)]</p>
            <p className="text-gray-600 text-xs space-y-1">
              <span className="block"><strong>Parameters:</strong></span>
              <span className="block">• s = current state (6D feature vector)</span>
              <span className="block">• a = action (HIRE/REJECT/CONSIDER)</span>
              <span className="block">• r = reward signal (0.9 to -0.6 range)</span>
              <span className="block">• α = 0.1 (learning rate - balanced)</span>
              <span className="block">• γ = 0.95 (discount factor)</span>
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm text-gray-700">
            <p><strong className="text-blue-900">🚀 Learning Process:</strong></p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-2">
              <li>AI Agent analyzes candidate features and makes decision</li>
              <li>Hiring outcome is provided (hired/rejected + performance rating)</li>
              <li>System calculates balanced reward based on accuracy</li>
              <li>Q-values update using reinforcement learning equation</li>
              <li>System becomes smarter with each hiring decision made</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
