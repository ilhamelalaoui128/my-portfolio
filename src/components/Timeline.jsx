import { GraduationCap } from 'lucide-react'
import SectionHeading from './SectionHeading'
import ScrollReveal from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'

export default function Timeline() {
  const { experiences } = usePortfolioData()

  if (!experiences) return null

  const items = experiences.filter((e) => e.type === 'education')

  return (
    <section id="experience" className="section-padding bg-surface-light dark:bg-surface-dark">
      <div className="container-narrow">
        <SectionHeading
          label="Parcours"
          title="Formation"
          description="Mon parcours académique et professionnel à Oujda."
        />

        <div className="relative space-y-0">
          <div
            className="absolute bottom-0 left-[19px] top-0 w-px bg-gray-200 dark:bg-gray-800 md:left-1/2 md:-translate-x-px"
            aria-hidden="true"
          />

          {items.map((exp, i) => {
              const isLeft = i % 2 === 0

              return (
                <ScrollReveal key={exp.id} delay={i * 0.08}>
                  <div
                    className={`relative grid gap-6 pb-12 md:grid-cols-2 md:gap-12 ${
                      isLeft ? '' : 'md:[&>div:first-child]:order-2'
                    }`}
                  >
                    <div className={`pl-12 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                        {exp.period}
                      </span>
                      <h3 className="mt-3 font-display text-xl font-bold text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-accent">{exp.company}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-light dark:text-muted-dark">
                        {exp.description}
                      </p>
                    </div>

                    <div className="hidden md:block" />

                    <div
                      className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-surface-light dark:bg-surface-dark md:left-1/2 md:-translate-x-1/2"
                      aria-hidden="true"
                    >
                      <GraduationCap size={16} className="text-accent" />
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>
  )
}