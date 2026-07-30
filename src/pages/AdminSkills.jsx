import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, Code2, Database, Wrench, Globe, ChevronDown } from 'lucide-react'
import { fetchSkills, updateSkills, fetchLanguages, updateLanguages } from '../lib/api'
import { useToast } from '../components/Toast'

const LEVELS = [
  { label: 'Débutant', value: 25 },
  { label: 'Intermédiaire', value: 50 },
  { label: 'Courant', value: 80 },
  { label: 'Maternel', value: 100 },
]

function levelFromPercent(pct) {
  let closest = LEVELS[0]
  for (const l of LEVELS) {
    if (Math.abs(l.value - pct) < Math.abs(closest.value - pct)) closest = l
  }
  return closest
}

const CATEGORY_ICONS = [Code2, Database, Wrench, Globe]

function SkillLevel({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-24 sm:w-28">
        <div className="h-full w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${value}%` }} />
        </div>
        <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-white dark:bg-[#18181C]" style={{ left: `${value}%` }} />
        <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer opacity-0" />
      </div>
      <span className="w-7 text-right text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">{value}%</span>
    </div>
  )
}

export default function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState(0)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const [s, l] = await Promise.all([fetchSkills(), fetchLanguages()])
      setSkills(JSON.parse(JSON.stringify(s)))
      setLanguages(JSON.parse(JSON.stringify(l)))
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const addCategory = () => {
    setSkills((prev) => [...prev, { category: '', items: [] }])
    setTab(skills.length)
  }

  const updateCategory = (i, val) => {
    setSkills((prev) => {
      const copy = [...prev]
      copy[i] = { ...copy[i], category: val }
      return copy
    })
  }

  const removeCategory = (i) => {
    setSkills((prev) => {
      const copy = prev.filter((_, idx) => idx !== i)
      if (tab >= copy.length) setTab(Math.max(0, copy.length - 1))
      return copy
    })
  }

  const addSkill = (catIdx) => {
    setSkills((prev) => {
      const copy = [...prev]
      copy[catIdx] = { ...copy[catIdx], items: [...copy[catIdx].items, { name: '', level: 70 }] }
      return copy
    })
  }

  const updateSkill = (catIdx, itemIdx, field, val) => {
    setSkills((prev) => {
      const copy = [...prev]
      const items = [...copy[catIdx].items]
      items[itemIdx] = { ...items[itemIdx], [field]: val }
      copy[catIdx] = { ...copy[catIdx], items }
      return copy
    })
  }

  const removeSkill = (catIdx, itemIdx) => {
    setSkills((prev) => {
      const copy = [...prev]
      copy[catIdx] = { ...copy[catIdx], items: copy[catIdx].items.filter((_, idx) => idx !== itemIdx) }
      return copy
    })
  }

  const addLanguage = () => {
    setLanguages((prev) => [...prev, { name: '', level: '', percent: 50 }])
  }

  const updateLanguage = (i, field, val) => {
    setLanguages((prev) => {
      const copy = [...prev]
      const entry = { ...copy[i], [field]: val }
      if (field === 'level') {
        const m = { Maternel: 100, Courant: 80 }
        m['Interm\u00e9diaire'] = 50
        m['D\u00e9butant'] = 25
        entry.percent = m[val] !== undefined ? m[val] : entry.percent
      }
      if (field === 'percent') {
        entry.level = levelFromPercent(val).label
      }
      copy[i] = entry
      return copy
    })
  }

  const removeLanguage = (i) => {
    setLanguages((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.all([updateSkills(skills), updateLanguages(languages)])
      toast.success('Compétences et langues mises à jour.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  const cat = skills[tab]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Compétences</h2>
          <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark sm:mt-1 sm:text-sm">Gérer vos catégories de compétences techniques et vos langues.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Skills */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C] sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">Catégories de compétences</h3>
              <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark">Ajoutez des catégories (Web, Backend, Outils…) et leurs compétences.</p>
            </div>
            <button type="button" onClick={addCategory}
              className="inline-flex items-center gap-1.5 self-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark sm:self-auto">
              <Plus size={15} />
              Ajouter une catégorie
            </button>
          </div>

          {/* Tabs */}
          {skills.length > 0 ? (
            <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, i) => {
                const Icon = CATEGORY_ICONS[i] || Code2
                return (
                  <button key={i} type="button" onClick={() => setTab(i)}
                    className={`group relative w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      tab === i
                        ? 'bg-accent text-white shadow-sm shadow-accent/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}>
                    <div className="flex items-center gap-2 pr-6">
                      <Icon size={15} className="shrink-0" />
                      <span className="truncate">{skill.category || 'Sans nom'}</span>
                      {skill.items.length > 0 && (
                        <span className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                          tab === i ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {skill.items.length}
                        </span>
                      )}
                    </div>
                    <span onClick={(e) => { e.stopPropagation(); removeCategory(i) }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 transition ${
                        tab === i
                          ? 'text-white/60 hover:bg-white/20 hover:text-white'
                          : 'text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20'
                      }`}>
                      <Trash2 size={13} />
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mb-6 py-10 text-center text-sm text-muted-light dark:text-muted-dark">
              Aucune catégorie. Cliquez sur "Ajouter une catégorie" pour commencer.
            </div>
          )}

          {/* Active category */}
          {cat && (
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input value={cat.category} onChange={(e) => updateCategory(tab, e.target.value)}
                    className="rounded-lg border border-gray-200/80 bg-transparent px-3 py-2 text-sm font-semibold outline-none transition focus:border-accent dark:border-gray-700"
                    placeholder="Nom de la catégorie" />
                </div>
                <button type="button" onClick={() => addSkill(tab)}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark">
                  <Plus size={15} />
                  Ajouter
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.length === 0 && (
                  <p className="py-6 text-center text-xs text-muted-light dark:text-muted-dark">Aucune compétence dans cette catégorie.</p>
                )}
                {cat.items.map((item, ii) => (
                  <div key={ii} className="group relative flex items-center gap-3 rounded-xl border border-gray-200/80 px-4 py-3 dark:border-gray-700">
                    <input value={item.name} onChange={(e) => updateSkill(tab, ii, 'name', e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                      placeholder="Nom de la compétence" />
                    <SkillLevel value={item.level} onChange={(v) => updateSkill(tab, ii, 'level', v)} />
                    <button type="button" onClick={() => removeSkill(tab, ii)}
                      className="absolute -right-2 -top-2 rounded-full border border-gray-200/80 bg-white p-1 text-gray-400 opacity-0 shadow-sm transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:border-gray-600 dark:bg-[#18181C] dark:hover:bg-red-900/20">
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Languages */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C] sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">Langues</h3>
              <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark">Ajoutez les langues que vous parlez et votre niveau.</p>
            </div>
            <button type="button" onClick={addLanguage}
              className="inline-flex items-center gap-1.5 self-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark sm:self-auto">
              <Plus size={15} />
              Ajouter une langue
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {languages.length === 0 && (
              <div className="col-span-full py-8 text-center text-sm text-muted-light dark:text-muted-dark">
                Aucune langue ajoutée.
              </div>
            )}
            {languages.map((lang, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200/80 p-3 dark:border-gray-700 sm:flex-nowrap">
                <Globe size={16} className="shrink-0 text-accent" />
                <input value={lang.name} onChange={(e) => updateLanguage(i, 'name', e.target.value)}
                  className="w-28 rounded-lg border border-gray-200/80 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-700"
                  placeholder="Français" />
                <div className="relative">
                  <select value={lang.level} onChange={(e) => updateLanguage(i, 'level', e.target.value)}
                    className="w-32 appearance-none rounded-lg border border-gray-200/80 bg-transparent px-3 py-2 pr-8 text-sm outline-none focus:border-accent dark:border-gray-700">
                    <option value="">Niveau</option>
                    <option value="Maternel">Maternel</option>
                    <option value="Courant">Courant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Débutant">Débutant</option>
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
                  <div className="relative h-1.5 flex-1 sm:w-20 sm:flex-none">
                    <div className="h-full w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${lang.percent}%` }} />
                    </div>
                    <div className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-white dark:bg-[#18181C]" style={{ left: `${lang.percent}%` }} />
                    <input type="range" min={0} max={100} value={lang.percent}
                      onChange={(e) => updateLanguage(i, 'percent', Number(e.target.value))}
                      className="absolute inset-0 w-full cursor-pointer opacity-0" />
                  </div>
                  <span className="w-7 shrink-0 text-right text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">{lang.percent}%</span>
                  <button type="button" onClick={() => removeLanguage(i)}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200/80 pt-6 dark:border-gray-800">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60">
            <Save size={16} />
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}