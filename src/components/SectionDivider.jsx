export default function SectionDivider({ className = '', nested = false, narrow = false }) {
  const line = (
    <div
      className={`h-0.5 rounded-full bg-accent ${narrow ? 'mx-auto w-[60%]' : 'w-full'}`}
    />
  )

  if (nested) {
    return (
      <div className={className} role="separator" aria-hidden="true">
        {line}
      </div>
    )
  }

  return (
    <div
      className={`bg-surface-light px-5 dark:bg-surface-dark sm:px-8 lg:px-16 xl:px-24 ${className}`}
      role="separator"
      aria-hidden="true"
    >
      <div className="container-narrow">{line}</div>
    </div>
  )
}
