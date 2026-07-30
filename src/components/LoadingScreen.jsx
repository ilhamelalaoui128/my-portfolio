import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen({ progress }) {
  const barRef = useRef(null)

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress / 100))})`
    }
  }, [progress])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark"
      role="status"
      aria-live="polite"
      aria-label="Chargement du portfolio"
    >
      <div className="flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
        >
          Ilham El Alaoui<span className="text-accent">.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mt-3 text-sm text-muted-light dark:text-muted-dark"
        >
          Développeuse Web
        </motion.p>

        <div className="mt-10 w-48 overflow-hidden rounded-full bg-gray-200/80 dark:bg-gray-800/80 sm:w-56">
          <div
            ref={barRef}
            className="h-1 w-full origin-left rounded-full bg-gradient-to-r from-accent-dark via-accent to-accent-light will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        <p className="mt-3 text-xs tabular-nums text-muted-light dark:text-muted-dark">
          {Math.round(progress)}%
        </p>
      </div>
    </motion.div>
  )
}
