import React from 'react'
import { Home, Check } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Pricing — AI²SARS',
  description: 'AI²SARS is 100% free. No paid plans, no restrictions, no limits.',
}

export default function PricingPage() {
  const features = [
    'Unlimited AI interviews',
    'Speech recognition with live captions',
    'Video analysis with body language evaluation',
    '6-dimensional performance scoring',
    'Advanced scoring (Clarity, Technical Depth, Problem-Solving, Communication, Confidence, Body Language)',
    'Fullscreen interview mode',
    'Interview history & analytics',
    'Resume builder with ATS-friendly templates',
    'ATS compatibility analysis & optimization',
    'Real-time resume preview',
    'PDF export for resumes and reports',
    'Comprehensive interview reports',
    'Q-Learning based adaptive questions',
    '100+ interview questions across 9 roles',
    'Custom practice plans',
    'Email support',
    'Community forums',
    'Regular feature updates',
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
            <h1 className="text-2xl font-bold text-emerald-600">Pricing</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">100% Free Forever</h2>
          <p className="text-2xl text-emerald-600 font-semibold mb-8">No restrictions. No trials. No hidden costs.</p>
          <p className="text-xl text-gray-600 mb-8">
            AI²SARS is completely free. Get full access to all features without any limitations.
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-lg">
            Get Started for Free
          </Link>
        </section>

        {/* Single Plan Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="border-2 border-emerald-600 bg-white rounded-lg p-12 shadow-lg">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-6">
              Free Forever
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">AI²SARS</h3>
            <div className="mb-8">
              <span className="text-6xl font-bold text-emerald-600">$0</span>
              <span className="text-gray-600 ml-2">No credit card required</span>
            </div>
            <p className="text-gray-700 mb-8">Complete access to all features and unlimited usage</p>
            
            <Link
              href="/auth/register"
              className="block text-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors mb-12"
            >
              Start Using AI²SARS
            </Link>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-6">What's Included:</h4>
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mb-16 p-8 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is this really free?</h3>
              <p className="text-gray-700">Yes! AI²SARS is 100% free with no hidden costs, no credit card required, and no upgrade necessary. Ever.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Are there any limitations or restrictions?</h3>
              <p className="text-gray-700">No. You have unlimited access to all features including unlimited interviews, storage, and usage.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Will you charge me in the future?</h3>
              <p className="text-gray-700">We're committed to keeping AI²SARS free. We believe everyone deserves access to quality interview preparation tools.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I use all features without paying?</h3>
              <p className="text-gray-700">Absolutely! Every single feature - from AI interviews to resume building to analytics - is completely free and unlimited.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you sell my data?</h3>
              <p className="text-gray-700">Never. We respect your privacy. Your data is yours alone, and we don't share it with anyone. See our Privacy Policy for details.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do you keep it free?</h3>
              <p className="text-gray-700">We're passionate about democratizing career development. Our business model is built on making the best tools accessible to everyone.</p>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-emerald-600 mb-3">Interview Practice</h3>
              <p className="text-gray-700">Unlimited mock interviews with AI that adapts to your performance. Practice as much as you need.</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-emerald-600 mb-3">Resume Building</h3>
              <p className="text-gray-700">Create beautiful, ATS-friendly resumes using professional templates. No design skills required.</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-emerald-600 mb-3">Performance Analytics</h3>
              <p className="text-gray-700">Detailed reports on your interview performance with actionable feedback for improvement.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-12 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to master your interviews?</h2>
          <p className="text-gray-700 mb-8">Join thousands of job seekers using AI²SARS to prepare for their dream jobs.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Start for Free
            </Link>
            <Link href="/help" className="px-8 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
              Learn More
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
