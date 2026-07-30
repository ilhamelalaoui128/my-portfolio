import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, Star, MessageSquare, GraduationCap, Briefcase, Mail, ArrowRight } from 'lucide-react'
import { fetchProjects, fetchExperiences, fetchMessages } from '../lib/api'

const statCards = [
  { key: 'projects', icon: FolderKanban, label: 'Projets', desc: 'Réalisations' },
  { key: 'featured', icon: Star, label: 'En vedette', desc: 'Projets mis en avant' },
  { key: 'messages', icon: MessageSquare, label: 'Messages', desc: 'Reçus' },
  { key: 'experiences', icon: Briefcase, label: 'Expériences', desc: 'Travail & stages' },
]

function StatCard({ icon: Icon, label, value, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-[#18181C]"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      <p className="text-xs text-muted-light dark:text-muted-dark">{desc}</p>
    </motion.div>
  )
}

function RecentMessages({ messages }) {
  const visible = messages.slice(0, 4)

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <MessageSquare size={15} strokeWidth={1.75} />
          </span>
          <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">
            Derniers messages
          </h3>
        </div>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
          {messages.length}
        </span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Mail size={18} className="text-accent" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Aucun message</p>
            <p className="text-xs text-muted-light dark:text-muted-dark">
              Les messages du formulaire de contact apparaîtront ici.
            </p>
          </div>
        )}
        {visible.map((msg) => (
          <div key={msg.id} className="px-5 py-3.5 transition hover:bg-accent/[0.03]">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{msg.name}</p>
              <p className="shrink-0 text-[11px] text-muted-light dark:text-muted-dark">
                {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short',
                })}
              </p>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-light dark:text-muted-dark">{msg.email}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-1">
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentProjects({ projects }) {
  const visible = projects.slice(0, 5)

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <FolderKanban size={15} strokeWidth={1.75} />
          </span>
          <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">
            Projets récents
          </h3>
        </div>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
          {projects.length}
        </span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <FolderKanban size={18} className="text-accent" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Aucun projet</p>
            <p className="text-xs text-muted-light dark:text-muted-dark">
              Créez votre premier projet pour le voir ici.
            </p>
          </div>
        )}
        {visible.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-accent/[0.03]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <FolderKanban size={14} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{p.title}</p>
                {p.featured && (
                  <Star size={10} className="shrink-0 fill-yellow-500 text-yellow-500" />
                )}
              </div>
              <p className="truncate text-xs text-muted-light dark:text-muted-dark">
                {(p.stack || []).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard({ onNavigate }) {
  const [projects, setProjects] = useState([])
  const [experiences, setExperiences] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProjects(), fetchExperiences(), fetchMessages()])
      .then(([p, e, m]) => {
        setProjects(p)
        setExperiences(e)
        setMessages(m)
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    projects: projects.length,
    featured: projects.filter((p) => p.featured).length,
    messages: messages.length,
    experiences: experiences.length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Tableau de bord
          </h2>
          <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark sm:mt-1 sm:text-sm">
            Aperçu général de votre portfolio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <StatCard key={card.key} {...card} value={stats[card.key]} index={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentMessages messages={messages} />
        <RecentProjects projects={projects} />
      </div>
    </div>
  )
}
