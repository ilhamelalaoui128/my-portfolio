import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, ChevronDown, ChevronUp, Trash2,
  Inbox, History,
} from 'lucide-react'
import { fetchMessages, deleteMessage } from '../lib/api'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'à l\'instant'
  if (mins < 60) return `il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const initials = (name) =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

const avatarColor = () => 'bg-accent'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [viewMode, setViewMode] = useState('inbox')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedId === id) setSelectedId(null)
      toast.success('Message supprimé.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Messages reçus
          </h2>
          <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark sm:mt-1 sm:text-sm">
            {messages.length} message{messages.length !== 1 ? 's' : ''} reçu{messages.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => setViewMode('inbox')}
            className={'flex h-9 w-9 items-center justify-center rounded-lg border transition ' + (viewMode === 'inbox' ? 'border-accent bg-accent/10 text-accent' : 'border-gray-200/80 text-gray-400 hover:border-gray-300 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-600')}
            aria-label="Vue boîte de réception">
            <Inbox size={15} />
          </button>
          <button type="button" onClick={() => setViewMode('timeline')}
            className={'flex h-9 w-9 items-center justify-center rounded-lg border transition ' + (viewMode === 'timeline' ? 'border-accent bg-accent/10 text-accent' : 'border-gray-200/80 text-gray-400 hover:border-gray-300 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-600')}
            aria-label="Vue fil d'actualité">
            <History size={15} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200/90 bg-white px-8 py-14 text-center shadow-sm dark:border-gray-800 dark:bg-[#18181C]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
            <Mail size={24} className="text-accent" strokeWidth={1.75} />
          </div>
          <p className="font-display text-lg font-bold text-gray-900 dark:text-white">
            Aucun message
          </p>
          <p className="max-w-xs text-sm text-muted-light dark:text-muted-dark">
            Les messages du formulaire de contact apparaîtront ici une fois Supabase connecté.
          </p>
        </motion.div>
      )}

      {/* ─── INBOX MODE ─── */}
      {viewMode === 'inbox' && messages.length > 0 && (
        <div className="space-y-1.5">
          {messages.map((msg, i) => {
            const isOpen = selectedId === msg.id
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.025 }}
                className={'overflow-hidden rounded-xl border transition ' + (isOpen
                  ? 'border-accent/30 bg-white shadow-sm dark:border-accent/35 dark:bg-[#1A1A1E]'
                  : 'border-gray-200/80 bg-white shadow-sm hover:border-gray-300 dark:border-gray-800 dark:bg-[#18181C] dark:hover:border-gray-700')}
              >
                <button type="button" onClick={() => setSelectedId(isOpen ? null : msg.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left sm:gap-4 sm:px-5 sm:py-3.5">
                  <span className={'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white sm:h-9 sm:w-9 sm:text-sm ' + avatarColor(msg.name)}>
                    {initials(msg.name)}
                  </span>
                  <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className={'truncate text-sm font-semibold ' + (isOpen ? 'text-accent' : 'text-gray-900 dark:text-white')}>
                        {msg.name}
                      </span>
                      {!isOpen && (
                        <span className="shrink-0 text-[11px] text-muted-light dark:text-muted-dark">
                          {timeAgo(msg.created_at)}
                        </span>
                      )}
                    </div>
                    <p className={'truncate text-xs ' + (isOpen ? 'text-accent/80' : 'text-muted-light dark:text-muted-dark')}>
                      {isOpen ? msg.email : (msg.message.slice(0, 80) + (msg.message.length > 80 ? '…' : ''))}
                    </p>
                  </div>
                  <span className={'shrink-0 transition ' + (isOpen ? 'text-accent' : 'text-gray-400')}>
                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-gray-100 dark:border-gray-800">
                      <div className="px-4 py-3.5 sm:px-5">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-light dark:text-muted-dark">
                          <a href={`mailto:${msg.email}`}
                            className="flex items-center gap-1 text-accent hover:underline">
                            <Mail size={11} />
                            {msg.email}
                          </a>
                          <span>
                            {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'long', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {msg.message}
                        </p>
                        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                          <a href={`mailto:${msg.email}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            Répondre
                          </a>
                          <button type="button" onClick={() => setDeleteConfirm(msg.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                            <Trash2 size={12} />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ─── TIMELINE MODE ─── */}
      {viewMode === 'timeline' && messages.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-[#18181C]"
            >
              <div className="flex items-start gap-3">
                <span className={'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ' + avatarColor(msg.name)}>
                  {initials(msg.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{msg.name}</p>
                  <a href={`mailto:${msg.email}`}
                    className="truncate block text-xs text-accent hover:underline">{msg.email}</a>
                </div>
                <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                  {timeAgo(msg.created_at)}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-4">
                {msg.message}
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <a href={`mailto:${msg.email}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  Répondre
                </a>
                <button type="button" onClick={() => setDeleteConfirm(msg.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                  <Trash2 size={12} />
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Supprimer le message"
        message="Cette action est irréversible."
      />
    </div>
  )
}
