"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchWithAuth } from "@/lib/clientAuth"
import { usePathname } from "next/navigation"

export default function Header() {
  const [navTooltipVisible, setNavTooltipVisible] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const FULL_NAME = "AI-enabled Interview Simulation and ATS-compatible Resume System"

  async function refreshAuthState() {
    try {
      const r = await fetchWithAuth('/api/resumes')
      if (r.ok) {
        setIsLoggedIn(true)
        const adminCheck = await fetchWithAuth('/api/admin/users')
        setIsAdmin(adminCheck.ok)
      } else {
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    } catch {
      setIsLoggedIn(false)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    refreshAuthState()

    const handler = () => refreshAuthState()
    window.addEventListener('auth-changed', handler)
    window.addEventListener('focus', handler)
    return () => {
      window.removeEventListener('auth-changed', handler)
      window.removeEventListener('focus', handler)
    }
  }, [pathname])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    window.dispatchEvent(new Event('auth-changed'))
    router.replace('/auth/login')
  }

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
          {isLoggedIn && (
            <>
              <Link href="/dashboard/resumes" className="text-[#666666] hover:text-[#222222] transition-colors text-sm">My Resumes</Link>
              <Link href="/dashboard/interviews" className="text-[#666666] hover:text-[#222222] transition-colors text-sm">My Interviews</Link>
              {isAdmin && <Link href="/admin" className="text-green-600 hover:text-green-700 transition-colors text-sm font-semibold">Admin</Link>}
            </>
          )}
          <Link href="/help" className="text-[#666666] hover:text-[#222222] transition-colors text-sm">Help</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700 transition-colors">Logout</button>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-green-600 hover:text-green-700 transition-colors font-medium">Login</Link>
              <Link href="/auth/register" className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
