import { useEffect, useState } from 'react'

const MIN_DURATION = 1400

function getScrollRatio(elapsed, minDuration) {
  return Math.min(92, (elapsed / minDuration) * 92)
}

export function useAppLoader(minDuration = MIN_DURATION) {
  const [isReady, setIsReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? 0 : minDuration
    let rafId = null
    let exitTimer = null
    let mounted = true
    const start = performance.now()

    const tick = (now) => {
      if (!mounted) return
      const elapsed = now - start
      setProgress(getScrollRatio(elapsed, duration || 1))
      if (elapsed < duration) {
        rafId = requestAnimationFrame(tick)
      }
    }

    const waitForLoad = () =>
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))

    const waitForFonts = document.fonts?.ready ?? Promise.resolve()

    if (duration === 0) {
      Promise.all([waitForLoad(), waitForFonts]).then(() => {
        if (!mounted) return
        setProgress(100)
        setIsReady(true)
      })
      return () => {
        mounted = false
      }
    }

    rafId = requestAnimationFrame(tick)

    Promise.all([waitForLoad(), waitForFonts, new Promise((r) => setTimeout(r, duration))]).then(
      () => {
        if (!mounted) return
        setProgress(100)
        exitTimer = window.setTimeout(() => {
          if (mounted) setIsReady(true)
        }, 380)
      },
    )

    return () => {
      mounted = false
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (exitTimer) window.clearTimeout(exitTimer)
    }
  }, [minDuration])

  useEffect(() => {
    if (isReady) {
      document.body.style.overflow = ''
      return undefined
    }

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isReady])

  return { isReady, progress }
}
