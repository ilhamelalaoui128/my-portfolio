import { Briefcase, MapPin, GraduationCap, ArrowRight, Sparkles, ShieldCheck, Rocket } from 'lucide-react'
import SectionHeading from './SectionHeading'
import ScrollReveal from './ScrollReveal'
import SectionDivider from './SectionDivider'
import { usePortfolioData } from '../context/PortfolioDataContext'

const valueIcons = [Sparkles, ShieldCheck, Rocket]

export default function About() {
  const { profile } = usePortfolioData()

  if (!profile) return null

  const displayName = profile.fullName || profile.name

  return (
    <section id="about" className="-mt-px bg-surface-light px-5 pb-12 pt-20 dark:bg-surface-dark sm:px-8 md:pb-16 md:pt-28 lg:px-16 xl:px-24">
      <div className="container-narrow">
        <SectionHeading
          label="À propos"
          title="Qui suis-je ?"
          description="Technicienne en développement digital, étudiante à SUP MTI et en recherche de stage."
        />

        <div className="grid items-start gap-12 lg:grid-cols-[300px_1fr] lg:gap-16">
          <ScrollReveal>
            <div className="lg:sticky lg:top-28">
              <figure>
                <div className="overflow-hidden rounded-2xl border-2 border-accent bg-gray-50 shadow-[0_0_18px_rgba(224,90,58,0.5),0_0_36px_rgba(224,90,58,0.2)] ring-2 ring-accent/20 dark:bg-gray-900">
                  <img
                    src={profile.photoUrl}
                    alt={`Portrait de ${displayName}`}
                    className="aspect-[3/4] w-full object-cover object-top"
                    width={300}
                    height={400}
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-5 text-center">
                  <p className="font-display text-xl font-bold text-gray-900 dark:text-white">
                    {displayName}
                  </p>
                  <p className="mx-auto mt-1 max-w-[260px] text-sm leading-snug text-muted-light dark:text-muted-dark">
                    {profile.title}
                  </p>
                </figcaption>
              </figure>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal delay={0.1}>
              <ul className="flex flex-wrap gap-3">
                {profile.seekingType === 'stage' && (
                  <li className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-4 py-2 text-sm font-medium text-accent">
                    <Briefcase size={15} />
                    Stage · {profile.internshipTarget || 'Poste recherché'}
                  </li>
                )}
                {profile.seekingType === 'travail' && (
                  <li className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <Briefcase size={15} />
                    {profile.jobTarget || 'Ouvert au travail'} · {profile.jobContract || 'CDI'}
                  </li>
                )}
                <li className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                  <GraduationCap size={15} className="text-accent" />
                  SUP MTI — Oujda
                </li>
                <li className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                  <MapPin size={15} className="text-accent" />
                  {profile.location}
                </li>
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="space-y-5 border-l-2 border-accent/30 pl-6 text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
                {profile.about.bio.split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              {profile.about?.stack?.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {profile.about.stack.map((cat) => (
                    <div key={cat.category}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark">
                        <span className="text-accent">{cat.category}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(cat.items || []).map((item) => (
                          <span key={item}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:gap-3"
              >
                Discutons de votre opportunité
                <ArrowRight size={16} />
              </a>
            </ScrollReveal>
          </div>
        </div>

        <div className="mt-12 md:mt-14">
          <SectionDivider nested className="pb-8 md:pb-10" />
          <SectionHeading
            label="Profil"
            title="Ce qui me définit"
            description="Les qualités qui guident mon approche du développement."
          />

          <div className="relative">
            <div
              className="absolute left-[16.67%] right-[16.67%] top-5 hidden h-px bg-gray-200 md:block dark:bg-gray-800"
              aria-hidden="true"
            />

            <div className="grid gap-10 md:grid-cols-3 md:gap-6">
              {profile.about.values.map((value, i) => {
                const Icon = valueIcons[i] || Sparkles

                return (
                  <ScrollReveal key={value.label} delay={i * 0.08}>
                    <div className="relative flex flex-col items-center text-center">
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-white dark:bg-surface-dark">
                        <Icon size={16} className="text-accent" />
                      </div>
                      <span className="mt-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                        0{i + 1}
                      </span>
                      <h3 className="mt-3 font-display text-xl font-bold text-gray-900 dark:text-white">
                        {value.label}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-light dark:text-muted-dark">
                        {value.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
