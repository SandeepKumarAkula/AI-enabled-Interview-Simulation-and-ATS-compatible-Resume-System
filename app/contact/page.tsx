import React from 'react'
import { Home, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Us — AI²SARS',
  description: 'Get in touch with AI²SARS team for support, partnerships, and inquiries',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-emerald-600">Contact Us</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600">Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Email */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Reach out via email for general inquiries and support.</p>
            <a href="mailto:support@ai2sars.example" className="text-emerald-600 font-medium hover:text-emerald-700">
              support@ai2sars.example
            </a>
          </div>

          {/* Phone */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600 mb-4">Call us for urgent matters or phone support.</p>
            <a href="tel:+1-800-AISARS1" className="text-blue-600 font-medium hover:text-blue-700">
              +1-800-AISARS1
            </a>
          </div>

          {/* Address */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Office</h3>
            <p className="text-gray-600">123 Tech Street<br/>Innovation Valley, CA 94025<br/>United States</p>
          </div>
        </div>

        {/* Contact Form */}
        <section className="mb-16 p-8 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="How can we help?"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">Message</label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="Tell us more..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Send Message
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4">We'll get back to you within 24 hours during business days.</p>
        </section>

        {/* Response Times */}
        <section className="p-8 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Response Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Support Requests</h3>
              <p className="text-gray-700">1-2 business days</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Sales Inquiries</h3>
              <p className="text-gray-700">Same business day</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bug Reports</h3>
              <p className="text-gray-700">2-4 hours</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
