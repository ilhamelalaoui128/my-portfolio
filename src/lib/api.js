import { supabase, supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from './supabaseClient'

export const fallbackProfile = {
  name: 'Ilham',
  fullName: 'Ilham El-Alaoui',
  title: 'Développeuse Full-Stack',
  subtitle: 'Licenciée en Informatique — SUP MTI',
  tagline: 'Jeune développeuse Full-Stack passionnée, à la recherche d\'une opportunité en CDI pour contribuer à des projets web et logiciels ambitieux.',
  email: 'ilham.elalaoui.128@gmail.com',
  phone: '+212 7 09 39 88 80',
  phoneHref: 'tel:+212709398880',
  location: 'Oujda, Maroc',
  seekingType: null,
  internshipTarget: '',
  internshipDuration: '',
  internshipPeriod: '',
  internshipDesc: '',
  jobTarget: '',
  jobContract: '',
  jobPeriod: '',
  jobDesc: '',
  cvUrl: '/cv.pdf',
  photoUrl: '/photo.png',
  social: { github: 'https://github.com/ilhamelalaoui128', linkedin: 'https://linkedin.com/in/ilhamelalaoui' },
  about: {
    bio: '',
    values: [],
    focus: { web: [], mobile: [] },
    stack: [],
  },
}

export const fallbackSkills = [
  { category: 'Développement Web', items: [{ name: 'React / Vite', level: 85 }, { name: 'JavaScript', level: 80 }, { name: 'HTML / CSS', level: 90 }, { name: 'Tailwind CSS', level: 85 }, { name: 'PHP / Laravel', level: 75 }, { name: 'Bootstrap', level: 80 }] },
  { category: 'Logiciel & Back-End', items: [{ name: 'Java (Swing)', level: 70 }, { name: 'C#', level: 65 }, { name: 'Kotlin', level: 60 }, { name: 'Python', level: 65 }] },
  { category: 'Data & Outils', items: [{ name: 'Supabase / PostgreSQL', level: 80 }, { name: 'MySQL', level: 75 }, { name: 'Git / GitHub', level: 85 }, { name: 'Netlify', level: 80 }] },
]

export const fallbackLanguages = [
  { name: 'Français', level: 'Courant', percent: 95 },
  { name: 'Anglais', level: 'Intermédiaire', percent: 65 },
]

const fallbackProjects = [
  {
    id: '1',
    title: 'Mini Shop — Plateforme e-commerce',
    description: 'Application e-commerce complète avec catalogue, panier, espace client et tableau de bord d\'administration.',
    content: 'Plateforme e-commerce complète avec interface client (catalogue, panier, espace client) et tableau de bord d\'administration (gestion des produits, des commandes et des utilisateurs).\n\nMise en place de l\'authentification, du stockage d\'images et de la sécurité des données via les règles RLS (Row Level Security) de PostgreSQL.',
    stack: ['React', 'Vite', 'React Router', 'Tailwind CSS', 'Supabase'],
    image_url: '/projects/minishop.png',
    demo_url: 'https://minishopme.netlify.app/',
    repo_url: 'https://github.com/ilhamelalaoui128/mini-shop/',
    featured: true,
    created_at: '2025-10-01',
  },
  {
    id: '2',
    title: 'Quiz Interactif — Application web de quiz',
    description: 'Quiz à choix multiples avec 50+ questions, mode chronométré, historique des scores et plus de 30 tests automatisés.',
    content: 'Application de quiz à choix multiples avec parcours en 4 étapes (Accueil, Configuration, Quiz, Résultats), plus de 50 questions réparties en 3 catégories et 3 niveaux de difficulté.\n\nDéveloppement orienté qualité : mode chronométré, historique des scores, mode sombre/clair, navigation clavier, gestion des erreurs et plus de 30 tests automatisés (unitaires et composants).',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Vitest'],
    image_url: '/projects/quiz.png',
    demo_url: 'https://myquiz4u.netlify.app/',
    repo_url: 'https://github.com/ilhamelalaoui128/my-quiz/',
    featured: true,
    created_at: '2025-06-01',
  },
]

const fallbackExperiences = [
  { id: '1', title: 'Licence Professionnelle en Informatique', company: 'École SUP MTI, Oujda', period: '2025 — 2026', description: 'Formation en cours — consolidation des compétences en développement logiciel et web.', type: 'education' },
  { id: '2', title: 'Technicien Spécialisé en Développement Digital', company: 'Centre Mixte de Formation Professionnelle, Oujda', period: '2023 — 2025', description: 'Formation professionnelle en développement web et logiciel : HTML, CSS, JavaScript, React, PHP, Laravel, Java, C# et bases de données.', type: 'education' },
  { id: '3', title: 'Baccalauréat Sciences Physiques', company: 'Lycée Omar Ibn Abdelaziz, Oujda', period: '2020 — 2021', description: 'Option Français — fondations scientifiques et rigueur analytique.', type: 'education' },
  { id: '4', title: 'Stagiaire Développeuse Full-Stack', company: 'TAGES ENTSI', period: 'Juillet 2026 (1 mois)', description: 'Conception d\'une SaaS multi-tenant de suivi des obligations réglementaires.', type: 'stage' },
  { id: '5', title: 'Stagiaire Développeuse Web', company: 'FSO — Faculté des Sciences d\'Oujda', period: 'Mars 2025 (1 mois)', description: 'Développement d\'un site de commande pour restaurant.', type: 'stage' },
]

let supabaseUnavailable = false
let liveSourceDetected = false
let wakeupPromise = null

async function ensureSupabaseReady() {
  if (supabaseUnavailable) return false
  if (!wakeupPromise) {
    wakeupPromise = (async () => {
      const deadline = Date.now() + 15000
      while (Date.now() < deadline) {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/settings?select=key&limit=1`, {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          })
          if (res.ok) return true
        } catch {}
        await new Promise((r) => setTimeout(r, 3000))
      }
      return false
    })().then((ok) => {
      if (!ok) supabaseUnavailable = true
      return ok
    })
  }
  return wakeupPromise
}

export function getProfileSource() {
  return liveSourceDetected ? 'supabase' : 'fallback'
}

export function isUsingLiveData() {
  return isSupabaseConfigured && !supabaseUnavailable
}

const STORAGE_KEYS = {
  projects: 'portfolio_demo_projects',
  experiences: 'portfolio_demo_experiences',
  messages: 'portfolio_demo_messages',
  settings: 'portfolio_demo_settings',
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  const arr = [...fallback]
  localStorage.setItem(key, JSON.stringify(arr))
  return arr
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getDemoProjects() {
  return loadFromStorage(STORAGE_KEYS.projects, fallbackProjects)
}

function getDemoExperiences() {
  return mergeFallbackExperiences(loadFromStorage(STORAGE_KEYS.experiences, fallbackExperiences))
}

function mergeFallbackExperiences(stored) {
  const fallbackIds = new Set(fallbackExperiences.map((e) => e.id))
  const merged = [...stored]
  for (const fb of fallbackExperiences) {
    if (!merged.some((e) => e.id === fb.id)) merged.push(fb)
  }
  return merged
}

function getDemoMessages() {
  return loadFromStorage(STORAGE_KEYS.messages, [])
}

export async function fetchProjects() {
  if (!isSupabaseConfigured || supabaseUnavailable) return getDemoProjects()
  if (!(await ensureSupabaseReady())) return getDemoProjects()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data?.length) { supabaseUnavailable = true; return getDemoProjects() }
  return data
}

export async function fetchProjectById(id) {
  if (!isSupabaseConfigured || supabaseUnavailable) {
    return getDemoProjects().find((p) => p.id === id) || null
  }
  if (!(await ensureSupabaseReady())) {
    return getDemoProjects().find((p) => p.id === id) || null
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    supabaseUnavailable = true
    return getDemoProjects().find((p) => p.id === id) || null
  }
  return data
}

export async function fetchExperiences() {
  if (!isSupabaseConfigured || supabaseUnavailable) return getDemoExperiences()
  if (!(await ensureSupabaseReady())) return getDemoExperiences()

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data?.length) { supabaseUnavailable = true; return getDemoExperiences() }
  return data
}

export async function submitContactMessage({ name, email, message }) {
  if (!isSupabaseConfigured) {
    const msgs = getDemoMessages()
    const created = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      created_at: new Date().toISOString(),
    }
    msgs.unshift(created)
    saveToStorage(STORAGE_KEYS.messages, msgs)
    await new Promise((r) => setTimeout(r, 800))
    return { success: true, demo: true }
  }
  if (!(await ensureSupabaseReady())) {
    throw new Error('Supabase indisponible, réessayez dans un instant.')
  }

  const { error } = await supabase.from('messages').insert({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  })

  if (error) throw error
  return { success: true }
}

export async function signInAdmin(email, password, captchaToken) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configuré')
  if (!(await ensureSupabaseReady())) {
    throw new Error('Supabase indisponible, réessayez dans un instant.')
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  })
  if (error) throw error
  return data
}

export async function signOutAdmin() {
  if (!isSupabaseConfigured) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function setRecoveryCode(code) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configuré')
  if (!(await ensureSupabaseReady())) {
    throw new Error('Supabase indisponible, réessayez dans un instant.')
  }
  const { error } = await supabase.rpc('set_recovery_code', { new_code: code })
  if (error) throw error
  return true
}

export async function recoverPassword(code, newPassword) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configuré')
  if (!(await ensureSupabaseReady())) {
    throw new Error('Supabase indisponible, réessayez dans un instant.')
  }
  const { error } = await supabase.rpc('recover_admin_password', {
    recovery_code: code,
    new_password: newPassword,
  })
  if (error) throw error
  return true
}

export async function uploadImage(file) {
  const toDataURL = () => new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })

  if (!isSupabaseConfigured) return toDataURL()

  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('project-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) {
    console.warn('Supabase storage upload failed, falling back to data URL:', error.message)
    return toDataURL()
  }

  const { data: { publicUrl } } = supabase.storage
    .from('project-images')
    .getPublicUrl(path)

  return publicUrl
}

export async function createProject(project) {
  if (!isSupabaseConfigured) {
    await new Promise((r) => setTimeout(r, 300))
    const projects = getDemoProjects()
    const created = { ...project, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    projects.unshift(created)
    saveToStorage(STORAGE_KEYS.projects, projects)
    return created
  }
  const { data, error } = await supabase.from('projects').insert(project).select().single()
  if (error) throw error
  return data
}

export async function updateProject(id, updates) {
  if (!isSupabaseConfigured) {
    await new Promise((r) => setTimeout(r, 300))
    const projects = getDemoProjects()
    const idx = projects.findIndex((p) => p.id === id)
    if (idx !== -1) projects[idx] = { ...projects[idx], ...updates }
    saveToStorage(STORAGE_KEYS.projects, projects)
    return { ...updates, id }
  }
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  if (!isSupabaseConfigured) {
    await new Promise((r) => setTimeout(r, 300))
    const projects = getDemoProjects()
    const idx = projects.findIndex((p) => p.id === id)
    if (idx !== -1) projects.splice(idx, 1)
    saveToStorage(STORAGE_KEYS.projects, projects)
    return
  }
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function fetchMessages() {
  if (!isSupabaseConfigured || supabaseUnavailable) return getDemoMessages()
  if (!(await ensureSupabaseReady())) return getDemoMessages()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) { supabaseUnavailable = true; return [] }
  return data
}

export async function deleteMessage(id) {
  if (!isSupabaseConfigured) {
    await new Promise((r) => setTimeout(r, 300))
    const msgs = getDemoMessages()
    const idx = msgs.findIndex((m) => m.id === id)
    if (idx !== -1) msgs.splice(idx, 1)
    saveToStorage(STORAGE_KEYS.messages, msgs)
    return
  }
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) throw error
}

export async function createExperience(exp) {
  if (!isSupabaseConfigured) {
    await new Promise((r) => setTimeout(r, 300))
    const exps = getDemoExperiences()
    const created = { ...exp, id: crypto.randomUUID(), sort_order: exps.length + 1 }
    exps.push(created)
    saveToStorage(STORAGE_KEYS.experiences, exps)
    return created
  }
  const { data, error } = await supabase.from('experiences').insert(exp).select().single()
  if (error) throw error
  return data
}

export async function updateExperience(id, updates) {
  if (!isSupabaseConfigured) {
    await new Promise((r) => setTimeout(r, 300))
    const exps = getDemoExperiences()
    const idx = exps.findIndex((e) => e.id === id)
    if (idx !== -1) exps[idx] = { ...exps[idx], ...updates }
    saveToStorage(STORAGE_KEYS.experiences, exps)
    return { ...updates, id }
  }
  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteExperience(id) {
  if (!isSupabaseConfigured) {
    await new Promise((r) => setTimeout(r, 300))
    const exps = getDemoExperiences()
    const idx = exps.findIndex((e) => e.id === id)
    if (idx !== -1) exps.splice(idx, 1)
    saveToStorage(STORAGE_KEYS.experiences, exps)
    return
  }
  const { error } = await supabase.from('experiences').delete().eq('id', id)
  if (error) throw error
}

/* ─── Settings (Profile / Skills / Languages) ─── */

function getDemoSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings)
    if (raw) return JSON.parse(raw)
  } catch {}
  const defaults = { profile: fallbackProfile, skills: fallbackSkills, languages: fallbackLanguages }
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(defaults))
  return defaults
}

function saveDemoSettings(data) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(data))
}

function migrateProfile(profile) {
  if (!profile) return profile
  if (Array.isArray(profile.about?.focus)) {
    profile.about.focus = { web: profile.about.focus, mobile: [] }
  }
  if (!profile.about?.stack && profile.about?.focus) {
    const f = profile.about.focus
    const cats = []
    if (f.web?.length) cats.push({ category: 'Frontend', items: f.web })
    if (f.mobile?.length) cats.push({ category: 'Mobile', items: f.mobile })
    profile.about.stack = cats
  }
  return profile
}

export async function fetchProfile() {
  return migrateProfile(await fetchFromSettings('profile', fallbackProfile))
}

export async function updateProfile(profileData) {
  return saveToSettings('profile', profileData)
}

async function fetchFromSettings(key, fallback) {
  if (!isSupabaseConfigured || supabaseUnavailable) return getDemoSettings()[key]
  if (!(await ensureSupabaseReady())) return getDemoSettings()[key] ?? fallback
  try {
    const { data, error } = await supabase.from('settings').select('value').eq('key', key).single()
    if (!error && data) { liveSourceDetected = true; return data.value }
    supabaseUnavailable = true
  } catch {
    supabaseUnavailable = true
  }
  return getDemoSettings()[key] ?? fallback
}

async function saveToSettings(key, value) {
  if (!isSupabaseConfigured || supabaseUnavailable) {
    await new Promise((r) => setTimeout(r, 300))
    const settings = getDemoSettings()
    settings[key] = value
    saveDemoSettings(settings)
    return value
  }
  try {
    const { error } = await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' })
    if (error) throw error
  } catch {
    supabaseUnavailable = true
    const settings = getDemoSettings()
    settings[key] = value
    saveDemoSettings(settings)
  }
  return value
}

export async function fetchSkills() {
  return fetchFromSettings('skills', fallbackSkills)
}

export async function updateSkills(skillsData) {
  return saveToSettings('skills', skillsData)
}

export async function fetchLanguages() {
  return fetchFromSettings('languages', fallbackLanguages)
}

export async function updateLanguages(languagesData) {
  return saveToSettings('languages', languagesData)
}
