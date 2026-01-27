import { Suspense } from 'react'
import ResetClient from './reset-client'

export const dynamic = 'force-dynamic'

export default function ResetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetClient />
    </Suspense>
  )
}
