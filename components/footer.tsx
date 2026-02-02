import React from "react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#e0e0e0] bg-white mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-[#2ecc71] flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="font-bold text-[#222222]">AI²SARS</span>
            </div>
            <p className="text-sm text-[#666666]">AI-enabled Interview Simulation and ATS-compatible Resume System</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#222222] mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Features</Link></li>
              <li><Link href="/#templates" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Templates</Link></li>
              <li><Link href="/pricing" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Pricing</Link></li>
              <li><Link href="/ai-interview" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">AI Interview</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#222222] mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Documentation</Link></li>
              <li><Link href="/resources" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Resources</Link></li>
              <li><Link href="/blog" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Blog</Link></li>
              <li><Link href="/help" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#222222] mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Contact Us</Link></li>
              <li><Link href="/ats" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Check ATS</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#222222] mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-[#666666] hover:text-[#2ecc71] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e0e0e0] pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-[#666666] mb-4 md:mb-0">© {currentYear} AI²SARS. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-[#666666] hover:text-[#2ecc71] transition-colors" aria-label="X (Twitter)">
              {/* Official X app logo - exact design */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.675L2.306 21.75H-0.424v-3.308l7.227-8.26L-0.424 2.25h6.514l5.106 6.675L18.244 2.25zM17.745 19.541h1.829L6.784 4.067h-1.828L17.745 19.541z" />
              </svg>
            </a>

            <a href="#" className="text-[#666666] hover:text-[#2ecc71] transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.07-.02-2.45-1.49-2.45-1.49 0-1.72 1.16-1.72 2.36v4.59h-3v-9h2.88v1.23h.04c.4-.76 1.37-1.56 2.82-1.56 3.02 0 3.58 1.99 3.58 4.58v5.75z" />
              </svg>
              <span className="sr-only">LinkedIn</span>
            </a>

            <a href="#" className="text-[#666666] hover:text-[#2ecc71] transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .5c-6.62 0-12 5.38-12 12 0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.468-2.381 1.235-3.221-.124-.303-.536-1.525.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.651.243 2.873.12 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.807 5.624-5.48 5.921.43.37.823 1.103.823 2.222 0 1.606-.014 2.902-.014 3.293 0 .32.216.694.825.576 4.765-1.587 8.2-6.087 8.2-11.386 0-6.62-5.38-12-12-12z" />
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
