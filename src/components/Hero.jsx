import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Briefcase, MapPin, ArrowRight } from 'lucide-react'
import Ferrofluid from './Ferrofluid/Ferrofluid'
import WaveDivider from './WaveDivider'
import { usePortfolioData } from '../context/PortfolioDataContext'
import { ferrofluidConfigLight, ferrofluidConfigDark } from '../lib/theme'
import { useTheme } from '../hooks/useTheme'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  const { profile, isLive } = usePortfolioData()
  const { isDark } = useTheme()

  if (!profile) return null

  const displayName = profile.fullName || profile.name
  const ferrofluidConfig = isDark ? ferrofluidConfigDark : ferrofluidConfigLight

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-surface-light dark:bg-surface-dark"
    >
      {/* Animation plein écran */}
      <div className="absolute inset-0 z-0">
        <Ferrofluid key={isDark ? 'dark' : 'light'} {...ferrofluidConfig} />
      </div>

      {/* Voile uniforme léger — visible partout, pas seulement à droite */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-white/20 dark:bg-surface-dark/30"
        aria-hidden="true"
      />
      {/* Radial au centre pour le texte, bords laissent l'animation respirer */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_80%_at_50%_45%,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.45)_55%,rgba(255,255,255,0.15)_100%)] dark:bg-[radial-gradient(ellipse_90%_80%_at_50%_45%,rgba(15,15,18,0.88)_0%,rgba(15,15,18,0.5)_55%,rgba(15,15,18,0.12)_100%)]"
        aria-hidden="true"
      />

      {/* Contenu */}
      <div className="container-narrow relative z-10 flex min-h-screen flex-col items-center justify-center section-padding pb-24 pt-28 text-center sm:pb-28 md:pt-32 lg:pb-32">
        <div className="mx-auto w-full max-w-3xl">
          <motion.div {...fade(0)} className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-light dark:text-muted-dark">
              <MapPin size={14} className="text-accent" />
              {profile.location}
            </span>
            {profile.seekingType === 'stage' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-white/70 px-3 py-1 text-xs font-semibold text-accent backdrop-blur-sm dark:bg-surface-dark/70">
                <Briefcase size={13} />
                Stage · {profile.internshipTarget || 'Poste recherché'}
                {profile.internshipPeriod && <span className="text-accent/60">· {profile.internshipPeriod}</span>}
              </span>
            )}
            {profile.seekingType === 'travail' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-600 backdrop-blur-sm dark:bg-surface-dark/70 dark:text-emerald-400">
                <Briefcase size={13} />
                {profile.jobTarget || 'Ouvert au travail'}
                {profile.jobContract && <span className="text-emerald-400/60">· {profile.jobContract}</span>}
              </span>
            )}
          </motion.div>

          <motion.div {...fade(0.08)} className="mt-8 space-y-4">
            <h1 className="font-display text-[2rem] font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:whitespace-nowrap lg:text-[3.25rem] xl:text-6xl">
              {displayName}
              <span className="text-accent">.</span>
            </h1>
            <div className="mx-auto max-w-xl space-y-1.5">
              <p className="font-display text-lg font-semibold text-gray-800 dark:text-gray-100 sm:text-xl">
                {profile.title}
              </p>
              {profile.subtitle && (
                <p className="text-sm text-muted-light dark:text-muted-dark sm:text-base">
                  {profile.subtitle}
                </p>
              )}
            </div>
          </motion.div>

          <motion.p
            {...fade(0.16)}
            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-light dark:text-muted-dark md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-10 flex flex-col items-center gap-5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-accent/20 transition hover:bg-accent-dark"
              >
                Voir mes projets
                <ArrowRight size={16} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/80 px-6 py-3 text-sm font-semibold text-gray-800 backdrop-blur-sm transition hover:border-accent hover:text-accent dark:border-gray-600 dark:bg-surface-dark/80 dark:text-gray-100"
              >
                Me contacter
              </a>
            </div>

            <div className="flex w-full justify-center pt-2">
              <div className="inline-flex items-center justify-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  aria-label={`Envoyer un email à ${profile.email}`}
                  className="icon-link h-11 w-11 shrink-0 bg-white/70 shadow-sm backdrop-blur-md dark:bg-white/[0.06]"
                >
                  <Mail size={18} strokeWidth={2} className="shrink-0" />
                </a>
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Profil GitHub"
                  className="icon-link h-11 w-11 shrink-0 bg-white/70 shadow-sm backdrop-blur-md dark:bg-white/[0.06]"
                >
                  <Github size={18} strokeWidth={2} className="shrink-0" />
                </a>
                <a
                  href={profile.social?.linkedin || 'https://linkedin.com/in/ilhamelalaoui'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Profil LinkedIn"
                  className="icon-link h-11 w-11 shrink-0 bg-white/70 shadow-sm backdrop-blur-md dark:bg-white/[0.06]"
                >
                  <Linkedin size={18} strokeWidth={2} className="shrink-0" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <WaveDivider />

      <a
        href="#about"
        aria-label="Défiler vers le bas"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-gray-400 transition hover:text-accent sm:bottom-10 md:bottom-12 dark:text-gray-500 dark:hover:text-accent"
      >
        <ArrowDown size={20} />
      </a>

      <div className="fixed bottom-3 left-3 z-50 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
        style={{
          borderColor: isLive ? '#22c55e' : '#f59e0b',
          color: isLive ? '#22c55e' : '#f59e0b',
          backgroundColor: isLive ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
        }}
      >
        {isLive ? 'Supabase' : 'Fallback'}
      </div>
    </section>
  )
}
