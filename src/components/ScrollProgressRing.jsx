import { useCallback, useId, useRef } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { brand } from '../lib/theme'

export default function ScrollProgressRing({
  size = 48,
  strokeWidth = 2.5,
  className = '',
  children,
}) {
  const uid = useId().replace(/:/g, '')
  const progressRef = useRef(null)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  const onProgress = useCallback(
    (ratio) => {
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = `${circumference * (1 - ratio)}`
      }
    },
    [circumference],
  )

  useScrollProgress(onProgress)

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`ring-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={brand.accentDark} />
            <stop offset="50%" stopColor={brand.accent} />
            <stop offset="100%" stopColor={brand.accentLight} />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200/90 dark:text-gray-700/90"
        />
        <circle
          ref={progressRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#ring-grad-${uid})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="will-change-[stroke-dashoffset]"
        />
      </svg>
      <div className="relative z-[1] flex items-center justify-center">{children}</div>
    </div>
  )
}
