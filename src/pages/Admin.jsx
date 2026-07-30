import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Mail, Lock, Shield, LogIn, X,
  FolderKanban, Plus, Save, Trash2, Upload,
} from 'lucide-react'
import {
  fetchProjects, getSession, signInAdmin, signOutAdmin,
  createProject, updateProject, deleteProject, uploadImage,
} from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import AdminDashboard from './AdminDashboard'
import AdminMessages from './AdminMessages'
import AdminExperiences from './AdminExperiences'
import AdminProfile from './AdminProfile'
import AdminSkills from './AdminSkills'
import RichTextEditor from '../components/RichTextEditor'

const emptyForm = {
  title: '', description: '', content: '', stack: '',
  image_url: '', demo_url: '', repo_url: '', featured: false,
}

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'dashboard'
  const setActiveTab = (tab) => setSearchParams({ tab })
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [login, setLogin] = useState({ email: '', password: '' })
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [removeImage, setRemoveImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fetching, setFetching] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const toast = useToast()

  const filteredProjects = projects.filter((p) =>
    !searchQuery.trim() || p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    getSession().then((s) => {
      setSession(s)
      setChecking(false)
    })
  }, [])

  useEffect(() => {
    if (session) loadProjects()
  }, [session])

  useEffect(() => {
    if (searchParams.get('action') === 'logout') {
      signOutAdmin().then(() => {
        setSession(null)
        setForm(emptyForm)
        setEditingId(null)
        setImageFile(null)
        setImagePreview('')
        setSearchParams({}, { replace: true })
      })
    }
  }, [searchParams])

  useEffect(() => {
    if (formModalOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [formModalOpen])

  const loadProjects = async () => {
    setFetching(true)
    const data = await fetchProjects()
    setProjects(data)
    setFetching(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const s = await signInAdmin(login.email, login.password)
      setSession(s)
    } catch {
      toast.error('Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  const openForm = useCallback((project = null) => {
    if (project) {
      setEditingId(project.id)
      setForm({
        title: project.title || '',
        description: project.description || '',
        content: project.content || '',
        stack: (project.stack || []).join(', '),
        image_url: project.image_url || '',
        demo_url: project.demo_url || '',
        repo_url: project.repo_url || '',
        featured: project.featured || false,
      })
    } else {
      setEditingId(null)
      setForm(emptyForm)
    }
    setImageFile(null)
    setImagePreview('')
    setRemoveImage(false)
    setFormModalOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
    setRemoveImage(false)
  }, [])

  const handleEdit = (project) => {
    openForm(project)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let image_url = form.image_url.trim()

    try {
      if (imageFile) {
        image_url = await uploadImage(imageFile)
      } else if (removeImage) {
        image_url = ''
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        content: form.content.trim(),
        stack: form.stack.split(',').map((s) => s.trim()).filter(Boolean),
        image_url,
        demo_url: form.demo_url.trim(),
        repo_url: form.repo_url.trim(),
        featured: form.featured,
      }

      if (editingId) {
        await updateProject(editingId, payload)
        toast.success('Projet modifié.')
      } else {
        await createProject(payload)
        toast.success('Projet ajouté.')
      }
      closeForm()
      await loadProjects()
    } catch {
      toast.error("Erreur lors de l'envoi de l'image ou de la sauvegarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProject(id)
      if (editingId === id) closeForm()
      await loadProjects()
      toast.success('Projet supprimé.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-light px-5 text-center dark:bg-surface-dark">
        <h1 className="font-display text-2xl font-bold">Admin indisponible</h1>
        <p className="max-w-md text-muted-light dark:text-muted-dark">
          Configurez Supabase dans votre fichier <code className="text-accent">.env</code> pour
          activer l'espace admin.
        </p>
        <Link to="/" className="text-accent hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light px-5 pt-20 dark:bg-surface-dark">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <form
            onSubmit={handleLogin}
            className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18181C]"
          >
            <div className="h-1 bg-gradient-to-r from-accent-dark via-accent to-accent-light" aria-hidden="true" />

            <div className="p-8 md:p-10">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-light transition hover:text-accent dark:text-muted-dark"
              >
                <ArrowLeft size={14} />
                Retour au site
              </Link>

              <div className="mx-auto mb-6 mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <Shield size={28} className="text-accent" strokeWidth={1.75} />
              </div>

              <h1 className="text-center font-display text-2xl font-bold text-gray-900 dark:text-white">
                Administration
              </h1>
              <p className="mt-2 text-center text-sm text-muted-light dark:text-muted-dark">
                Accédez à votre espace d'administration.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Email
                  </label>
                  <div className="flex items-center rounded-xl border border-accent/20 bg-[#FFF8F5] shadow-sm shadow-accent/5 transition duration-200 focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/20 dark:border-accent/25 dark:bg-[#18181C] dark:focus-within:border-accent dark:focus-within:bg-[#1E1E22] dark:focus-within:ring-accent/25">
                    <Mail size={16} className="ml-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                    <input
                      id="admin-email" type="email" placeholder="vous@email.com" required
                      value={login.email}
                      onChange={(e) => setLogin({ ...login, email: e.target.value })}
                      className="w-full bg-transparent py-3 pl-3 pr-4 text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Mot de passe
                  </label>
                  <div className="flex items-center rounded-xl border border-accent/20 bg-[#FFF8F5] shadow-sm shadow-accent/5 transition duration-200 focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/20 dark:border-accent/25 dark:bg-[#18181C] dark:focus-within:border-accent dark:focus-within:bg-[#1E1E22] dark:focus-within:ring-accent/25">
                    <Lock size={16} className="ml-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                    <input
                      id="admin-password" type="password" placeholder="••••••••" required
                      value={login.password}
                      onChange={(e) => setLogin({ ...login, password: e.target.value })}
                      className="w-full bg-transparent py-3 pl-3 pr-4 text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-semibold text-white shadow-md shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Se connecter
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <>
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <main className="section-padding">
        <div className="container-narrow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentTab === 'dashboard' && <AdminDashboard />}

              {currentTab === 'messages' && <AdminMessages />}

              {currentTab === 'experiences' && <AdminExperiences />}

              {currentTab === 'profile' && <AdminProfile />}

              {currentTab === 'skills' && <AdminSkills />}

              {currentTab === 'projects' && (
                <div className="space-y-6">
                  {fetching ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                    </div>
                  ) : (
                    <div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                        Projets
                      </h2>
                      <span className="rounded-full bg-accent/10 px-3 py-0.5 text-sm font-semibold text-accent">
                        {filteredProjects.length}/{projects.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 sm:flex-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400">
                          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher..."
                          className="w-full rounded-xl border border-gray-200/80 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/20 dark:border-gray-700 dark:bg-[#18181C] dark:focus:border-accent sm:w-52"
                        />
                      </div>
                      <button type="button" onClick={() => openForm()}
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark"
                      >
                        <Plus size={15} />
                        <span className="hidden sm:inline">Nouveau projet</span>
                      </button>
                    </div>
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200/80 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                        <FolderKanban size={26} className="text-accent" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-display text-lg font-bold text-gray-900 dark:text-white">
                          {searchQuery ? 'Aucun résultat' : 'Aucun projet'}
                        </p>
                        <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
                          {searchQuery ? 'Essayez un autre terme de recherche.' : 'Créez votre premier projet pour commencer.'}
                        </p>
                      </div>
                      {!searchQuery && (
                        <button type="button" onClick={() => openForm()}
                          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-dark"
                        >
                          <Plus size={15} />
                          Nouveau projet
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredProjects.map((p, i) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                          className="group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-[#18181C] sm:rounded-2xl"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900 sm:aspect-[16/10]">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800/50">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" className="h-10 w-10 opacity-50 sm:h-12 sm:w-12">
                                  <rect width="80" height="80" rx="16" fill="currentColor" className="text-gray-200 dark:text-gray-700" />
                                  <path d="M28 30a2 2 0 0 1 2-2h8l4 4h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H30a2 2 0 0 1-2-2V30Z" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
                                  <path d="M36 34h18M36 38h14M36 42h10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="text-gray-400 dark:text-gray-500" />
                                </svg>
                              </div>
                            )}
                            {p.featured && (
                              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-accent shadow-sm backdrop-blur-sm dark:bg-gray-900/90 sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5 sm:h-3 sm:w-3">
                                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                </svg>
                                <span className="hidden sm:inline">À la une</span>
                              </span>
                            )}
                            <div className="absolute right-2 top-2 flex gap-1 sm:right-3 sm:top-3">
                              <button type="button" onClick={() => handleEdit(p)}
                                className="rounded-lg bg-white/90 p-1.5 text-gray-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-accent dark:bg-gray-900/90 dark:text-gray-300 dark:hover:text-accent sm:p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 sm:h-3.5 sm:w-3.5">
                                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                </svg>
                              </button>
                              <button type="button" onClick={() => setDeleteConfirm(p.id)}
                                className="rounded-lg bg-white/90 p-1.5 text-gray-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-red-500 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:text-red-400 sm:p-2">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h3 className="truncate text-xs font-bold text-gray-900 dark:text-white sm:text-sm">
                              {p.title}
                            </h3>
                            {p.description && (
                              <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted-light dark:text-muted-dark sm:mt-1 sm:line-clamp-2 sm:text-xs">
                                {p.description}
                              </p>
                            )}
                            {(p.stack || []).length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
                                {p.stack.slice(0, 2).map((tech) => (
                                  <span key={tech}
                                    className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400 sm:px-2 sm:text-[10px]">
                                    {tech}
                                  </span>
                                ))}
                                {p.stack.length > 2 && (
                                  <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-400 dark:bg-gray-800 dark:text-gray-500 sm:px-2 sm:text-[10px]">
                                    +{p.stack.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  </div>
                  )}
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
                      className="relative flex w-full max-h-[90vh] flex-col sm:max-w-2xl sm:rounded-2xl sm:border sm:border-gray-200/90 sm:bg-white sm:shadow-xl sm:dark:border-gray-800 sm:dark:bg-[#18181C] rounded-t-2xl bg-white dark:bg-[#18181C]"
                    >
                      {/* Drag handle for mobile */}
                      <div className="flex justify-center pt-2 sm:hidden">
                        <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                      </div>
                      {/* Header — sticky */}
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
                              {editingId ? 'Modifier le projet' : 'Nouveau projet'}
                            </h3>
                            <p className="text-[11px] text-muted-light dark:text-muted-dark sm:text-xs">
                              {editingId ? 'Modifiez les informations du projet' : 'Ajoutez un nouveau projet à votre portfolio'}
                            </p>
                          </div>
                        </div>
                        <button type="button" onClick={closeForm}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 sm:h-8 sm:w-8"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                        <div className="grid gap-4 p-4 sm:gap-6 sm:p-6 sm:grid-cols-5">
                          {/* Left - Image preview */}
                          <div className="space-y-3 sm:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark">
                              Image
                            </label>
                            <div className="relative">
                              <ImgPreview url={removeImage ? '' : imagePreview || form.image_url} />
                              {(imagePreview || form.image_url) && !removeImage && (
                                <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setRemoveImage(true) }}
                                  className="absolute right-2 top-2 flex items-center gap-1.5 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-red-600">
                                  <Trash2 size={14} />
                                  Supprimer
                                </button>
                              )}
                              {removeImage && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm">
                                  <span className="text-sm font-medium text-white">Photo supprimée</span>
                                </div>
                              )}
                            </div>
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-4 text-sm text-gray-400 transition hover:border-accent hover:bg-accent/5 hover:text-accent dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-500 dark:hover:border-accent dark:hover:bg-accent/10">
                              <Upload size={18} />
                              <span>{imageFile ? 'Changer l\'image' : removeImage ? 'Ajouter une image' : 'Importer une image'}</span>
                              <input type="file" accept="image/*" className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files[0]
                                  if (file) {
                                    setImageFile(file)
                                    setRemoveImage(false)
                                    const reader = new FileReader()
                                    reader.onload = () => setImagePreview(reader.result)
                                    reader.readAsDataURL(file)
                                  }
                                }} />
                            </label>
                            {removeImage && (
                              <button type="button" onClick={() => setRemoveImage(false)}
                                className="text-xs text-gray-400 hover:text-gray-300">
                                Annuler la suppression
                              </button>
                            )}
                          </div>

                          {/* Right - Fields */}
                          <div className="space-y-3 sm:col-span-3 sm:space-y-4">
                            <div>
                              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark sm:mb-1.5 sm:text-xs">
                                Titre
                              </label>
                              <input placeholder="ex: Mon Portfolio" value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="input-field text-sm" />
                            </div>

                            <div>
                              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark sm:mb-1.5 sm:text-xs">
                                Description
                              </label>
                              <input placeholder="Courte description du projet" value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="input-field text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                              <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark sm:mb-1.5 sm:text-xs">
                                  Stack
                                </label>
                                <input placeholder="React, Tailwind..." value={form.stack}
                                  onChange={(e) => setForm({ ...form, stack: e.target.value })}
                                  className="input-field text-sm" />
                              </div>
                              <div className="flex items-end">
                                <label className={'relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm shadow-accent/5 transition ' + (form.featured ? 'border-accent bg-accent/10 text-accent' : 'border-accent/20 bg-[#FFF8F5] text-gray-400 dark:border-accent/25 dark:bg-[#18181C] dark:text-gray-500')}>
                                  <input type="checkbox" checked={form.featured}
                                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                    className="sr-only" />
                                  <span className={'flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition ' + (form.featured ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-600')}>
                                    <span className={'inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition ' + (form.featured ? 'translate-x-3' : 'translate-x-0')} />
                                  </span>
                                  <span className="text-xs">{form.featured ? 'À la une' : 'Mettre à la une'}</span>
                                </label>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                              <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark sm:mb-1.5 sm:text-xs">
                                  Lien démo
                                </label>
                                <input placeholder="https://..." value={form.demo_url}
                                  onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                                  className="input-field text-sm" />
                              </div>
                              <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark sm:mb-1.5 sm:text-xs">
                                  GitHub
                                </label>
                                <input placeholder="https://..." value={form.repo_url}
                                  onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
                                  className="input-field text-sm" />
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark sm:mb-1.5 sm:text-xs">
                                Contenu détaillé
                                <span className="font-normal lowercase text-muted-light/60"> (optionnel)</span>
                              </label>
                              <RichTextEditor
                                value={form.content}
                                onChange={(html) => setForm({ ...form, content: html })}
                                placeholder="Description complète du projet…"
                              />
                            </div>
                          </div>
                        </div>


                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-3 dark:border-gray-800 sm:px-6 sm:py-4">
                          <button type="button" onClick={closeForm}
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 sm:px-5 sm:py-2.5"
                          >
                            Annuler
                          </button>
                          <button type="submit" disabled={loading}
                            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60 sm:px-5 sm:py-2.5"
                          >
                            {loading ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-4 sm:w-4" />
                            ) : (
                              <Save size={13} />
                            )}
                            {editingId ? 'Enregistrer' : 'Créer'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>

    <ConfirmModal
      open={deleteConfirm !== null}
      onClose={() => setDeleteConfirm(null)}
      onConfirm={() => handleDelete(deleteConfirm)}
      title="Supprimer le projet"
      message="Cette action est irréversible."
    />
  </>
)
}

function ImgPreview({ url }) {
  const [error, setError] = useState(false)
  const showPlaceholder = !url || error
  return (
    <div className="aspect-[16/10] overflow-hidden rounded-xl border border-gray-200/80 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800/50">
      {showPlaceholder ? (
        <div className="flex h-full w-full items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" className="h-14 w-14 opacity-50">
            <rect width="80" height="80" rx="16" fill="currentColor" className="text-gray-200 dark:text-gray-700" />
            <path d="M28 30a2 2 0 0 1 2-2h8l4 4h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H30a2 2 0 0 1-2-2V30Z" fill="currentColor" className="text-gray-300 dark:text-gray-600" />
            <path d="M36 34h18M36 38h14M36 42h10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="text-gray-400 dark:text-gray-500" />
          </svg>
        </div>
      ) : (
        <img src={url} alt="Aperçu" className="h-full w-full object-cover" onError={() => setError(true)} />
      )}
    </div>
  )
}
