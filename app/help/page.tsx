import React from "react"
import { AlertCircle, Zap, Shield, Brain, Video, Lightbulb, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Help — AI²SARS",
  description: "Guides, FAQs and support for AI²SARS — AI-enabled Interview Simulation and ATS-compatible Resume System",
}

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-lg text-gray-600">Comprehensive guides for AI²SARS — your AI-powered interview simulator and resume builder.</p>
        </div>

        {/* Application Overview */}
        <section className="mb-12 p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">What is AI²SARS?</h2>
          <p className="text-emerald-800 mb-4">
            <strong>AI²SARS</strong> (AI-enabled Interview Simulation & ATS Resume System) is a comprehensive platform for interview preparation and resume optimization:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-emerald-800">
            <div>
              <h3 className="font-semibold mb-2">AI Interview Simulator</h3>
              <p className="text-sm">Real-time practice with AI interviewer using speech recognition, video analysis, and intelligent question selection.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resume Builder</h3>
              <p className="text-sm">Create ATS-friendly resumes with professional templates and real-time preview.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Intelligent Agents</h3>
              <p className="text-sm">Q-Learning based agents that adapt questions and evaluate performance dynamically.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">ATS Analysis</h3>
              <p className="text-sm">Optimize your resume for Applicant Tracking Systems with intelligent scoring.</p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Core Features</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors">
              <div className="flex items-start gap-3">
                <Video className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Full-Screen Interview Mode</h3>
                  <p className="text-sm text-gray-600 mt-1">Immersive interview experience with automatic fullscreen enforcement. 10-second exit timer if you leave fullscreen, automatic interview termination for security.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Powered Question Selection</h3>
                  <p className="text-sm text-gray-600 mt-1">100+ questions across 9 roles, 5 types (Technical, Behavioral, Coding, System Design, Managerial), and 3 difficulty levels. Powered by Q-Learning agent that adapts to your performance.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Speech Recognition & Live Captions</h3>
                  <p className="text-sm text-gray-600 mt-1">Real-time speech-to-text with live captions. No typing—pure voice interview experience like Google Meet.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Advanced Performance Scoring</h3>
                  <p className="text-sm text-gray-600 mt-1">6-dimension scoring: Clarity, Technical Depth, Problem-Solving, Communication, Confidence, Body Language. Real-time video analysis included.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Intelligent Reports & Feedback</h3>
                  <p className="text-sm text-gray-600 mt-1">PDF reports with role-specific recommendations, strengths analysis, and improvement areas. Interview Readiness Score & Job Fit %. Download reports instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Start Guide</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
              </div>
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
