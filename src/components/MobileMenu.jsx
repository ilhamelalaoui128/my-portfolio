import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import * as Lucide from 'lucide-react'
import { navLinks } from '../lib/data'
import ThemeToggle from './ThemeToggle'
import CvDownloadButton from './CvDownloadButton'
import Logo from './Logo'
import { mobileLinkClass } from '../hooks/useActiveSection'
import { useTheme } from '../hooks/useTheme'

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

export default function MobileMenu({ open, onClose, linkHref, isLinkActive, isAdmin, msgCount = 0 }) {
  const { isDark } = useTheme()
  const location = useLocation()
  const currentTab = new URLSearchParams(location.search).get('tab') || 'dashboard'
  useEffect(() => {
    if (!open) return undefined

    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Fermer le menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] md:hidden"
          />

          <motion.aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-full w-[min(100%,18.5rem)] flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-surface-dark md:hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <Logo alt="Menu" className="h-8 w-auto" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="icon-link h-10 w-10"
              >
                <Lucide.X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Navigation mobile">
              <ul className="flex flex-col gap-1">
                {(isAdmin ? adminLinks : navLinks).map((link, index) => {
                  const active = isAdmin
                    ? currentTab === link.href.split('tab=')[1]
                    : isLinkActive(link.href)
                  const Icon = iconMap[link.icon]
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.04, duration: 0.28 }}
                    >
                      {isAdmin ? (
                        <Link
                          to={link.href}
                          onClick={onClose}
                          className={`${mobileLinkClass(active)} flex items-center gap-3 rounded-xl px-3 py-3 ${
                            active ? 'bg-accent/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'
                          }`}
                          aria-current={active ? 'true' : undefined}
                        >
                          {Icon && <Icon size={16} className="text-accent" />}
                          <div className="flex items-center gap-2">
                            {link.label}
                            {link.label === 'Messages' && msgCount > 0 && (
                              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white leading-none">
                                {msgCount}
                              </span>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <a
                          href={linkHref(link.href)}
                          onClick={onClose}
                          className={`${mobileLinkClass(active)} flex items-center gap-3 rounded-xl px-3 py-3 ${
                            active ? 'bg-accent/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'
                          }`}
                          aria-current={active ? 'true' : undefined}
                        >
                          {Icon && <Icon size={16} className="text-accent" />}
                          {link.label}
                        </a>
                      )}
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            <div className="space-y-4 border-t border-gray-200 px-5 py-5 dark:border-gray-800">
              {isAdmin ? (
                <>
                  <Link
                    to="/"
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-300"
                  >
                    <Lucide.ArrowUpRight size={14} />
                    Voir le site
                  </Link>
                  <Link
                    to="/admin?action=logout"
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:border-red-300 hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-900/20"
                  >
                    <Lucide.LogOut size={14} />
                    Déconnexion
                  </Link>
                </>
              ) : (
                <div className="space-y-3">
                  <CvDownloadButton variant="full" onClick={onClose} />
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-400"
                  >
                    <Lucide.LogIn size={14} />
                    Se connecter
                  </Link>
                </div>
              )}
              <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-gray-50/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Apparence</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark">
                    {isDark ? 'Mode sombre' : 'Mode clair'}
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
