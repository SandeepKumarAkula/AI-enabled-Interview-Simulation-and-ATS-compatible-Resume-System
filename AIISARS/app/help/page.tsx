import React from "react"

export const metadata = {
  title: "Help — AI²SARS",
  description: "Guides, FAQs and support for AI²SARS — AI-enabled Interview Simulation and ATS-compatible Resume System",
}

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-4xl font-bold text-[#222222] mb-4">Help & Support</h1>
        <p className="text-lg text-[#666666] mb-8">Find quick guides, frequently asked questions, and ways to contact our support team.</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">Quick Start</h2>
          <ol className="list-decimal list-inside space-y-2 text-[#444444]">
            <li>Create or edit your resume using the resume builder.</li>
            <li>Choose a template from the gallery and click "Select".</li>
            <li>Fill in your details, preview on the right, and export as PDF when ready.</li>
            <li>Use the AI interview simulation from the builder to practice answers (coming soon).</li>
          </ol>
        </section>

        <section id="faq" className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="p-4 border border-[#e6e6e6] rounded">
              <summary className="font-medium">How do I download my resume as a PDF?</summary>
              <div className="mt-2 text-[#666666]">After selecting a template and editing your resume, click the export button in the builder to download a print-ready PDF.</div>
            </details>

            <details className="p-4 border border-[#e6e6e6] rounded">
              <summary className="font-medium">Are the templates ATS-friendly?</summary>
              <div className="mt-2 text-[#666666]">Yes — the templates labeled "ATS-Friendly" and many of the other templates are structured to be parsed well by Applicant Tracking Systems.</div>
            </details>

            <details className="p-4 border border-[#e6e6e6] rounded">
              <summary className="font-medium">Where can I get help with interview simulations?</summary>
              <div className="mt-2 text-[#666666]">The interview simulation feature is accessible from the resume builder (look for the Interview or Practice button). It will guide you with typical questions and tips.</div>
            </details>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">Resources</h2>
          <ul className="space-y-2 text-[#444444]">
            <li><a href="#" className="text-[#2ecc71] hover:underline">Template best practices</a></li>
            <li><a href="#" className="text-[#2ecc71] hover:underline">ATS optimization tips</a></li>
            <li><a href="#" className="text-[#2ecc71] hover:underline">Resume writing guide</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Support</h2>
          <p className="text-[#666666] mb-4">If you need more help, email us at <a href="mailto:support@ai2sars.example" className="text-[#2ecc71]">support@ai2sars.example</a> or use the contact form on our website.</p>
          <p className="text-sm text-[#999999]">Response time: typically within 1-2 business days.</p>
        </section>
      </div>
    </main>
  )
}
