import { Github, Linkedin, Heart, Mail } from 'lucide-react'
import SectionDivider from './SectionDivider'
import Logo from './Logo'
import { usePortfolioData } from '../context/PortfolioDataContext'

export default function Footer() {
  const { profile } = usePortfolioData()
  const year = new Date().getFullYear()

  if (!profile) return null

  return (
    <footer className="bg-surface-light dark:bg-surface-dark">
      <SectionDivider narrow className="pb-8 pt-2" />

      <div className="container-narrow px-5 sm:px-8 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-6 pb-10 sm:flex-row">
          <div className="text-center sm:text-left">
            <Logo alt={profile.fullName || profile.name} className="mx-auto h-11 w-auto sm:mx-0" />
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-light dark:text-muted-dark sm:justify-start">
              Fait avec <Heart size={13} className="text-accent" /> en {year}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="icon-link h-10 w-10"
            >
              <Mail size={20} />
            </a>
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="icon-link h-10 w-10"
            >
              <Github size={20} />
            </a>
            <a
              href={profile.social?.linkedin || 'https://linkedin.com/in/ilhamelalaoui'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="icon-link h-10 w-10"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
