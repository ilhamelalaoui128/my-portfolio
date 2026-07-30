import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import ScrollProgressRing from './ScrollProgressRing'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      className={`group fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ScrollProgressRing
        size={44}
        strokeWidth={2.5}
        className="rounded-full bg-white/90 text-gray-500 shadow-lg backdrop-blur-md transition duration-200 group-hover:text-accent dark:bg-surface-dark/90 dark:text-gray-400 dark:group-hover:text-accent"
      >
        <ArrowUp size={18} />
      </ScrollProgressRing>
    </button>
  )
}
