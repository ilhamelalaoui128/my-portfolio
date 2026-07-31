import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Lucide from 'lucide-react'
import { navLinks } from '../lib/data'
import { fetchMessages } from '../lib/api'
import { usePortfolioData } from '../context/PortfolioDataContext'
import ThemeToggle from './ThemeToggle'
import CvDownloadButton from './CvDownloadButton'
import MobileMenu from './MobileMenu'
import Logo from './Logo'
import { useActiveSection, linkClass } from '../hooks/useActiveSection'

const iconMap = {
  Home: Lucide.Home,
  User: Lucide.User,
  Code: Lucide.Code,
  FolderKanban: Lucide.FolderKanban,
  Route: Lucide.Route,
  Mail: Lucide.Mail,
  LayoutDashboard: Lucide.LayoutDashboard,
  MessageSquare: Lucide.MessageSquare,
  GraduationCap: Lucide.GraduationCap,
  Briefcase: Lucide.Briefcase,
  Lock: Lucide.Lock,
}

const adminLinks = [
  { label: 'Profil', href: '/admin?tab=profile', icon: 'User' },
  { label: 'Compétences', href: '/admin?tab=skills', icon: 'Code' },
  { label: 'Projets', href: '/admin?tab=projects', icon: 'FolderKanban' },
  { label: 'Expériences', href: '/admin?tab=experiences', icon: 'Briefcase' },
  { label: 'Messages', href: '/admin?tab=messages', icon: 'MessageSquare' },
  { label: 'Sécurité', href: '/admin?tab=security', icon: 'Lock' },
]

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAdmin = location.pathname === '/admin'
  const [open, setOpen] = useState(false)
  const [onHero, setOnHero] = useState(isHome)
  const activeSection = useActiveSection(isHome)
  const transparentNav = isHome && onHero
  const [msgCount, setMsgCount] = useState(0)
  const { profile } = usePortfolioData()
  const profileName = profile?.name || ''

  useEffect(() => {
    if (!isAdmin) return
    fetchMessages().then((msgs) => setMsgCount(msgs.length)).catch(() => {})
  }, [isAdmin])

  useEffect(() => {
    if (!isHome) {
      setOnHero(false)
      return undefined
    }

    const hero = document.getElementById('hero')
    if (!hero) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setOnHero(entry.isIntersecting),
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [isHome])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const linkHref = (href) => (isHome ? href : `/${href}`)
  const isLinkActive = (href) => isHome && activeSection === href.replace('#', '')
  const currentTab = new URLSearchParams(location.search).get('tab') || 'dashboard'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          transparentNav
            ? 'border-b border-transparent bg-transparent'
            : 'border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800/80 dark:bg-surface-dark/90'
        }`}
      >
        <nav
          className="container-narrow mx-auto flex items-center justify-between px-5 py-4 sm:px-8 lg:px-16"
          aria-label="Navigation principale"
        >
          <Link
            to={isAdmin ? '/admin' : '/'}
            className="flex items-center"
            aria-label={isAdmin ? 'Admin' : profileName}
          >
            <Logo alt={isAdmin ? 'Admin' : profileName} className="h-9 w-auto" />
          </Link>

          <ul className="hidden items-center gap-6 md:flex xl:gap-8">
            {(isAdmin ? adminLinks : navLinks).map((link) => {
              const active = isAdmin
                ? currentTab === link.href.split('tab=')[1]
                : isLinkActive(link.href)
              const Icon = iconMap[link.icon]
              return (
                <li key={link.href}>
                  {isAdmin ? (
                    <Link
                      to={link.href}
                      className={`${linkClass(active)} inline-flex items-center gap-1.5`}
                      aria-current={active ? 'true' : undefined}
                    >
                      {Icon && <Icon size={13} strokeWidth={active ? 2.5 : 1.75} />}
                      {link.label}
                      {link.label === 'Messages' && msgCount > 0 && (
                        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white leading-none">
                          {msgCount}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <a
                      href={linkHref(link.href)}
                      className={`${linkClass(active)} inline-flex items-center gap-1.5`}
                      aria-current={active ? 'true' : undefined}
                    >
                      {Icon && <Icon size={13} strokeWidth={active ? 2.5 : 1.75} />}
                      {link.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            {isAdmin ? (
              <>
                <Link
                  to="/"
                  aria-label="Voir le site"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200/80 text-gray-500 shadow-sm transition hover:border-accent/40 hover:text-accent dark:border-gray-700 dark:text-gray-400 dark:hover:border-accent/40 dark:hover:text-accent"
                >
                  <Lucide.ArrowUpRight size={14} />
                </Link>
                <ThemeToggle />
                <Link
                  to="/admin?action=logout"
                  aria-label="Se déconnecter"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200/80 text-gray-500 shadow-sm transition hover:border-red-300 hover:text-red-500 dark:border-gray-700 dark:text-gray-400 dark:hover:border-red-400/50 dark:hover:text-red-400"
                >
                  <Lucide.LogOut size={14} />
                </Link>
              </>
            ) : (
              <CvDownloadButton />
            )}
            {!isAdmin && <ThemeToggle />}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Ouvrir le menu"
              className="icon-link h-10 w-10 dark:hover:text-accent"
            >
              <Lucide.Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        linkHref={linkHref}
        isLinkActive={isLinkActive}
        isAdmin={isAdmin}
        msgCount={msgCount}
      />
    </>
  )
}
