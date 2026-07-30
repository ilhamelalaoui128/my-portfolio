import { motion, useReducedMotion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()
  const reduceMotion = useReducedMotion()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      onClick={toggleTheme}
      className={`group relative inline-flex h-9 w-16 shrink-0 items-center overflow-hidden rounded-full border p-1 shadow-inner transition duration-300 ${
        isDark
          ? 'border-accent/40 bg-gradient-to-r from-[#101012] via-[#16141a] to-[#2a1814] shadow-black/30 hover:border-accent/65 hover:shadow-accent/15'
          : 'border-accent/30 bg-gradient-to-r from-[#FFF8F5] via-[#FFF0EB] to-[#FFE4DA] shadow-accent/5 hover:border-accent/50 hover:shadow-accent/20'
      } ${className}`}
    >
      {/* Halo côté actif */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-1 w-1/2 rounded-full transition-opacity duration-300 ${
          isDark
            ? 'right-1 bg-accent/20 opacity-100'
            : 'left-1 bg-accent/15 opacity-100'
        }`}
      />

      <Sun
        size={14}
        strokeWidth={2}
        className={`pointer-events-none absolute left-2.5 z-[1] transition-all duration-300 ${
          isDark
            ? 'text-gray-600 group-hover:text-gray-500'
            : 'text-accent drop-shadow-[0_0_6px_rgba(224,90,58,0.45)]'
        }`}
        aria-hidden="true"
      />
      <Moon
        size={14}
        strokeWidth={2}
        className={`pointer-events-none absolute right-2.5 z-[1] transition-all duration-300 ${
          isDark
            ? 'text-accent-light drop-shadow-[0_0_6px_rgba(240,112,80,0.5)]'
            : 'text-gray-400 group-hover:text-gray-500'
        }`}
        aria-hidden="true"
      />

      <motion.span
        layout={!reduceMotion}
        aria-hidden="true"
        className={`relative z-[2] flex h-7 w-7 items-center justify-center rounded-full transition duration-300 ${
          isDark
            ? 'bg-accent text-white shadow-md shadow-accent/45 ring-1 ring-accent/30 group-hover:shadow-accent/55'
            : 'bg-white text-accent shadow-md shadow-accent/20 ring-1 ring-accent/20 group-hover:shadow-accent/30'
        }`}
        animate={{ x: isDark ? 28 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 520, damping: 32, mass: 0.75 }
        }
      >
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={reduceMotion ? false : { rotate: -40, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {isDark ? (
            <Moon size={14} strokeWidth={2.25} className="text-white" />
          ) : (
            <Sun size={14} strokeWidth={2.25} className="text-accent" />
          )}
        </motion.span>
      </motion.span>
    </button>
  )
}
