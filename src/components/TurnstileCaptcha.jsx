import { useEffect, useRef } from 'react'

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export default function TurnstileCaptcha({ onToken, onExpired, onError }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const onTokenRef = useRef(onToken)
  const onExpiredRef = useRef(onExpired)
  const onErrorRef = useRef(onError)

  onTokenRef.current = onToken
  onExpiredRef.current = onExpired
  onErrorRef.current = onError

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => onTokenRef.current?.(token),
        'expired-callback': () => onExpiredRef.current?.(),
        'error-callback': () => onErrorRef.current?.(),
        theme: 'auto',
      })
    }

    if (window.turnstile) {
      renderWidget()
      return undefined
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.defer = true
    script.addEventListener('load', renderWidget)
    document.head.appendChild(script)

    return () => {
      script.remove()
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [])

  if (!TURNSTILE_SITE_KEY) return null

  return (
    <div
      ref={containerRef}
      className="flex min-h-[65px] w-full items-center justify-center overflow-hidden"
    />
  )
}
