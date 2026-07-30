import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Save, X, Plus, Upload, Trash2, Eye, Pencil, MapPin, Briefcase, Mail, Github, Linkedin, Phone, GraduationCap, Sparkles, ShieldCheck, Rocket, ChevronDown, FileText } from 'lucide-react'
import { fetchProfile, updateProfile } from '../lib/api'
import { useToast } from '../components/Toast'

const valueIcons = [Sparkles, ShieldCheck, Rocket]

function TagInput({ tags, onChange, placeholder = 'Ajouter…' }) {
  const [input, setInput] = useState('')

  const add = () => {
    const v = input.trim()
    if (v && !tags.includes(v)) {
      onChange([...tags, v])
      setInput('')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3 py-2 dark:border-gray-700 dark:bg-[#18181C]">
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
          {t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="text-accent/60 hover:text-accent">
            <X size={12} />
          </button>
        </span>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
        onBlur={add}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="min-w-[80px] flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </div>
  )
}

function Preview({ form, onOpenCv, onOpenPhoto }) {
  const p = form
  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <button type="button" onClick={onOpenPhoto} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-accent/30 bg-gray-100 shadow-md transition hover:opacity-80 dark:bg-gray-800">
            <img src={p.photoUrl} alt="" className="h-full w-full object-cover" />
          </button>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">{p.fullName || p.name}</h3>
            <p className="text-sm text-muted-light dark:text-muted-dark">{p.title}</p>
            {p.subtitle && <p className="mt-0.5 text-xs text-muted-light/70 dark:text-muted-dark/70">{p.subtitle}</p>}
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {p.seekingType === 'stage' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-xs font-semibold text-accent">
                  <Briefcase size={12} />
                  Stage
                </span>
              )}
              {p.seekingType === 'travail' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <Briefcase size={12} />
                  En poste
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <MapPin size={12} />
                {p.location}
              </span>
            </div>
          </div>
        </div>
        {p.tagline && (
          <p className="mt-4 border-t border-gray-100 pt-4 text-sm italic text-muted-light dark:border-gray-800 dark:text-muted-dark">
            {p.tagline}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
          <h4 className="mb-4 font-display text-base font-bold text-gray-900 dark:text-white">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={15} className="shrink-0 text-accent" />
              <a href={`mailto:${p.email}`} className="truncate text-gray-600 hover:text-accent dark:text-gray-400">{p.email}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={15} className="shrink-0 text-accent" />
              <a href={p.phoneHref} className="text-gray-600 hover:text-accent dark:text-gray-400">{p.phone}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Github size={15} className="shrink-0 text-accent" />
              <a href={p.social?.github} target="_blank" rel="noreferrer" className="truncate text-gray-600 hover:text-accent dark:text-gray-400">{p.social?.github}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Linkedin size={15} className="shrink-0 text-accent" />
              <a href={p.social?.linkedin} target="_blank" rel="noreferrer" className="truncate text-gray-600 hover:text-accent dark:text-gray-400">{p.social?.linkedin || 'Non renseigné'}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={15} className="shrink-0 text-accent" />
              <span className="text-gray-600 dark:text-gray-400">{p.location}</span>
            </div>
          </div>
        </div>

        {/* CV */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
          <h4 className="mb-4 font-display text-base font-bold text-gray-900 dark:text-white">CV</h4>
          {p.cvUrl ? (
            <div className="flex flex-col gap-3">
              <button type="button" onClick={onOpenCv}
                className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-4 text-left transition hover:from-accent/20 hover:to-accent/10">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold text-gray-900 dark:text-white">Voir le CV</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark">Cliquez pour visualiser le PDF</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 shrink-0 text-accent">
                  <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
              </button>
              <a href={p.cvUrl} download="CV_ILHAM.pdf"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200/80 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Télécharger
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </span>
              <p className="text-sm text-muted-light dark:text-muted-dark">Aucun CV renseigné</p>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {p.about?.bio && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
          <h4 className="mb-3 font-display text-base font-bold text-gray-900 dark:text-white">Bio</h4>
          <div className="space-y-3 border-l-2 border-accent/30 pl-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {p.about.bio.split('\n\n').map((para) => (
              <p key={para.slice(0, 30)}>{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* Valeurs */}
      {p.about?.values?.length > 0 && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
          <h4 className="mb-4 font-display text-base font-bold text-gray-900 dark:text-white">Valeurs</h4>
          <div className="grid gap-5 sm:grid-cols-3">
            {p.about.values.map((v, i) => {
              const Icon = valueIcons[i] || Sparkles
              return (
                <div key={v.label} className="flex flex-col items-center text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-white dark:bg-surface-dark">
                    <Icon size={15} className="text-accent" />
                  </div>
                  <span className="mt-3 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">0{i + 1}</span>
                  <h5 className="mt-2 font-display text-sm font-bold text-gray-900 dark:text-white">{v.label}</h5>
                  <p className="mt-1 text-xs leading-relaxed text-muted-light dark:text-muted-dark">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Stack */}
      {(p.about?.stack?.length > 0) && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C]">
          <h4 className="mb-3 font-display text-base font-bold text-gray-900 dark:text-white">Stack & Outils</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {p.about.stack.map((cat) => (
              <div key={cat.category}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{cat.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(cat.items || []).map((item) => (
                    <span key={item} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminProfile() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [cvPreview, setCvPreview] = useState('')
  const [cvViewerOpen, setCvViewerOpen] = useState(false)
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false)
  const [mode, setMode] = useState('preview')
  const [openSection, setOpenSection] = useState(null)
  const [modalSection, setModalSection] = useState(null)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    fetchProfile()
      .then((p) => setForm(JSON.parse(JSON.stringify(p))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (modalSection) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [modalSection])

  const set = (path, value) => {
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = copy
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return copy
    })
  }

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleCv = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCvFile(file)
    const reader = new FileReader()
    reader.onload = () => setCvPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (photoPreview) payload.photoUrl = photoPreview
      if (cvPreview) payload.cvUrl = cvPreview
      await updateProfile(payload)
      const fresh = await fetchProfile()
      setForm(JSON.parse(JSON.stringify(fresh)))
      toast.success('Profil mis à jour avec succès.')
      setPhotoFile(null)
      setPhotoPreview('')
      setCvFile(null)
      setCvPreview('')
      setMode('preview')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const addValue = () => {
    const vals = [...(form?.about?.values || []), { label: '', desc: '' }]
    set('about.values', vals)
  }

  const updateValue = (idx, field, val) => {
    const vals = [...(form?.about?.values || [])]
    vals[idx] = { ...vals[idx], [field]: val }
    set('about.values', vals)
  }

  const removeValue = (idx) => {
    const vals = (form?.about?.values || []).filter((_, i) => i !== idx)
    set('about.values', vals)
  }

  const addStackCategory = () => {
    const stack = [...(form.about?.stack || []), { category: '', items: [] }]
    set('about.stack', stack)
  }

  const updateStackCategory = (idx, value) => {
    const stack = [...(form.about?.stack || [])]
    stack[idx] = { ...stack[idx], category: value }
    set('about.stack', stack)
  }

  const removeStackCategory = (idx) => {
    const stack = (form.about?.stack || []).filter((_, i) => i !== idx)
    set('about.stack', stack)
  }

  const addStackItem = (catIdx) => {
    const stack = [...(form.about?.stack || [])]
    stack[catIdx] = { ...stack[catIdx], items: [...(stack[catIdx]?.items || []), ''] }
    set('about.stack', stack)
  }

  const updateStackItem = (catIdx, itemIdx, value) => {
    const stack = [...(form.about?.stack || [])]
    const items = [...(stack[catIdx]?.items || [])]
    items[itemIdx] = value
    stack[catIdx] = { ...stack[catIdx], items }
    set('about.stack', stack)
  }

  const removeStackItem = (catIdx, itemIdx) => {
    const stack = [...(form.about?.stack || [])]
    stack[catIdx] = { ...stack[catIdx], items: (stack[catIdx]?.items || []).filter((_, i) => i !== itemIdx) }
    set('about.stack', stack)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!form) return null

  const tabClass = (active) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-accent text-white shadow-sm shadow-accent/20'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
    }`

  const inputClass = 'input-field w-full text-sm'
  const labelClass = 'text-xs font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Profil</h2>
          <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark sm:mt-1 sm:text-sm">Consultez et modifiez vos informations personnelles.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => setMode('preview')} className={tabClass(mode === 'preview')}>
            <Eye size={15} />
            Aperçu
          </button>
          <button type="button" onClick={() => setMode('edit')} className={tabClass(mode === 'edit')}>
            <Pencil size={15} />
            Modifier
          </button>
        </div>
      </div>

      {mode === 'preview' ? (
        <Preview form={form} onOpenCv={() => setCvViewerOpen(true)} onOpenPhoto={() => setPhotoViewerOpen(true)} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              {
                id: 'identite', label: 'Identité', icon: 'User',
                summary: form.name || form.fullName || form.title ? `${form.name || ''} ${form.fullName || ''}${form.title ? ` — ${form.title}` : ''}`.trim() : 'Renseigner votre identité',
              },
              {
                id: 'media', label: 'Photo & CV', icon: 'Image',
                summary: form.photoUrl || form.cvUrl ? (form.photoUrl ? 'Photo ✓' : '') + (form.photoUrl && form.cvUrl ? ' · ' : '') + (form.cvUrl ? 'CV ✓' : '') : 'Ajouter une photo et un CV',
              },
              {
                id: 'contact', label: 'Contact', icon: 'Mail',
                summary: form.email || form.phone ? `${form.email || ''}${form.phone ? ` · ${form.phone}` : ''}` : 'Renseigner vos coordonnées',
              },
              {
                id: 'stage', label: 'Stage / Travail', icon: 'Briefcase',
                summary: form.seekingType === 'stage'
                  ? `Stage · ${form.internshipTarget || 'Poste recherché'}`
                  : form.seekingType === 'travail'
                  ? `Travail · ${form.jobTarget || 'Poste recherché'}`
                  : 'Badge désactivé',
              },
              {
                id: 'bio', label: 'Bio', icon: 'FileText',
                summary: form.about?.bio ? form.about.bio.slice(0, 60) + (form.about.bio.length > 60 ? '…' : '') : 'Ajouter une bio',
              },
              {
                id: 'valeurs', label: 'Valeurs', icon: 'Heart',
                summary: form.about?.values?.length ? `${form.about.values.length} valeur${form.about.values.length > 1 ? 's' : ''}` : 'Ajouter des valeurs',
              },
              {
                id: 'stack', label: 'Stack & Outils', icon: 'Code',
                summary: form.about?.stack?.length
                  ? `${form.about.stack.length} catégorie${form.about.stack.length > 1 ? 's' : ''} · ${form.about.stack.reduce((a, c) => a + (c.items?.length || 0), 0)} outils`
                  : 'Ajouter votre stack technique',
              },
            ].map((section) => (
              <button type="button" key={section.id} onClick={() => setModalSection(section.id)}
                className="group rounded-2xl border border-gray-200/80 bg-white p-5 text-left shadow-sm transition hover:border-accent/40 hover:shadow-md dark:border-gray-800 dark:bg-[#18181C] dark:hover:border-accent/40">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">{section.label}</h3>
                  <span className="shrink-0 rounded-full bg-gray-100 p-1.5 text-gray-400 transition group-hover:bg-accent/10 group-hover:text-accent dark:bg-gray-800 dark:group-hover:bg-accent/10">
                    <Pencil size={13} />
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-light dark:text-muted-dark line-clamp-2">{section.summary}</p>
              </button>
            ))}
          </div>

          {/* Section Modal */}
          {modalSection && (() => {
            const section = [
              {
                id: 'identite', label: 'Identité',
                content: (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className={labelClass}>Prénom</span>
                      <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
                    </label>
                    <label className="block space-y-1.5">
                      <span className={labelClass}>Nom complet</span>
                      <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className={inputClass} />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className={labelClass}>Titre</span>
                      <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className={labelClass}>Sous-titre</span>
                      <input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} className={inputClass} />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className={labelClass}>Tagline</span>
                      <textarea value={form.tagline} onChange={(e) => set('tagline', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                    </label>
                  </div>
                ),
              },
              {
                id: 'media', label: 'Photo & CV',
                content: (
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <span className={labelClass}>Photo de profil</span>
                      <div className="flex items-center gap-4 rounded-xl border border-gray-200/80 p-4 dark:border-gray-700">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                          {photoPreview || form.photoUrl ? (
                            <img src={photoPreview || form.photoUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-600">
                              <Upload size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{(photoPreview || form.photoUrl) ? 'Photo importée' : 'Aucune photo'}</p>
                          <p className="text-xs text-muted-light dark:text-muted-dark">PNG, JPG • max 2 Mo</p>
                        </div>
                        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-400 transition hover:border-accent hover:text-accent dark:border-gray-600 dark:text-gray-500">
                          <Upload size={15} />
                          <span>{photoPreview || form.photoUrl ? 'Changer' : 'Importer'}</span>
                          <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className={labelClass}>CV (PDF)</span>
                      <div className="flex items-center gap-4 rounded-xl border border-gray-200/80 p-4 dark:border-gray-700">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <FileText size={22} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {cvPreview || form.cvUrl
                              ? cvFile?.name || 'CV importé'
                              : 'Aucun CV'}
                          </p>
                          <p className="text-xs text-muted-light dark:text-muted-dark">PDF • max 5 Mo</p>
                        </div>
                        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-400 transition hover:border-accent hover:text-accent dark:border-gray-600 dark:text-gray-500">
                          <Upload size={15} />
                          <span>{cvPreview || form.cvUrl ? 'Changer' : 'Importer'}</span>
                          <input type="file" accept=".pdf,application/pdf" className="sr-only" onChange={handleCv} />
                        </label>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'contact', label: 'Contact',
                content: (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className={labelClass}>Email</span>
                      <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
                    </label>
                    <label className="block space-y-1.5">
                      <span className={labelClass}>Téléphone</span>
                      <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
                    </label>
                    <label className="block space-y-1.5">
                      <span className={labelClass}>Lien téléphone</span>
                      <input value={form.phoneHref} onChange={(e) => set('phoneHref', e.target.value)} className={inputClass} placeholder="tel:+212709398880" />
                    </label>
                    <label className="block space-y-1.5">
                      <span className={labelClass}>Localisation</span>
                      <input value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className={labelClass}>GitHub</span>
                      <input value={form.social?.github || ''} onChange={(e) => set('social.github', e.target.value)} className={inputClass} placeholder="https://github.com/username" />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className={labelClass}>LinkedIn</span>
                      <input value={form.social?.linkedin || ''} onChange={(e) => set('social.linkedin', e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/username" />
                    </label>
                  </div>
                ),
              },
              {
                id: 'stage', label: 'Stage / Travail',
                content: (
                  <div className="space-y-5">
                    <div className="relative flex rounded-2xl bg-accent/10 p-1 dark:bg-accent/15">
                      {[
                        { value: null, label: 'Désactivé', icon: X },
                        { value: 'stage', label: 'Stage', icon: GraduationCap },
                        { value: 'travail', label: 'Travail', icon: Briefcase },
                      ].map((opt) => {
                        const active = form.seekingType === opt.value
                        const Icon = opt.icon
                        return (
                          <button key={opt.value} type="button"
                            onClick={() => set('seekingType', opt.value)}
                            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                              active
                                ? 'bg-white text-gray-900 shadow-sm shadow-black/5 ring-1 ring-gray-200/80 dark:bg-[#27272A] dark:text-white dark:ring-gray-700'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}>
                            <Icon size={15} className={active ? 'text-accent' : ''} />
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>

                    {form.seekingType === 'stage' && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-1.5">
                          <span className={labelClass}>Domaine / Poste recherché</span>
                          <input value={form.internshipTarget || ''}
                            onChange={(e) => set('internshipTarget', e.target.value)}
                            className={inputClass} placeholder="Ex: Développement Web Full-Stack" />
                        </label>
                        <label className="block space-y-1.5">
                          <span className={labelClass}>Durée souhaitée</span>
                          <input value={form.internshipDuration || ''}
                            onChange={(e) => set('internshipDuration', e.target.value)}
                            className={inputClass} placeholder="Ex: 2 à 4 mois" />
                        </label>
                        <label className="block space-y-1.5 sm:col-span-2">
                          <span className={labelClass}>Disponibilité</span>
                          <input value={form.internshipPeriod || ''}
                            onChange={(e) => set('internshipPeriod', e.target.value)}
                            className={inputClass} placeholder="Ex: À partir de Septembre 2024" />
                        </label>
                        <label className="block space-y-1.5 sm:col-span-2">
                          <span className={labelClass}>Message / Description</span>
                          <textarea value={form.internshipDesc || ''}
                            onChange={(e) => set('internshipDesc', e.target.value)}
                            rows={4} className={`${inputClass} resize-none`}
                            placeholder="Décrivez brièvement ce que vous recherchez…" />
                        </label>
                      </div>
                    )}

                    {form.seekingType === 'travail' && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-1.5">
                          <span className={labelClass}>Poste recherché</span>
                          <input value={form.jobTarget || ''}
                            onChange={(e) => set('jobTarget', e.target.value)}
                            className={inputClass} placeholder="Ex: Développeur Full-Stack" />
                        </label>
                        <label className="block space-y-1.5">
                          <span className={labelClass}>Type de contrat</span>
                          <div className="relative">
                            <select value={form.jobContract || ''}
                              onChange={(e) => set('jobContract', e.target.value)}
                              className={`${inputClass} appearance-none pr-10`}>
                              <option value="">Sélectionner…</option>
                              <option value="CDI">CDI</option>
                              <option value="CDD">CDD</option>
                              <option value="Freelance">Freelance</option>
                              <option value="Alternance">Alternance</option>
                              <option value="Temps partiel">Temps partiel</option>
                            </select>
                            <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                        </label>
                        <label className="block space-y-1.5 sm:col-span-2">
                          <span className={labelClass}>Disponibilité</span>
                          <input value={form.jobPeriod || ''}
                            onChange={(e) => set('jobPeriod', e.target.value)}
                            className={inputClass} placeholder="Ex: Immédiatement, À partir de…" />
                        </label>
                        <label className="block space-y-1.5 sm:col-span-2">
                          <span className={labelClass}>Message / Description</span>
                          <textarea value={form.jobDesc || ''}
                            onChange={(e) => set('jobDesc', e.target.value)}
                            rows={4} className={`${inputClass} resize-none`}
                            placeholder="Décrivez brièvement ce que vous recherchez…" />
                        </label>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'bio', label: 'Bio',
                content: (
                  <label className="block space-y-1.5">
                    <span className={labelClass}>À propos de vous</span>
                    <textarea value={form.about?.bio || ''} onChange={(e) => set('about.bio', e.target.value)}
                      rows={6} className={`${inputClass} resize-none`} />
                  </label>
                ),
              },
              {
                id: 'valeurs', label: 'Valeurs',
                content: (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-gray-200/80 px-4 py-3 dark:border-gray-700">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Vos valeurs</p>
                        <p className="text-xs text-muted-light dark:text-muted-dark">Ajoutez jusqu'à 3 valeurs qui vous définissent</p>
                      </div>
                      <button type="button" onClick={addValue}
                        disabled={(form.about?.values || []).length >= 3}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition hover:bg-accent/20 disabled:opacity-40 disabled:cursor-not-allowed">
                        <Plus size={13} />
                        Ajouter
                      </button>
                    </div>
                    {(form.about?.values || []).length === 0 && (
                      <p className="py-6 text-center text-sm text-muted-light dark:text-muted-dark">Aucune valeur pour le moment.</p>
                    )}
                    {(form.about?.values || []).map((v, i) => {
                      const icons = [Sparkles, ShieldCheck, Rocket]
                      const Icon = icons[i] || icons[0]
                      return (
                        <div key={i} className="group flex items-start gap-4 rounded-xl border border-gray-200/80 p-4 transition hover:border-accent/30 dark:border-gray-700 dark:hover:border-accent/30">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input value={v.label} onChange={(e) => updateValue(i, 'label', e.target.value)}
                              className="w-full rounded-lg border border-gray-200/80 bg-transparent px-3 py-2 text-sm font-medium outline-none focus:border-accent dark:border-gray-700" placeholder="Titre de la valeur" />
                            <input value={v.desc} onChange={(e) => updateValue(i, 'desc', e.target.value)}
                              className="w-full rounded-lg border border-gray-200/80 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-700" placeholder="Description" />
                          </div>
                          <button type="button" onClick={() => removeValue(i)}
                            className="mt-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ),
              },
              {
                id: 'stack', label: 'Stack & Outils',
                content: (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-gray-200/80 px-4 py-3 dark:border-gray-700">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Votre stack technique</p>
                        <p className="text-xs text-muted-light dark:text-muted-dark">Organisez par catégories (Frontend, Backend…)</p>
                      </div>
                      <button type="button" onClick={addStackCategory}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition hover:bg-accent/20">
                        <Plus size={13} />
                        Catégorie
                      </button>
                    </div>
                    {(form.about?.stack || []).length === 0 && (
                      <p className="py-6 text-center text-sm text-muted-light dark:text-muted-dark">Aucune catégorie pour le moment.</p>
                    )}
                    {(form.about?.stack || []).map((cat, catIdx) => (
                      <div key={catIdx} className="space-y-3 rounded-xl border border-gray-200/80 p-4 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <input value={cat.category} onChange={(e) => updateStackCategory(catIdx, e.target.value)}
                            className="flex-1 rounded-lg border border-gray-200/80 bg-transparent px-3 py-2 text-sm font-medium outline-none focus:border-accent dark:border-gray-700" placeholder="Nom de la catégorie (ex: Frontend)" />
                          <button type="button" onClick={() => removeStackCategory(catIdx)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {(cat.items || []).map((item, itemIdx) => (
                            <span key={itemIdx} className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              <input value={item} onChange={(e) => updateStackItem(catIdx, itemIdx, e.target.value)}
                                className="w-20 bg-transparent text-xs outline-none" />
                              <button type="button" onClick={() => removeStackItem(catIdx, itemIdx)}
                                className="text-gray-400 hover:text-red-500">
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                          <button type="button" onClick={() => addStackItem(catIdx)}
                            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-2.5 py-1 text-xs text-gray-400 transition hover:border-accent hover:text-accent dark:border-gray-600">
                            <Plus size={11} />
                            Outil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
            ].find(s => s.id === modalSection)

            return section ? createPortal(
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalSection(null)}>
                <div className="w-full max-w-xl rounded-2xl border border-gray-200/80 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#18181C]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                    <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">{section.label}</h3>
                    <button type="button" onClick={() => setModalSection(null)}
                      className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto p-5">
                    {section.content}
                  </div>
                </div>
              </div>,
              document.body
            ) : null
          })()}

          <div className="col-span-full">
            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setMode('preview')}
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 dark:border-gray-700 dark:text-gray-400">
                Annuler
              </button>
              <button type="submit" disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60">
                <Save size={16} />
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      )}

      {cvViewerOpen && form?.cvUrl && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setCvViewerOpen(false)}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-full flex-col rounded-t-2xl bg-white shadow-2xl dark:bg-[#18181C] sm:max-w-3xl sm:rounded-2xl sm:border sm:border-gray-200/80 sm:dark:border-gray-700 h-[80vh] sm:h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800 sm:px-6 sm:py-4">
              <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">CV</h3>
              <div className="flex items-center gap-2">
                <a href={form.cvUrl} download="CV_ILHAM.pdf"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-accent/10 hover:text-accent dark:bg-gray-800 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Télécharger
                </a>
                <button type="button" onClick={() => setCvViewerOpen(false)}
                  className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-0 sm:p-2">
              <iframe
                src={form.cvUrl}
                className="h-full w-full border-0"
                title="CV PDF"
              />
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {photoViewerOpen && form?.photoUrl && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPhotoViewerOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#18181C]"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => setPhotoViewerOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70">
              <X size={16} />
            </button>
            <img src={form.photoUrl} alt="Photo de profil" className="max-h-[85vh] max-w-[90vw] object-contain" />
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  )
}