import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Plus, X, Save, Trash2, Briefcase, Sparkles, LayoutGrid, List,
} from 'lucide-react'
import {
  fetchExperiences, createExperience, updateExperience, deleteExperience,
} from '../lib/api'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const emptyForm = {
  title: '', company: '', period: '', description: '', type: 'work',
}

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [displayMode, setDisplayMode] = useState('grid')
  const [typeFilter, setTypeFilter] = useState('experience')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const filtered = experiences.filter((e) =>
    typeFilter === 'experience' ? e.type !== 'education' : e.type === 'education'
  )

  const loadExperiences = () => {
    setLoading(true)
    fetchExperiences().then(setExperiences).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadExperiences() }, [])

  const openForm = (exp = null) => {
    if (exp) {
      setForm({ title: exp.title, company: exp.company, period: exp.period, description: exp.description, type: exp.type })
      setEditingId(exp.id)
    } else {
      setForm(emptyForm)
      setEditingId(null)
    }
    setFormModalOpen(true)
  }

  const closeForm = () => {
    setFormModalOpen(false)
    setTimeout(() => { setForm(emptyForm); setEditingId(null) }, 200)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.company.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateExperience(editingId, form)
        toast.success('Expérience modifiée.')
      } else {
        await createExperience(form)
        toast.success('Expérience ajoutée.')
      }
      loadExperiences()
      closeForm()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteExperience(id)
      loadExperiences()
      toast.success('Expérience supprimée.')
    } catch (err) {
      toast.error(err.message)
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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Expériences
          </h2>
          <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark sm:mt-1 sm:text-sm">
            {filtered.length}/{experiences.length} élément{experiences.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setDisplayMode('grid')}
              className={'flex h-9 w-9 items-center justify-center rounded-lg border transition ' + (displayMode === 'grid' ? 'border-accent bg-accent/10 text-accent' : 'border-gray-200/80 text-gray-400 hover:border-gray-300 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-600')}
              aria-label="Vue grille">
              <LayoutGrid size={15} />
            </button>
            <button type="button" onClick={() => setDisplayMode('timeline')}
              className={'flex h-9 w-9 items-center justify-center rounded-lg border transition ' + (displayMode === 'timeline' ? 'border-accent bg-accent/10 text-accent' : 'border-gray-200/80 text-gray-400 hover:border-gray-300 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-600')}
              aria-label="Vue chronologie">
              <List size={15} />
            </button>
          </div>
          <button type="button" onClick={() => openForm()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nouvelle expérience</span>
          </button>
        </div>
      </div>

      <div className="flex items-center rounded-xl border border-gray-200/80 bg-white p-0.5 shadow-sm dark:border-gray-700 dark:bg-[#18181C]">
        <button type="button" onClick={() => setTypeFilter('experience')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            typeFilter === 'experience'
              ? 'bg-accent text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Briefcase size={14} />
          Expériences
        </button>
        <button type="button" onClick={() => setTypeFilter('education')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            typeFilter === 'education'
              ? 'bg-accent text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <GraduationCap size={14} />
          Formations
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200/80 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
            <GraduationCap size={26} className="text-accent" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-gray-900 dark:text-white">Aucune expérience</p>
            <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Ajoutez votre première expérience ou formation.</p>
          </div>
          <button type="button" onClick={() => openForm()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-dark"
          >
            <Plus size={15} />
            Nouvelle expérience
          </button>
        </div>
      ) : displayMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {filtered.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col gap-2 rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-[#18181C] sm:gap-3 sm:rounded-2xl sm:p-5"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${
                  exp.type === 'work'
                    ? 'bg-accent/10 text-accent'
                    : exp.type === 'stage'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                }`}>
                  {exp.type === 'work' ? <Briefcase size={14} strokeWidth={1.75} /> : exp.type === 'stage' ? <Sparkles size={14} strokeWidth={1.75} /> : <GraduationCap size={14} strokeWidth={1.75} />}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white break-words sm:truncate">{exp.title}</h3>
                  <p className="text-xs text-muted-light dark:text-muted-dark break-words sm:truncate">
                    {exp.company}
                    <span className="sm:hidden"> · {exp.period}</span>
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline self-start rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {exp.period}
              </span>

              {exp.description && (
                <p className="hidden sm:block text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                  {exp.description}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between gap-2 pt-1 sm:gap-3 sm:pt-2">
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => openForm(exp)}
                    className="rounded-lg bg-gray-100 p-1.5 text-gray-500 transition hover:bg-accent/10 hover:text-accent dark:bg-gray-800 dark:text-gray-400 dark:hover:text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => setDeleteConfirm(exp.id)}
                    className="rounded-lg bg-gray-100 p-1.5 text-gray-500 transition hover:bg-red-100 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700 sm:left-1/2 sm:-translate-x-px hidden sm:block" />
          <div className="space-y-6 sm:space-y-8">
            {filtered.map((exp, i) => {
              const isLeft = i % 2 === 0
              const Icon = exp.type === 'work' ? Briefcase : exp.type === 'stage' ? Sparkles : GraduationCap
              const colorClasses = exp.type === 'work'
                ? 'border-accent/20 bg-accent/10 text-accent'
                : exp.type === 'stage'
                ? 'border-blue-200 bg-blue-100 text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'border-emerald-200 bg-emerald-100 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-start"
                >
                  <div className="flex items-center gap-3 pl-10 sm:hidden">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${colorClasses}`}>
                      <Icon size={12} strokeWidth={2} />
                    </span>
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{exp.period}</span>
                  </div>
                  <div className={`flex-1 ${isLeft ? 'sm:order-1' : 'sm:order-3'}`}>
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:shadow-lg dark:border-gray-800 dark:bg-[#18181C]">
                      <div className="flex items-start gap-3">
                        <span className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClasses}`}>
                          <Icon size={18} strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                          <p className="text-xs text-muted-light dark:text-muted-dark">{exp.company}</p>
                        </div>
                        <span className="hidden sm:inline shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          {exp.period}
                        </span>
                        <div className="flex shrink-0 gap-1">
                          <button type="button" onClick={() => openForm(exp)}
                            className="rounded-lg bg-gray-100 p-1.5 text-gray-500 transition hover:bg-accent/10 hover:text-accent dark:bg-gray-800 dark:text-gray-400 dark:hover:text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            </svg>
                          </button>
                          <button type="button" onClick={() => setDeleteConfirm(exp.id)}
                            className="rounded-lg bg-gray-100 p-1.5 text-gray-500 transition hover:bg-red-100 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2 sm:ml-[52px]">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:w-16 shrink-0 items-center justify-center sm:order-2">
                    <div className={`z-10 flex h-[38px] w-[38px] items-center justify-center rounded-full border-4 ${colorClasses}`}>
                      <Icon size={14} strokeWidth={2} />
                    </div>
                  </div>
                  <div className={`hidden sm:block sm:w-[calc(50%-32px)] ${isLeft ? 'sm:order-3' : 'sm:order-1'}`} />
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {formModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeForm() }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-h-[90vh] overflow-y-auto sm:max-w-lg sm:rounded-2xl sm:border sm:border-gray-200/90 sm:bg-white sm:shadow-xl sm:dark:border-gray-800 sm:dark:bg-[#18181C] rounded-t-2xl bg-white dark:bg-[#18181C]"
            >
              <div className="flex justify-center pt-2 sm:hidden">
                <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800 sm:px-6 sm:py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent sm:h-9 sm:w-9">
                    {editingId ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 sm:h-4 sm:w-4">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    ) : (
                      <Plus size={16} />
                    )}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                      {editingId ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
                    </h3>
                    <p className="text-[11px] text-muted-light dark:text-muted-dark sm:text-xs">
                      {editingId ? 'Modifiez les informations' : 'Ajoutez une expérience ou une formation'}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={closeForm}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 sm:h-8 sm:w-8"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 p-4 sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark">Titre *</span>
                      <input name="title" value={form.title} onChange={handleChange} required
                        className="input-field w-full" placeholder="Développeur Full Stack"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark">Entreprise / École *</span>
                      <input name="company" value={form.company} onChange={handleChange} required
                        className="input-field w-full" placeholder="Nom de l'organisation"
                      />
                    </label>
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark">Période</span>
                    <input name="period" value={form.period} onChange={handleChange}
                      className="input-field w-full" placeholder="Ex: 2024 — 2025 ou Juillet 2026 (1 mois)"
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark">Type</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setForm((p) => ({ ...p, type: 'work' }))}
                          className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                            form.type === 'work'
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-gray-200/80 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                          }`}
                        >
                          <Briefcase size={16} className="mr-1.5 inline-block" />
                          Travail
                        </button>
                        <button type="button" onClick={() => setForm((p) => ({ ...p, type: 'stage' }))}
                          className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                            form.type === 'stage'
                              ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'border-gray-200/80 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                          }`}
                        >
                          <Sparkles size={16} className="mr-1.5 inline-block" />
                          Stage
                        </button>
                        <button type="button" onClick={() => setForm((p) => ({ ...p, type: 'education' }))}
                          className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                            form.type === 'education'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : 'border-gray-200/80 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                          }`}
                        >
                          <GraduationCap size={16} className="mr-1.5 inline-block" />
                          Formation
                        </button>
                      </div>
                    </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark">Description</span>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                      className="input-field w-full resize-none" placeholder="Décrivez votre rôle ou votre formation…"
                    />
                  </label>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={closeForm}
                      className="flex-1 rounded-xl border border-gray-200/80 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      Annuler
                    </button>
                    <button type="submit" disabled={saving || !form.title.trim() || !form.company.trim()}
                      className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={16} className="mr-1.5 inline-block" />
                      {saving ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Supprimer l'expérience"
        message="Cette action est irréversible."
      />
    </div>
  )
}