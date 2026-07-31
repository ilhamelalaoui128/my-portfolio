import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getSession, signInAdmin, signOutAdmin } from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabaseClient'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false)
      return undefined
    }
    getSession().then((s) => {
      setSession(s)
      setChecking(false)
    })
  }, [])

  const signIn = useCallback(async (email, password, captchaToken) => {
    const s = await signInAdmin(email, password, captchaToken)
    setSession(s)
    return s
  }, [])

  const signOut = useCallback(async () => {
    await signOutAdmin()
    setSession(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ session, setSession, signIn, signOut, checking }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
