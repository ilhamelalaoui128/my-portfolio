import { useEffect, useRef } from 'react'

export function getScrollRatio() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0
}

export function useScrollProgress(onUpdate) {
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  useEffect(() => {
    let rafId = null

    const tick = () => {
      rafId = null
      onUpdateRef.current(getScrollRatio())
    }

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    tick()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])
}
