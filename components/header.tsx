"use client"

import Link from "next/link"
import React, { useState } from "react"

export default function Header() {
  const [navTooltipVisible, setNavTooltipVisible] = useState(false)
  const FULL_NAME = "AI-enabled Interview Simulation and ATS-compatible Resume System"

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#eaeaea]">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 relative"
            onMouseEnter={() => setNavTooltipVisible(true)}
            onMouseLeave={() => setNavTooltipVisible(false)}
          >
            {/* Tab favicon replica - exact same SVG with green box background */}
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#2ecc71' }}>
              <img
                src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='75' font-size='80' font-weight='bold' text-anchor='middle' fill='white'>A</text></svg>"
                alt="AI²SARS Logo"
                className="w-6 h-6"
              />
            </div>
            
            <span className="text-lg font-semibold text-[#222222]">AI²SARS</span>

            <div
              className={`nav-badge-tooltip ${navTooltipVisible ? "visible" : ""}`}
              role="tooltip"
            >
              {FULL_NAME}
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[#666666] hover:text-[#222222] transition-colors text-sm">Home</Link>
          <Link href="/#templates" className="text-[#666666] hover:text-[#222222] transition-colors text-sm">Templates</Link>
          <Link href="/ai-interview" className="text-[#666666] hover:text-[#222222] transition-colors text-sm">AI Interview</Link>
          <Link href="/ats" className="text-[#666666] hover:text-[#222222] transition-colors text-sm">Check ATS</Link>
          <Link href="/help" className="text-[#666666] hover:text-[#222222] transition-colors text-sm">Help</Link>
        </nav>
      </div>
    </header>
  )
}
