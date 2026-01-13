"use client"

import React, { useState, useRef } from "react"

const SHORT_NAME = "AIARS"
const FULL_NAME = "AI-enabled Interview Simulation and ATS-compatible Resume System"

export default function SiteBadge() {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  function handleMouseMove(e: React.MouseEvent) {
    const offsetY = 18 // small gap below cursor
    setPos({ x: e.clientX, y: e.clientY + offsetY })
  }

  return (
    <>
      <div
        className="site-badge"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onMouseMove={handleMouseMove}
        aria-label={FULL_NAME}
        // NOTE: intentionally removed `title` to avoid showing the browser-native tooltip
        style={{ position: "fixed", left: 12, top: 12, zIndex: 60 }}
      >
        <button
          className="px-3 py-1 rounded-md text-sm font-semibold bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-border"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          {SHORT_NAME}
        </button>
      </div>

      <div
        ref={tooltipRef}
        className={`site-badge-tooltip ${visible ? "visible" : ""}`}
        style={{ left: pos.x, top: pos.y }}
        role="tooltip"
      >
        {FULL_NAME}
      </div>
    </>
  )
}
