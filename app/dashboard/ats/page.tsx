"use client"

import React from "react"
import Link from "next/link"

export default function AtsHistoryPageRemoved() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-2xl font-bold">ATS History Removed</h1>
        <p className="mt-4 text-gray-600">The ATS history feature has been removed from this project.</p>
        <div className="mt-6">
          <Link href="/ats" className="text-green-600 hover:underline">Go to ATS Analyzer</Link>
        </div>
      </div>
    </div>
  )
}
