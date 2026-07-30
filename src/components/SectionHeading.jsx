import ScrollReveal from './ScrollReveal'

export default function SectionHeading({ label, title, description, className = 'mb-14 md:mb-16' }) {
  return (
    <ScrollReveal className={`text-center ${className}`}>
      {label && (
        <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {label}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-light dark:text-muted-dark md:text-lg">
          {description}
        </p>
      )}
    </ScrollReveal>
  )
}
