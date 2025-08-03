'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

// Create a simple toast context
let toastCallbacks: ((toast: Toast) => void)[] = []

export const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast: Toast = { ...toast, id }
  toastCallbacks.forEach(callback => callback(newToast))
}

export const removeToast = (id: string) => {
  toastCallbacks.forEach(callback => callback({ id, type: 'info', title: '' }))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToast = (toast: Toast) => {
      if (toast.title) {
        setToasts(prev => [...prev, toast])
      } else {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }
    }

    toastCallbacks.push(handleToast)
    return () => {
      toastCallbacks = toastCallbacks.filter(cb => cb !== handleToast)
    }
  }, [])

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm',
            getToastStyles(toast.type)
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getToastIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setToasts(prev => prev.filter(t => t.id !== toast.id))
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

// Export convenience functions
export const showError = (title: string, message?: string) => {
  addToast({ type: 'error', title, message })
}

export const showSuccess = (title: string, message?: string) => {
  addToast({ type: 'success', title, message })
}

export const showInfo = (title: string, message?: string) => {
  addToast({ type: 'info', title, message })
}

export const showWarning = (title: string, message?: string) => {
  addToast({ type: 'warning', title, message })
} 