import React from 'react'
import { Zap, Mic, Brain, BarChart3, Camera, Shield, Home } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Features — AI²SARS',
  description: 'Explore powerful features of AI²SARS interview simulator and ATS resume system',
}

export default function FeaturesPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Questions',
      description: 'Q-Learning agent adapts interview questions based on your performance, difficulty level, and role',
      details: ['100+ questions', '9 different roles', '3 difficulty levels', 'Real-time adaptation']
    },
    {
      icon: Mic,
      title: 'Speech Recognition',
      description: 'Advanced speech-to-text with real-time transcription and live captions during interviews',
      details: ['Web Speech API', 'Real-time captions', 'Noise filtering', 'Multi-language support']
    },
    {
      icon: Camera,
      title: 'Video Analysis',
      description: 'MediaPipe-powered body language analysis evaluating posture, eye contact, and gestures',
      details: ['Pose detection', 'Hand tracking', 'Confidence scoring', 'Body language insights']
    },
    {
      icon: BarChart3,
      title: 'Performance Scoring',
      description: '6-dimensional scoring system analyzing clarity, technical depth, problem-solving, communication, confidence, and body language',
      details: ['Instant scoring', 'Detailed breakdown', 'Comparative analysis', 'Improvement recommendations']
    },
    {
      icon: Zap,
      title: 'Fullscreen Interview Mode',
      description: 'Immersive interview experience with automatic fullscreen, timer, and distraction-free environment',
      details: ['Auto fullscreen', 'Real-time timer', 'Picture-in-picture', 'Auto-exit protection']
    },
    {
      icon: Shield,
      title: 'ATS-Friendly Templates',
      description: 'Resume templates optimized for Applicant Tracking Systems with ATS score analysis',
      details: ['ATS optimization', 'Real-time preview', 'PDF export', 'Template library']
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-emerald-600">Features</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 mb-8">Everything you need to master your interviews and optimize your resume</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <div key={idx} className="p-8 border border-gray-200 bg-white rounded-lg hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <section className="mb-16 p-8 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose AI²SARS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">No External APIs</h3>
              <p className="text-gray-700">All AI processing is completely independent with zero dependence on OpenAI or third-party services.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Offline Capable</h3>
              <p className="text-gray-700">Full offline capability after initial load. No internet required once resources are cached.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-700">Questions generated in &lt;10ms. Interview scores calculated instantly with real-time feedback.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-700">Client-side processing. No backend storage without explicit opt-in. Complete data privacy.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/ai-interview" className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Try AI Interview
            </Link>
            <Link href="/templates" className="px-8 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
              View Templates
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
