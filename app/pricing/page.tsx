import React from 'react'
import { Home } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Pricing — AI²SARS',
  description: 'Simple, transparent pricing for AI²SARS interview simulator and resume system',
}

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'Forever free',
      description: 'Perfect for getting started',
      features: [
        'Basic resume templates',
        '3 AI interviews per month',
        'Standard scoring (4 dimensions)',
        'Community support',
        'PDF export',
      ],
      cta: 'Get Started',
      href: '/auth/register',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For serious job seekers',
      features: [
        'All Free features',
        'Unlimited AI interviews',
        'Advanced scoring (6 dimensions)',
        'Body language analysis',
        'Interview history & analytics',
        'Priority email support',
        'Custom practice plans',
      ],
      cta: 'Start Free Trial',
      href: '/auth/register?plan=pro',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      description: 'For interview masters',
      features: [
        'All Pro features',
        'AI-generated follow-up questions',
        'Industry-specific question library',
        'Live mock interview sessions',
        '1-on-1 career coaching (monthly)',
        'Video feedback from AI experts',
        'Resume optimization consultation',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      href: '/auth/register?plan=premium',
      highlighted: false,
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
            <h1 className="text-2xl font-bold text-emerald-600">Pricing</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that fits your needs. No hidden fees.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg border-2 p-8 transition-all ${
                plan.highlighted
                  ? 'border-emerald-600 bg-white shadow-xl scale-105'
                  : 'border-gray-200 bg-white hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-emerald-600">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <Link
                href={plan.href}
                className={`block text-center px-6 py-2 rounded-lg font-medium mb-6 transition-colors ${
                  plan.highlighted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="mb-16 p-8 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-700">Yes! No long-term commitment required. Cancel your subscription at any time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-700">Pro and Premium plans come with a 7-day free trial. No credit card required.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer team plans?</h3>
              <p className="text-gray-700">Yes! Contact our sales team at sales@ai2sars.example for custom team pricing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-700">We accept all major credit cards, PayPal, and bank transfers for enterprise customers.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Our team is here to help</p>
          <Link href="/contact" className="text-emerald-600 font-medium hover:text-emerald-700">
            Contact Sales →
          </Link>
        </section>
      </div>
    </main>
  )
}
