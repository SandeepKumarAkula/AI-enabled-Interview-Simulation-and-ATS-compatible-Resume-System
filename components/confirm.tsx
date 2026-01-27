'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

type ConfirmVariant = 'default' | 'destructive'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = useCallback<ConfirmFn>((nextOptions) => {
    setOptions(nextOptions)
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const close = useCallback((result: boolean) => {
    setOpen(false)
    const resolve = resolverRef.current
    resolverRef.current = null
    resolve?.(result)

    // Small delay so exit animation (if any) feels natural
    setTimeout(() => setOptions(null), 150)
  }, [])

  const contextValue = useMemo(() => confirm, [confirm])

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      {open && options ? (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => close(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={options.title}
              className="w-full max-w-md rounded-xl border bg-white shadow-2xl"
            >
              <div className="p-5 border-b">
                <div className="text-lg font-semibold text-gray-900">{options.title}</div>
                {options.description ? (
                  <div className="mt-1 text-sm text-gray-600">{options.description}</div>
                ) : null}
              </div>

              <div className="p-5 flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => close(false)}>
                  {options.cancelText || 'Cancel'}
                </Button>
                <Button
                  variant={options.variant === 'destructive' ? 'destructive' : 'default'}
                  onClick={() => close(true)}
                >
                  {options.confirmText || 'Confirm'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}
