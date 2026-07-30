import { useEffect, useState } from 'react'
import { navLinks } from '../lib/data'

export function useActiveSection(enabled = true) {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    if (!enabled) return

    const sectionIds = navLinks.map((link) => link.href.replace('#', ''))
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      }
    )

    sections.forEach((section) => observer.observe(section))

    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
      if (atBottom) setActiveSection('contact')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled])

  return activeSection
}

function linkClass(isActive) {
  const base =
    'relative text-sm font-medium transition-colors duration-200'
  return isActive
    ? `${base} text-accent after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-accent`
    : `${base} text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent`
}

function mobileLinkClass(isActive) {
  const base = 'block text-base font-medium transition-colors duration-200'
  return isActive
    ? `${base} text-accent`
    : `${base} text-gray-700 dark:text-gray-200`
}

export { linkClass, mobileLinkClass }
