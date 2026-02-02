import React from 'react'
import { Home } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — AI²SARS',
  description: 'Terms and conditions for using AI²SARS',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-emerald-600">Terms of Service</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h2>
            <p className="text-gray-600 text-sm">Last Updated: February 2, 2026</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h3>
            <p className="text-gray-700">
              By accessing and using AI²SARS, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Use License</h3>
            <p className="text-gray-700 mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on AI²SARS for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on AI²SARS</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Attempt to gain unauthorized access to any portion or feature of the service</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Disclaimer</h3>
            <p className="text-gray-700">
              The materials on AI²SARS are provided on an 'as is' basis. AI²SARS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Limitations</h3>
            <p className="text-gray-700">
              In no event shall AI²SARS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI²SARS.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Accuracy of Materials</h3>
            <p className="text-gray-700">
              The materials appearing on AI²SARS could include technical, typographical, or photographic errors. AI²SARS does not warrant that any of the materials on its website are accurate, complete, or current. AI²SARS may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Links</h3>
            <p className="text-gray-700">
              AI²SARS has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AI²SARS of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Modifications</h3>
            <p className="text-gray-700">
              AI²SARS may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">8. User Accounts</h3>
            <p className="text-gray-700">
              When you create an account with AI²SARS, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Prohibited Conduct</h3>
            <p className="text-gray-700 mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe any intellectual property rights</li>
              <li>Harass or cause distress or inconvenience to any person</li>
              <li>Transmit obscene or offensive content</li>
              <li>Disrupt the normal flow of dialogue within our website</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Intellectual Property Rights</h3>
            <p className="text-gray-700">
              All content included in AI²SARS, such as text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the property of AI²SARS or its content suppliers and protected by international copyright laws.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">11. Termination</h3>
            <p className="text-gray-700">
              We reserve the right to terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including if you breach the Terms.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h3>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at: <a href="mailto:legal@ai2sars.example" className="text-emerald-600 hover:text-emerald-700">legal@ai2sars.example</a>
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            These terms form the entire agreement between you and AI²SARS regarding your use of the service. If any provision is found to be unenforceable, the remaining provisions will continue in full force and effect.
          </p>
        </div>
      </div>
    </main>
  )
}
