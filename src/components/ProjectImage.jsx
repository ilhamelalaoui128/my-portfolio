import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { hasProjectImage } from '../lib/projectUtils'

export default function ProjectImage({ src, alt, className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false)
  const showPlaceholder = failed || !hasProjectImage(src)

  if (showPlaceholder) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#FFF0EB] via-[#FFE8DF] to-[#FFD4C4] text-accent-dark dark:from-[#18181C] dark:via-[#1E1E22] dark:to-[#252018] dark:text-accent-light ${className}`}
        role="img"
        aria-label="Image indisponible"
      >
        <ImageOff size={36} className="text-accent/70" strokeWidth={1.5} />
        <span className="text-sm font-medium">Image indisponible</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={imgClassName}
    />
  )
}
