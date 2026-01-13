"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"

interface LoadingContextValue {
  startTask: (label?: string) => string
  stopTask: (id?: string) => void
  withGlobalLoading: <T>(fn: () => Promise<T>, label?: string) => Promise<T>
  isLoading: boolean
  labels: string[]
}

interface LoadingProviderProps {
  children: React.ReactNode
}

interface Task {
  id: string
  label: string
  startedAt: number
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined)

const generateId = () => `ld-${Math.random().toString(16).slice(2)}-${Date.now()}`

function GlobalLoadingOverlay({
  visible,
  fading,
  progress,
  label,
  pulse,
}: {
  visible: boolean
  fading: boolean
  progress: number
  label: string
  pulse: boolean
}) {
  if (typeof window === "undefined" || !visible) return null

  return createPortal(
    <div className={`global-loader ${fading ? "global-loader--fade" : ""}`} aria-live="polite" aria-busy={visible}>
      <div className="global-loader__backdrop" />
      <div className="global-loader__card">
        <div className="global-loader__halo" />
        <div className={`global-loader__orb ${pulse ? "is-pulsing" : ""}`}>
          <div className="global-loader__orbit global-loader__orbit--one" />
          <div className="global-loader__orbit global-loader__orbit--two" />
          <div className="global-loader__core" />
        </div>
        <div className="global-loader__bar">
          <div className="global-loader__bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
          <div className="global-loader__bar-sheen" />
        </div>
        <div className="global-loader__dots">
          {[0, 1, 2].map(i => (
            <span key={i} style={{ animationDelay: `${i * 120}ms` }} className="global-loader__dot" />
          ))}
        </div>
        <div className="global-loader__label">
          <span>{label || "Preparing"}</span>
          <span className="global-loader__percent">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const progressTimer = useRef<NodeJS.Timeout | null>(null)
  const hideTimer = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const previousPath = useRef<string | null>(null)

  const stopTimers = () => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const driveProgress = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    progressTimer.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 86) return prev
        const bump = Math.max(0.5, 6 - prev / 15)
        return Math.min(86, prev + bump)
      })
    }, 160)
  }, [])

  const startTask = useCallback((label = "Working") => {
    const id = generateId()
    setTasks(prev => [...prev, { id, label, startedAt: Date.now() }])
    setVisible(true)
    setFading(false)
    driveProgress()
    return id
  }, [driveProgress])

  const stopTask = useCallback((id?: string) => {
    setTasks(prev => {
      if (!id) return []
      return prev.filter(task => task.id !== id)
    })
  }, [])

  // When tasks list changes, handle completion/visibility
  useEffect(() => {
    if (tasks.length === 0) {
      setProgress(100)
      hideTimer.current = setTimeout(() => {
        setFading(true)
        stopTimers()
        setTimeout(() => {
          setVisible(false)
          setProgress(0)
          setFading(false)
        }, 220)
      }, 180)
    } else {
      setVisible(true)
      driveProgress()
    }
    return () => stopTimers()
  }, [tasks.length, driveProgress])

  // Path change loader (lightweight flash on navigation)
  useEffect(() => {
    if (previousPath.current && previousPath.current !== pathname) {
      const navTask = startTask("Navigating")
      setTimeout(() => stopTask(navTask), 450)
    }
    previousPath.current = pathname
  }, [pathname, startTask, stopTask])

  const withGlobalLoading = useCallback(
    async <T,>(fn: () => Promise<T>, label = "Working") => {
      const id = startTask(label)
      try {
        return await fn()
      } finally {
        stopTask(id)
      }
    },
    [startTask, stopTask]
  )

  const contextValue = useMemo<LoadingContextValue>(
    () => ({
      startTask,
      stopTask,
      withGlobalLoading,
      isLoading: tasks.length > 0,
      labels: tasks.map(t => t.label),
    }),
    [startTask, stopTask, withGlobalLoading, tasks]
  )

  const activeLabel = tasks[tasks.length - 1]?.label || "Working"

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      <GlobalLoadingOverlay
        visible={visible}
        fading={fading}
        progress={progress}
        label={activeLabel}
        pulse={tasks.length > 1}
      />
    </LoadingContext.Provider>
  )
}

export function useGlobalLoading() {
  const ctx = useContext(LoadingContext)
  if (!ctx) throw new Error("useGlobalLoading must be used within LoadingProvider")
  return ctx
}
