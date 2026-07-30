import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { fetchProfile } from '../lib/api'

const trackClass = (isDark) =>
  isDark
    ? 'border-accent/40 bg-gradient-to-r from-[#101012] via-[#16141a] to-[#2a1814] shadow-black/30 hover:border-accent/65 hover:shadow-accent/15'
    : 'border-accent/30 bg-gradient-to-r from-[#FFF8F5] via-[#FFF0EB] to-[#FFE4DA] shadow-accent/5 hover:border-accent/50 hover:shadow-accent/20'

const contentClass = (isDark) =>
  isDark ? 'text-accent-light' : 'text-accent-dark'

export default function CvDownloadButton({
  className = '',
  variant = 'compact',
  onClick,
}) {
  const { isDark } = useTheme()
  const isFull = variant === 'full'
  const [cvUrl, setCvUrl] = useState('/cv.pdf')

  useEffect(() => {
    fetchProfile().then(p => { if (p?.cvUrl) setCvUrl(p.cvUrl) }).catch(() => {})
  }, [])

  return (
    <a
      href={cvUrl}
      download="CV_ILHAM.pdf"
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-full border shadow-inner transition duration-300 ${trackClass(isDark)} ${contentClass(isDark)} ${
        isFull ? 'h-11 w-full px-5 text-sm font-semibold' : 'h-9 px-3.5 text-sm font-semibold'
      } ${className}`}
    >
      <Download size={isFull ? 16 : 15} strokeWidth={2.25} />
      <span>{isFull ? 'Télécharger le CV' : 'CV'}</span>
    </a>
  )
}
