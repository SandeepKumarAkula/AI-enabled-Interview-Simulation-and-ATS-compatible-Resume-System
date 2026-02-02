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
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Resume Builder</h3>
                <p className="text-sm text-gray-600">Start on the home page. Select a template from the gallery (ATS-friendly templates recommended) and click "Select Template". Fill in your details with real-time PDF preview on the right side.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Setup Interview</h3>
                <p className="text-sm text-gray-600">Navigate to "AI Interview" from the header. Upload or paste your resume. Select job role, experience level, and interview types (Technical, Behavioral, Coding, System Design, Managerial).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Test Camera & Audio</h3>
                <p className="text-sm text-gray-600">Enable camera and test microphone by saying "I am ready for the interview". Both must show status before proceeding.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Start Interview</h3>
                <p className="text-sm text-gray-600">Click "Begin Interview". Screen enters fullscreen automatically. Interview duration is 15 minutes. Cannot navigate away—must complete or click "End Interview".</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">5</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Answer Questions</h3>
                <p className="text-sm text-gray-600">Click microphone icon to answer. Speak your response. Live captions appear as you speak (like Google Meet). Click "Submit Answer" when done.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">6</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get Report</h3>
                <p className="text-sm text-gray-600">After interview completes or time expires, comprehensive report shows with scores, strengths, improvements, and role match %. Download as PDF instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interview Room Details */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Interview Room Features</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">📺 Full-Screen Mode</h3>
                <p className="text-sm text-blue-800">Interview automatically enters fullscreen. No header, no navigation—just you and the interviewer. If you exit fullscreen, 10-second countdown timer appears. Click "Return to Fullscreen" or wait for auto-exit.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">🎥 Picture-in-Picture Layout</h3>
                <p className="text-sm text-blue-800">Click to switch between camera view (main) and AI interviewer view. Your camera shows in bottom-right as small preview. No access to other tabs or pages during interview.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">⏱️ Real-Time Timers</h3>
                <p className="text-sm text-blue-800">Interview duration timer (top-left). Recording timer shows while speaking. Live captions display your transcribed speech in real-time below the question.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">🎙️ Voice Control</h3>
                <p className="text-sm text-blue-800">AI reads questions aloud. Automatic speech recognition captures your answers. No keyboard input—pure conversation mode.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">What happens if I exit fullscreen during interview?</summary>
              <div className="mt-3 text-gray-700 text-sm">A 10-second countdown timer appears warning you the interview will auto-end. Click "Return to Fullscreen" button to resume, or wait for the timer to expire and interview will automatically terminate with your current score.</div>
            </details>

            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">Can I navigate to other tabs during interview?</summary>
              <div className="mt-3 text-gray-700 text-sm">No. The header is hidden and all navigation is blocked during the interview. You'll see a 🔒 lock warning if you try to use back button or keyboard shortcuts. To exit, click "End Interview" button. Switching tabs automatically stops recording and pauses the interview.</div>
            </details>

            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">What browsers are supported?</summary>
              <div className="mt-3 text-gray-700 text-sm">Chrome, Edge, Firefox, and Safari (desktop versions). Mobile browsers have limited fullscreen support. Requires: modern browser with Web Speech API, MediaDevices API, and Fullscreen API support.</div>
            </details>

            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">Are the templates really ATS-friendly?</summary>
              <div className="mt-3 text-gray-700 text-sm">Yes. All templates are optimized for Applicant Tracking Systems. They use standard HTML structure, clear fonts, and proper spacing. "ATS-Friendly" templates have minimal graphics. Test with the ATS Analysis tool to verify your resume's ATS score.</div>
            </details>

            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">How are interview questions selected?</summary>
              <div className="mt-3 text-gray-700 text-sm">Questions are selected using Q-Learning AI. The agent analyzes your role, experience level, interview type preferences, and previous answers. It has access to 100+ questions across 9 roles, 5 types, and 3 difficulty levels. Questions adapt based on your performance.</div>
            </details>

            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">What do the 6 scoring dimensions mean?</summary>
              <div className="mt-3 text-gray-700 text-sm">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Clarity:</strong> How clear and articulate is your speech?</li>
                  <li><strong>Technical Depth:</strong> How deep is your technical knowledge?</li>
                  <li><strong>Problem-Solving:</strong> Can you think critically and solve issues?</li>
                  <li><strong>Communication:</strong> How well do you explain your thoughts?</li>
                  <li><strong>Confidence:</strong> How confident does your delivery sound?</li>
                  <li><strong>Body Language:</strong> Evaluated from video (posture, eye contact, hand gestures)</li>
                </ul>
              </div>
            </details>

            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">Can I download my interview report?</summary>
              <div className="mt-3 text-gray-700 text-sm">Yes! After interview completes, a comprehensive PDF report is available. Click "Download PDF" button. Report includes scores, strengths, improvements, topics covered, transcript highlights, role suitability score, and interview readiness score.</div>
            </details>

            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">Is my data stored or shared?</summary>
              <div className="mt-3 text-gray-700 text-sm">All data is processed client-side. No backend storage without explicit opt-in. Interview results and reports are generated locally in your browser. We do not share your personal information with third parties.</div>
            </details>

            <details className="p-4 border border-gray-200 rounded-lg group cursor-pointer hover:border-emerald-300 transition-colors">
              <summary className="font-semibold text-gray-900 group-open:text-emerald-600">Why don't I see the AI character during full-screen interview?</summary>
              <div className="mt-3 text-gray-700 text-sm">In full-screen interview room, the AI character appears as an animated icon in the corner (bottom-right by default). Click to switch between camera view and AI view. In AI view, you see the animated interviewer and your camera shows as small preview. This mimics video call interfaces.</div>
            </details>
          </div>
        </section>

        {/* Application Sections */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Application Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Home</h3>
              <p className="text-sm text-gray-600">Overview of features. Quick links to Resume Builder and AI Interview.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📄 Resume Builder</h3>
              <p className="text-sm text-gray-600">Create and customize resumes with templates. Real-time preview and PDF export.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">AI Interview</h3>
              <p className="text-sm text-gray-600">Full-screen interview simulator. Speech recognition, video analysis, adaptive questions.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Intelligent Agent</h3>
              <p className="text-sm text-gray-600">Q-Learning based agent trainer. View agent performance and training data.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">ATS Analysis</h3>
              <p className="text-sm text-gray-600">Analyze resumes for ATS compatibility. Get optimization recommendations.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Help</h3>
              <p className="text-sm text-gray-600">This page. FAQs, guides, and support information.</p>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Details</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>No External APIs:</strong> All AI processing is completely independent. Zero dependence on OpenAI or third-party services.</p>
            <p><strong>Performance:</strong> Questions generated in &lt;10ms. Interview scores calculated instantly. Full offline capability after initial load.</p>
            <p><strong>Speech Recognition:</strong> Uses browser's Web Speech API. Continuous speech recognition with interim results for live captions.</p>
            <p><strong>Video Analysis:</strong> Real-time video processing for body language analysis. MediaPipe for pose detection and hand tracking.</p>
            <p><strong>Q-Learning Agent:</strong> 100+ interview questions. 87,846-state Q-table for intelligent question selection. Adapts difficulty based on performance.</p>
            <p><strong>Data Handling:</strong> Client-side processing. No backend storage by default. Optional PDF export for record-keeping.</p>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Camera Not Working</h3>
              <p className="text-sm text-red-800">Check browser permissions. Chrome: Settings → Privacy → Camera. Make sure another app isn't using the camera. Try a different browser. Refresh page.</p>
            </div>
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Microphone Not Detected</h3>
              <p className="text-sm text-red-800">Verify browser microphone permission. Test audio button should say "Mic OK". Speak clearly near the microphone. Check system volume. Refresh and try again.</p>
            </div>
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Speech Recognition Not Working</h3>
              <p className="text-sm text-red-800">Not supported in all browsers—Chrome recommended. Check for browser updates. Ensure microphone permission is granted. Speak clearly and loudly.</p>
            </div>
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Fullscreen Not Entering</h3>
              <p className="text-sm text-red-800">Some browsers require user interaction. Fullscreen may be disabled in browser settings. Check if browser fullscreen permission is granted. Try different browser.</p>
            </div>
          </div>
        </section>

        {/* Support Contact */}
        <section className="mb-12 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-4">Can't find the answer? Contact our support team:</p>
          <div className="space-y-3">
            <p>
              <strong>Email:</strong> <a href="mailto:support@ai2sars.example" className="text-emerald-600 font-semibold hover:underline">support@ai2sars.example</a>
            </p>
            <p>
              <strong>Response time:</strong> 1-2 business days
            </p>
            <p>
              <strong>Tip:</strong> Check our <a href="#faq" className="text-emerald-600 font-semibold hover:underline">FAQ section above</a> first—you might find your answer!
            </p>
          </div>
        </section>

        {/* Footer Note */}
        <section className="text-center pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>AI²SARS v0.1.0</strong> — AI-enabled Interview Simulation & ATS Resume System
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Built with Next.js • Powered by Q-Learning AI • Speech Recognition enabled
          </p>
        </section>
      </div>
    </main>
  )
}
