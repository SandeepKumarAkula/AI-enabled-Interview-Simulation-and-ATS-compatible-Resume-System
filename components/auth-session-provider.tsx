"use client"

import React from 'react'
import { SessionProvider } from 'next-auth/react'

export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  // Disable the automatic session polling (we use server-side checks via /api/resumes)
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  )
}
