import React from 'react'
import { Home } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — AI²SARS',
  description: 'Privacy policy and data protection information for AI²SARS',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-emerald-600">Privacy Policy</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
            <p className="text-gray-600 text-sm">Last Updated: February 2, 2026</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h3>
            <p className="text-gray-700 mb-4">
              AI²SARS ("we", "us", "our", or "Company") operates the AI²SARS website and application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2.1 Account Information</h4>
                <p className="text-gray-700">When you create an account, we collect: email address, name, password, and profile information.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2.2 Interview Data</h4>
                <p className="text-gray-700">During interviews, we collect: voice recordings, video footage, transcripts, responses, and performance metrics.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2.3 Usage Information</h4>
                <p className="text-gray-700">We automatically collect: IP address, browser type, device information, pages visited, and interaction patterns.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>To provide and maintain our service</li>
              <li>To provide personalized interview experiences</li>
              <li>To analyze your performance and provide feedback</li>
              <li>To improve our AI algorithms and features</li>
              <li>To send you service updates and announcements</li>
              <li>To respond to your requests and support inquiries</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h3>
            <p className="text-gray-700">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h3>
            <p className="text-gray-700">
              We retain your personal data for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. You can request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Third-Party Services</h3>
            <p className="text-gray-700">
              We do not share your personal data with third parties without your explicit consent. We may share aggregated, anonymized data for research and improvement purposes.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to delete your data</li>
              <li>Right to export your data</li>
              <li>Right to opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies</h3>
            <p className="text-gray-700">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h3>
            <p className="text-gray-700">
              Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that a child under 13 has provided us with personal data, we immediately delete such information.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h3>
            <p className="text-gray-700">
              If you have any questions about this privacy policy, please contact us at: <a href="mailto:privacy@ai2sars.example" className="text-emerald-600 hover:text-emerald-700">privacy@ai2sars.example</a>
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-gray-700">
            Your privacy is important to us. If you have concerns about our privacy practices, please reach out to our privacy team. We're committed to being transparent about how we collect and use your data.
          </p>
        </div>
      </div>
    </main>
  )
}
