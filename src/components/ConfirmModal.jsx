import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Supprimer', cancelText = 'Annuler', destructive = true }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-[#18181C]"
          >
            <button type="button" onClick={onClose}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X size={15} />
            </button>

            <div className="flex flex-col items-center text-center">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${destructive ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' : 'bg-accent/10 text-accent'}`}>
                <AlertTriangle size={24} strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              {message && (
                <p className="mt-1.5 text-sm text-muted-light dark:text-muted-dark">
                  {message}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200/80 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {cancelText}
              </button>
              <button type="button" onClick={() => { onConfirm(); onClose() }}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                  destructive
                    ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600'
                    : 'bg-accent shadow-accent/20 hover:bg-accent-dark'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
