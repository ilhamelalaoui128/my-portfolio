import { useId } from 'react'
import { brand } from '../lib/theme'

export const aboutSectionBg = {
  light: '#FFF9F7',
  dark: brand.surfaceDark,
}

const WAVE_BODY =
  'M0,88 C360,120 720,48 1080,88 C1260,104 1380,72 1440,88 L1440,120 L0,120 Z'

const WAVE_CREST =
  'M0,88 C360,120 720,48 1080,88 C1260,104 1380,72 1440,88'

export default function WaveDivider({ className = '' }) {
  const uid = useId().replace(/:/g, '')

  const gradStroke = `wave-stroke-${uid}`
  const gradGlowLight = `wave-glow-light-${uid}`
  const gradGlowDark = `wave-glow-dark-${uid}`

  return (
    <div
      className={`pointer-events-none absolute bottom-0 left-0 z-[2] w-full leading-[0] ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-12 w-full sm:h-16 md:h-[5rem] lg:h-24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradStroke} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={brand.accent} stopOpacity="0" />
            <stop offset="20%" stopColor={brand.accentLight} stopOpacity="0.6" />
            <stop offset="50%" stopColor={brand.accent} stopOpacity="1" />
            <stop offset="80%" stopColor={brand.accentLight} stopOpacity="0.6" />
            <stop offset="100%" stopColor={brand.accent} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={gradGlowLight} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={brand.accent} stopOpacity="0.1" />
            <stop offset="100%" stopColor={brand.accent} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={gradGlowDark} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={brand.accent} stopOpacity="0.14" />
            <stop offset="100%" stopColor={brand.accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Lueur — mode clair */}
        <path
          className="dark:hidden"
          fill={`url(#${gradGlowLight})`}
          d="M0,76 C320,112 640,40 960,76 C1120,92 1280,68 1440,76 L1440,120 L0,120 Z"
        />
        {/* Lueur — mode sombre */}
        <path
          className="hidden dark:block"
          fill={`url(#${gradGlowDark})`}
          d="M0,76 C320,112 640,40 960,76 C1120,92 1280,68 1440,76 L1440,120 L0,120 Z"
        />

        {/* Corps — synchronisé via classe dark: sur html */}
        <path className="fill-surface-light dark:fill-surface-dark" d={WAVE_BODY} />

        {/* Bordure designer */}
        <path
          fill="none"
          stroke={`url(#${gradStroke})`}
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          d={WAVE_CREST}
        />
      </svg>
    </div>
  )
}
