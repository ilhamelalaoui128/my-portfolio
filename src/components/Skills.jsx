import { Code2, Cpu, Database, Languages } from 'lucide-react'
import SectionHeading from './SectionHeading'
import ScrollReveal from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'

const categoryMeta = {
  'Développement Web': { icon: Code2 },
  'Logiciel & Back-End': { icon: Cpu },
  'Data & Outils': { icon: Database },
}

function CategoryRow({ group }) {
  const meta = categoryMeta[group.category] || { icon: Code2 }
  const Icon = meta.icon

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
      <header className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white sm:text-base">
          {group.category}
        </h3>
      </header>
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
        {group.items.map((skill) => (
          <div key={skill.name} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-sm font-medium text-gray-900 dark:text-white sm:w-20">
              {skill.name}
            </span>
            <div className="relative h-2 flex-1">
              <div className="h-full w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <div
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-white shadow-sm dark:bg-[#18181C]"
                style={{ left: `${skill.level}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400 sm:w-12">
              {skill.level}%
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Skills() {
  const { skills: skillData, languages: langData } = usePortfolioData()

  if (!skillData) return null

  return (
    <section
      id="skills"
      className="bg-surface-light px-5 pb-16 pt-12 dark:bg-surface-dark sm:px-8 md:pb-20 md:pt-14 lg:px-16 xl:px-24"
    >
      <div className="container-narrow">
        <SectionHeading
          label="Compétences"
          title="Stack & outils"
          description="Technologies acquises en formation et mises en œuvre dans mes projets personnels."
          className="mb-8 md:mb-10"
        />

        <ScrollReveal>
          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {skillData.map((group) => (
              <CategoryRow key={group.category} group={group} />
            ))}

            {langData?.length > 0 && (
              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
                <header className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                    <Languages size={16} strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                    Langues
                  </h3>
                </header>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                  {langData.map((lang) => (
                    <div key={lang.name} className="flex flex-1 items-center gap-3">
                      <span className="w-16 shrink-0 text-sm font-medium text-gray-900 dark:text-white sm:w-20">
                        {lang.name}
                      </span>
                      <div className="relative h-2 flex-1">
                        <div className="h-full w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                          <div
                            className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                            style={{ width: `${lang.percent}%` }}
                          />
                        </div>
                        <div
                          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-white shadow-sm dark:bg-[#18181C]"
                          style={{ left: `${lang.percent}%` }}
                        />
                      </div>
                      <span className="w-16 shrink-0 text-right text-xs font-semibold text-accent sm:w-20">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
