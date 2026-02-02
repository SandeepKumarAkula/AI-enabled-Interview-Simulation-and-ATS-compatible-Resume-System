import React from 'react'
import { Mail, MessageCircle, Phone, Home } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Help & Support — AI²SARS',
  description: 'Comprehensive guides, FAQs, and support for AI²SARS',
}

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-emerald-600">Help Center</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AI²SARS Help Center</h2>
          <p className="text-lg text-gray-600 mb-8">Find answers to your questions about AI²SARS</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#getting-started" className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">Getting Started</a>
            <a href="#faq" className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium">FAQ</a>
            <a href="#troubleshooting" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">Troubleshooting</a>
          </div>
        </section>

        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border border-emerald-200 bg-emerald-50 rounded-lg">
            <Mail className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600 mb-3">Get help from our team</p>
            <a href="mailto:support@ai2sars.example" className="text-emerald-600 text-sm font-medium">support@ai2sars.example →</a>
          </div>
          <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
            <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-sm text-gray-600 mb-3">Common questions</p>
            <a href="#faq" className="text-blue-600 text-sm font-medium">View FAQ →</a>
          </div>
          <div className="p-6 border border-purple-200 bg-purple-50 rounded-lg">
            <Phone className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
            <p className="text-sm text-gray-600 mb-3">1-2 business days</p>
          </div>
        </section>

        <section className="mb-16 p-8 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What is AI²SARS?</h2>
          <p className="text-gray-700">AI²SARS is an AI-enabled Interview Simulation & ATS Resume System with speech recognition, Q-Learning agents, and real-time performance scoring.</p>
        </section>

        <section id="getting-started" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Getting Started (6 Steps)</h2>
          <div className="space-y-3">
            {[
              { num: 1, title: 'Resume Builder', desc: 'Select a template and fill in your details with real-time PDF preview' },
              { num: 2, title: 'Setup Interview', desc: 'Upload resume, select job role, experience level, and interview types' },
              { num: 3, title: 'Test Camera & Audio', desc: 'Enable camera and test microphone before starting' },
              { num: 4, title: 'Start Interview', desc: 'Click Begin Interview - screen enters fullscreen automatically' },
              { num: 5, title: 'Answer Questions', desc: 'Click microphone to answer, speak your response clearly' },
              { num: 6, title: 'Get Report', desc: 'Receive comprehensive report with scores and recommendations' },
            ].map(step => (
              <div key={step.num} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{step.num}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              { q: 'What happens if I exit fullscreen?', a: 'A 10-second timer appears. Click to return or it auto-exits.' },
              { q: 'Can I navigate to other tabs?', a: 'No. Navigation is blocked during the interview for security.' },
              { q: 'What browsers are supported?', a: 'Chrome, Edge, Firefox, Safari (desktop versions).' },
              { q: 'Are templates ATS-friendly?', a: 'Yes, optimized for Applicant Tracking Systems.' },
              { q: 'How are questions selected?', a: 'Q-Learning AI adapts questions to your performance.' },
              { q: 'What are the 6 scoring dimensions?', a: 'Clarity, Technical Depth, Problem-Solving, Communication, Confidence, Body Language.' },
              { q: 'Can I download my report?', a: 'Yes, as PDF after interview completion.' },
              { q: 'Is my data shared?', a: 'No, client-side processing with no third-party sharing.' },
            ].map((faq, idx) => (
              <details key={idx} className="p-4 border border-gray-200 rounded-lg bg-white">
                <summary className="font-semibold text-gray-900 cursor-pointer">{faq.q}</summary>
                <div className="mt-2 text-sm text-gray-700">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section id="troubleshooting" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Troubleshooting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Camera Not Working', desc: 'Check browser permissions. Try different browser.' },
              { title: 'Microphone Not Detected', desc: 'Verify browser permission. Check system volume.' },
              { title: 'Speech Recognition Failing', desc: 'Chrome recommended. Update browser.' },
              { title: 'Fullscreen Not Working', desc: 'Check browser settings for fullscreen permission.' },
            ].map((issue, idx) => (
              <div key={idx} className="p-4 border-l-4 border-red-400 bg-red-50 rounded">
                <h3 className="font-semibold text-red-900">{issue.title}</h3>
                <p className="text-sm text-red-800 mt-1">{issue.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 p-8 bg-gradient-to-r from-emerald-600 to-sky-600 text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="mb-6">Contact our support team for assistance.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <a href="mailto:support@ai2sars.example" className="text-emerald-100 hover:text-white underline">support@ai2sars.example</a>
              <p className="text-sm text-emerald-100 mt-2">Response: 1-2 business days</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Pro Tip</h3>
              <p className="text-emerald-100 text-sm">Check FAQ first—you might find your answer instantly!</p>
            </div>
          </div>
        </section>

        <section className="text-center pt-12 border-t border-gray-200">
          <p className="text-sm text-gray-600">AI²SARS v1.0.0 — AI Interview Simulator & ATS Resume System</p>
          <p className="text-xs text-gray-500 mt-2">Built with Next.js • Q-Learning AI • Speech Recognition</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/" className="text-emerald-600 text-sm font-medium">Home</Link>
            <span className="text-gray-300">•</span>
            <Link href="#" className="text-emerald-600 text-sm font-medium">Privacy</Link>
            <span className="text-gray-300">•</span>
            <Link href="#" className="text-emerald-600 text-sm font-medium">Terms</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
