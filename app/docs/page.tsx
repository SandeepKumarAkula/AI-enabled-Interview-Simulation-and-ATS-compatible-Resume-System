import React from 'react'
import { Home } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Docs — AI²SARS',
  description: 'Documentation and API reference for AI²SARS',
}

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      items: [
        { name: 'Introduction', desc: 'Learn what AI²SARS can do' },
        { name: 'Quick Start', desc: 'Get up and running in 5 minutes' },
        { name: 'Installation', desc: 'Install and configure AI²SARS' },
        { name: 'First Interview', desc: 'Run your first AI interview' },
      ]
    },
    {
      title: 'Features',
      items: [
        { name: 'Resume Builder', desc: 'Create ATS-friendly resumes' },
        { name: 'AI Interview', desc: 'Practice with adaptive questions' },
        { name: 'Scoring System', desc: 'Understand the 6-dimension scoring' },
        { name: 'Video Analysis', desc: 'Body language evaluation' },
      ]
    },
    {
      title: 'API Reference',
      items: [
        { name: 'Authentication', desc: 'JWT and session management' },
        { name: 'Resumes API', desc: 'Create, read, update resumes' },
        { name: 'Interviews API', desc: 'Manage interview sessions' },
        { name: 'Q-Learning Agent', desc: 'Question generation API' },
      ]
    },
    {
      title: 'Advanced',
      items: [
        { name: 'Custom Questions', desc: 'Add your own questions' },
        { name: 'Integrations', desc: 'Connect with external services' },
        { name: 'Analytics', desc: 'Track performance metrics' },
        { name: 'Troubleshooting', desc: 'Common issues and solutions' },
      ]
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
            <h1 className="text-2xl font-bold text-emerald-600">Documentation</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h2>
          <p className="text-xl text-gray-600">Complete guides, API reference, and tutorials</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, idx) => (
            <div key={idx} className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-600 mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.items.map((item, i) => (
                  <li key={i} className="border-b border-gray-200 pb-4 last:border-0">
                    <a href="#" className="font-medium text-gray-900 hover:text-emerald-600 transition-colors block mb-1">
                      {item.name}
                    </a>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="mb-16 p-8 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded border border-blue-200">
              <code className="text-emerald-600 font-medium">POST /api/auth/register</code>
              <p className="text-sm text-gray-600 mt-1">Register a new user account</p>
            </div>
            <div className="p-4 bg-white rounded border border-blue-200">
              <code className="text-emerald-600 font-medium">POST /api/interviews/create</code>
              <p className="text-sm text-gray-600 mt-1">Create a new interview session</p>
            </div>
            <div className="p-4 bg-white rounded border border-blue-200">
              <code className="text-emerald-600 font-medium">GET /api/resumes</code>
              <p className="text-sm text-gray-600 mt-1">Retrieve all user resumes</p>
            </div>
            <div className="p-4 bg-white rounded border border-blue-200">
              <code className="text-emerald-600 font-medium">POST /api/analyze-ats</code>
              <p className="text-sm text-gray-600 mt-1">Analyze resume ATS compatibility</p>
            </div>
          </div>
        </section>

        <section className="mb-16 p-8 bg-purple-50 border border-purple-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <p className="text-gray-700 mb-6">Here's how to get started with the AI²SARS API:</p>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto font-mono text-sm">
            <pre>{`// Register a new user
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'secure-password'
  })
});

// Create an interview
const interview = await fetch('/api/interviews/create', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer token' },
  body: JSON.stringify({
    role: 'Software Engineer',
    difficulty: 'intermediate',
    duration: 30
  })
});`}</pre>
          </div>
        </section>

        <section className="mb-16 p-8 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-4">Can't find what you're looking for? We're here to help!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/help" className="p-4 bg-white rounded border border-emerald-200 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-1">Help Center</h3>
              <p className="text-sm text-gray-600">FAQs and troubleshooting guides</p>
            </Link>
            <Link href="/contact" className="p-4 bg-white rounded border border-emerald-200 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-1">Contact Support</h3>
              <p className="text-sm text-gray-600">Reach out to our team</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
