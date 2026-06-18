'use client'

// Adapted from OJAIN toast.jsx → same logic, Next.js 'use client' directive added.
// brand-* colors replaced with pink-* to match GoodieGear palette.

import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(() => {})

const TONES = {
  success: {
    icon: CheckCircle2,
    cls: 'border-green-200 bg-green-50 text-green-800',
    iconCls: 'text-green-600',
  },
  error: {
    icon: AlertTriangle,
    cls: 'border-red-200 bg-red-50 text-red-800',
    iconCls: 'text-red-500',
  },
  info: {
    icon: Info,
    cls: 'border-pink-200 bg-pink-50 text-pink-800',
    iconCls: 'text-pink-500',
  },
}

let counter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const toast = useCallback(
    (message, type = 'success') => {
      const id = ++counter
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => remove(id), 3200)
    },
    [remove]
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast stack — fixed bottom-right */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-xs flex-col gap-2">
        {toasts.map((t) => {
          const tone = TONES[t.type] || TONES.info
          const Icon = tone.icon
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium shadow-lg ${tone.cls}`}
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.iconCls}`} />
              <span className="flex-1">{t.message}</span>
              <button onClick={() => remove(t.id)} className="opacity-50 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
