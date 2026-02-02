import React from 'react'
import { Home, BookOpen, FileText, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Resources — AI²SARS',
  description: 'Learning resources, guides, and materials for AI²SARS',
}

export default function ResourcesPage() {
  const resources = [
    {
      icon: BookOpen,
      title: 'Interview Guides',
      description: 'Comprehensive guides on how to ace technical and behavioral interviews',
      items: ['Technical Interview Tips', 'Behavioral Questions', 'System Design Guide', 'Problem Solving Strategies']
    },
    {
      icon: FileText,
      title: 'Resume Templates',
      description: 'Download professional, ATS-friendly resume templates',
      items: ['Software Engineer', 'Product Manager', 'Data Scientist', 'Marketing Manager']
    },
    {
      icon: Lightbulb,
      title: 'Interview Questions',
      description: 'Bank of 100+ interview questions with answers and explanations',
      items: ['Role-specific Questions', 'Common Interview Questions', 'Follow-up Questions', 'Tricky Questions']
    },
  ]

  const categories = [
    {
      name: 'Getting Started',
      items: [
        'Introduction to AI²SARS',
        'Setting up Your Profile',
        'Your First Interview',
        'Understanding Your Score'
      ]
    },
    {
      name: 'Interview Prep',
      items: [
        'Technical Interview Preparation',
        'Behavioral Interview Guide',
        'STAR Method Explained',
        '30-Second Pitch Guide'
      ]
    },
    {
      name: 'Resume Optimization',
      items: [
        'ATS Optimization Tips',
        'Keywords and Formatting',
        'Quantifying Your Impact',
        'Cover Letter Best Practices'
      ]
    },
    {
      name: 'Career Development',
      items: [
        'Career Path Planning',
        'Skill Development Guide',
        'Networking Strategies',
        'Salary Negotiation Tips'
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
            <h1 className="text-2xl font-bold text-emerald-600">Resources</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Learning Resources</h2>
          <p className="text-xl text-gray-600">Tools, guides, and materials to help you succeed</p>
        </section>

        {/* Featured Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {resources.map((resource, idx) => {
            const IconComponent = resource.icon
            return (
              <div key={idx} className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <ul className="space-y-2">
                  {resource.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                      <a href="#" className="hover:text-emerald-600">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Resource Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse All Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <div key={idx} className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-600 mb-4">{category.name}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors text-sm block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Webinars & Events */}
        <section className="mb-16 p-8 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Webinars & Events</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Tech Interview Masterclass</h3>
                  <p className="text-sm text-gray-600 mt-1">Learn strategies to ace technical interviews</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">Feb 15</span>
              </div>
            </div>
            <div className="p-4 bg-white rounded border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Resume Optimization Workshop</h3>
                  <p className="text-sm text-gray-600 mt-1">Make your resume pass ATS screening</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">Feb 22</span>
              </div>
            </div>
            <div className="p-4 bg-white rounded border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Behavioral Questions Deep Dive</h3>
                  <p className="text-sm text-gray-600 mt-1">Master the STAR method and common questions</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">Mar 1</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="p-8 bg-purple-50 border border-purple-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Useful Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-2">Resume Parser</h3>
              <p className="text-sm text-gray-600">Upload your resume and get instant analysis</p>
              <a href="#" className="text-purple-600 text-sm font-medium mt-2 inline-block">Try Now →</a>
            </div>
            <div className="p-4 bg-white rounded border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-2">Question Generator</h3>
              <p className="text-sm text-gray-600">Generate random interview questions by role</p>
              <a href="#" className="text-purple-600 text-sm font-medium mt-2 inline-block">Try Now →</a>
            </div>
            <div className="p-4 bg-white rounded border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-2">Interview Scorecard</h3>
              <p className="text-sm text-gray-600">Track your progress across interviews</p>
              <a href="#" className="text-purple-600 text-sm font-medium mt-2 inline-block">Try Now →</a>
            </div>
            <div className="p-4 bg-white rounded border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-2">Salary Calculator</h3>
              <p className="text-sm text-gray-600">Calculate fair market salary ranges</p>
              <a href="#" className="text-purple-600 text-sm font-medium mt-2 inline-block">Try Now →</a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
