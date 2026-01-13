'use client'

import React, { useState, useCallback, useEffect } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type'], duration = 3000) => {
    const id = Date.now().toString() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id}
          toast={toast}
          removeToast={removeToast}
        />
      ))}
    </div>
  )
}

function ToastItem({ 
  toast, 
  removeToast 
}: { 
  toast: Toast
  removeToast: (id: string) => void 
}) {
  const [isLeaving, setIsLeaving] = useState(false)

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      removeToast(toast.id)
    }, 300)
  }

  return (
    <div
      className={`
        pointer-events-auto
        px-6 py-4 rounded-lg shadow-2xl border-l-4 flex items-center justify-between gap-4 min-w-80
        transition-all duration-300 transform
        ${isLeaving ? 'animate-slide-out opacity-0' : 'animate-slide-in opacity-100'}
        ${
          toast.type === 'success'
            ? 'bg-green-50 border-green-500 text-green-900'
            : toast.type === 'error'
              ? 'bg-red-50 border-red-500 text-red-900'
              : toast.type === 'warning'
                ? 'bg-yellow-50 border-yellow-500 text-yellow-900'
                : 'bg-blue-50 border-blue-500 text-blue-900'
        }
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl flex-shrink-0">
          {toast.type === 'success' && '✅'}
          {toast.type === 'error' && '❌'}
          {toast.type === 'warning' && '⚠️'}
          {toast.type === 'info' && 'ℹ️'}
        </span>
        <span className="font-medium text-sm leading-5">{toast.message}</span>
      </div>
      <button
        onClick={handleClose}
        className="text-2xl font-bold hover:opacity-60 active:opacity-40 transition-opacity flex-shrink-0 cursor-pointer ml-2"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  )
}
