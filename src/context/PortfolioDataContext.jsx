import { createContext, useContext, useState, useEffect } from 'react'
import { fetchProfile, fetchSkills, fetchLanguages, fetchProjects, fetchExperiences, getProfileSource } from '../lib/api'

const PortfolioDataContext = createContext(null)

export function PortfolioDataProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState(null)
  const [languages, setLanguages] = useState(null)
  const [projects, setProjects] = useState(null)
  const [experiences, setExperiences] = useState(null)
  const [ready, setReady] = useState(false)

  const loadAll = () => Promise.all([
    fetchProfile().then(setProfile),
    fetchSkills().then(setSkills),
    fetchLanguages().then(setLanguages),
    fetchProjects().then(setProjects),
    fetchExperiences().then(setExperiences),
  ])

  useEffect(() => {
    loadAll().catch(() => {}).then(() => setReady(true))
  }, [])

  return (
    <PortfolioDataContext.Provider value={{
      ready,
      profile,
      skills,
      languages,
      projects,
      experiences,
      refresh: () => { setReady(false); loadAll().catch(() => {}).then(() => setReady(true)) },
      isLive: getProfileSource() === 'supabase',
    }}>
      {children}
    </PortfolioDataContext.Provider>
  )
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext)
  if (!ctx) throw new Error('usePortfolioData must be used within PortfolioDataProvider')
  return ctx
}
