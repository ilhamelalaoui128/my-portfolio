import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    timers.current[id] = setTimeout(() => remove(id), duration)
    return id
  }, [remove])

  const toast = useCallback((message, type) => add(message, type, 3000), [add])
  toast.success = useCallback((message) => add(message, 'success', 3000), [add])
  toast.error = useCallback((message) => add(message, 'error', 5000), [add])

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-0 z-[9999] hidden sm:block">
          <div className="fixed right-4 top-4 flex w-80 flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
              ))}
            </AnimatePresence>
          </div>
        </div>,
        document.body
      )}
      {createPortal(
        <div className="pointer-events-none fixed inset-0 z-[9999] sm:hidden">
          <div className="fixed left-1/2 top-4 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
              ))}
            </AnimatePresence>
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium shadow-lg backdrop-blur-md ${
        toast.type === 'error'
          ? 'border-red-200/80 bg-red-50/95 text-red-700 dark:border-red-800/60 dark:bg-red-950/90 dark:text-red-300'
          : 'border-emerald-200/80 bg-emerald-50/95 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/90 dark:text-emerald-300'
      }`}
    >
      {toast.type === 'error'
        ? <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" />
        : <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
      }
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button type="button" onClick={onDismiss}
        className={`mt-0.5 shrink-0 rounded-lg p-0.5 transition hover:bg-black/5 dark:hover:bg-white/10 ${
          toast.type === 'error'
            ? 'text-red-400 hover:text-red-600 dark:text-red-500'
            : 'text-emerald-400 hover:text-emerald-600 dark:text-emerald-500'
        }`}
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}
