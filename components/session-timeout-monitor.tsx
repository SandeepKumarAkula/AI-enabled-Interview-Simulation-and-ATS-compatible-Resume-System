"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SessionTimeoutMonitor() {
  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const router = useRouter()
  const sessionExpiryRef = useRef<number | null>(null)
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
      warningTimerRef.current = null
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
  }, [])

  const handleLogout = useCallback(async () => {
    clearTimers()
    setShowWarning(false)
    
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    
    // Clear storage
    try {
      if (typeof window !== 'undefined') {
        if (window.localStorage) {
          window.localStorage.setItem('authLoggedOut', String(Date.now()))
          window.localStorage.removeItem('authPending')
          window.localStorage.removeItem('sessionExpiry')
        }
        if (window.sessionStorage) {
          window.sessionStorage.clear()
        }
      }
    } catch (e) {
      console.error('Error clearing storage:', e)
    }
    
    window.dispatchEvent(new Event('auth-changed'))
    window.location.href = '/auth/login?reason=session-ended'
  }, [clearTimers])

  const extendSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/extend-session', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        const newExpiry = data.sessionExpiry
        
        // Store new expiry time
        sessionExpiryRef.current = newExpiry
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('sessionExpiry', String(newExpiry))
        }

        setShowWarning(false)
        clearTimers()
        
        // Schedule new warning
        scheduleWarning(newExpiry)
      } else {
        // If extend fails, logout
        await handleLogout()
      }
    } catch (error) {
      console.error('Failed to extend session:', error)
      await handleLogout()
    }
  }, [clearTimers, handleLogout])

  const scheduleWarning = useCallback((expiryTime: number) => {
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = expiryTime - now
    const timeUntilWarning = timeUntilExpiry - (5 * 60) // 5 minutes before expiry

    if (timeUntilWarning > 0) {
      // Schedule warning 5 minutes before expiry
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true)
        setTimeRemaining(5 * 60) // 5 minutes in seconds
        
        // Start countdown
        countdownTimerRef.current = setInterval(() => {
          setTimeRemaining(prev => {
            const newTime = prev - 1
            if (newTime <= 0) {
              // Session expired, logout
              handleLogout()
              return 0
            }
            return newTime
          })
        }, 1000)
      }, timeUntilWarning * 1000)
    } else if (timeUntilExpiry > 0) {
      // Less than 5 minutes remaining, show warning immediately
      setShowWarning(true)
      setTimeRemaining(timeUntilExpiry)
      
      countdownTimerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1
          if (newTime <= 0) {
            handleLogout()
            return 0
          }
          return newTime
        })
      }, 1000)
    } else {
      // Session already expired
      handleLogout()
    }
  }, [handleLogout])

  useEffect(() => {
    // Check for existing session expiry
    const checkSession = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedExpiry = window.localStorage.getItem('sessionExpiry')
          if (storedExpiry) {
            const expiry = parseInt(storedExpiry, 10)
            sessionExpiryRef.current = expiry
            scheduleWarning(expiry)
          }
        }
      } catch (e) {
        console.error('Error checking session:', e)
      }
    }

    checkSession()

    // Listen for login events to set new session expiry
    const handleAuthChanged = () => {
      setTimeout(() => {
        checkSession()
      }, 1000)
    }

    window.addEventListener('auth-changed', handleAuthChanged)
    window.addEventListener('storage', checkSession)

    return () => {
      clearTimers()
      window.removeEventListener('auth-changed', handleAuthChanged)
      window.removeEventListener('storage', checkSession)
    }
  }, [scheduleWarning, clearTimers])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 p-4">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            Session Expiring Soon
          </h2>

          {/* Message */}
          <p className="mb-4 text-gray-600">
            Your session will expire in{' '}
            <span className="font-bold text-yellow-600">{formatTime(timeRemaining)}</span>.
            Would you like to continue your session?
          </p>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={handleLogout}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              End Session
            </button>
            <button
              onClick={extendSession}
              className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-sky-600 px-4 py-3 text-sm font-medium text-white hover:from-emerald-700 hover:to-sky-700 transition-colors"
            >
              Continue Session
            </button>
          </div>

          {/* Footer note */}
          <p className="mt-4 text-xs text-gray-500">
            Clicking "Continue Session" will extend your session for another hour.
          </p>
        </div>
      </div>
    </div>
  )
}
