import { Mail, Phone, Github, MapPin, Linkedin } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'

export default function ContactInfo() {
  const { profile } = usePortfolioData()

  if (!profile) return null

  const p = profile

  const items = [
    {
      icon: Mail, label: 'Email',
      value: p.email,
      href: `mailto:${p.email}`,
    },
    {
      icon: Phone, label: 'Téléphone',
      value: p.phone,
      href: p.phoneHref,
    },
    {
      icon: Linkedin, label: 'LinkedIn',
      value: p.social?.linkedin || 'linkedin.com/in/ilhamelalaoui',
      href: p.social?.linkedin || 'https://linkedin.com/in/ilhamelalaoui',
      external: true,
    },
    {
      icon: Github, label: 'GitHub',
      value: 'ilhamelalaoui128',
      href: p.social?.github || 'https://github.com/ilhamelalaoui128',
      external: true,
    },
    {
      icon: MapPin, label: 'Localisation',
      value: p.location,
    },
  ]

  return (
    <ScrollReveal className="lg:col-span-2">
      <div className="flex h-full flex-col justify-center space-y-8 py-2">
        {items.map(({ icon: Icon, label, value, href, external }) => (
          <div key={label} className="group flex gap-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/15 bg-accent/5 transition duration-200 group-hover:border-accent/30 group-hover:bg-accent/10">
              <Icon size={18} className="shrink-0 text-accent" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm text-muted-light dark:text-muted-dark">{label}</p>
              {href ? (
                <a href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="mt-1 block text-base font-medium text-gray-900 transition hover:text-accent dark:text-white"
                >
                  {value}
                </a>
              ) : (
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  )
}
