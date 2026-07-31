import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, KeyRound, Lock, ShieldCheck } from 'lucide-react'
import { recoverPassword } from '../lib/api'
import { useToast } from '../components/Toast'

const fieldClass =
  'flex items-center rounded-xl border border-accent/20 bg-[#FFF8F5] shadow-sm shadow-accent/5 transition duration-200 focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/20 dark:border-accent/25 dark:bg-[#18181C] dark:focus-within:border-accent dark:focus-within:bg-[#1E1E22] dark:focus-within:ring-accent/25'
const inputClass =
  'w-full bg-transparent py-2.5 pl-3 pr-4 text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500'

const resetErrorToMessage = (err) => {
  const msg = (err && err.message) || ''
  if (msg.toLowerCase().includes('captcha')) return 'Captcha invalide ou expiré, réessayez.'
  if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many')) {
    return 'Trop de tentatives. Attendez quelques minutes puis réessayez.'
  }
  if (msg.toLowerCase().includes('code de récupération')) return msg
  if (msg.toLowerCase().includes('compte administrateur')) return msg
  if (msg.toLowerCase().includes('mot de passe doit contenir')) return msg
  if (msg.includes('Supabase indisponible')) return msg
  if (msg.includes('Supabase non configuré')) return msg
  const status = err && err.status ? ` [${err.status}]` : ''
  const code = err && err.code ? ` (${err.code})` : ''
  return msg && msg !== '{}' ? `Erreur${status}${code} : ${msg}` : `Erreur serveur${status}, réessayez plus tard.`
}

export default function ForgotPassword({ onBack }) {
  const toast = useToast()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (code.trim().length < 8) {
      toast.error('Le code de récupération contient au moins 8 caractères.')
      return
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    try {
      await recoverPassword(code.trim(), password)
      toast.success('Mot de passe réinitialisé. Connectez-vous.')
      onBack()
    } catch (err) {
      toast.error(resetErrorToMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm sm:max-w-md"
    >
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18181C]"
      >
        <div className="h-1 bg-gradient-to-r from-accent-dark via-accent to-accent-light" aria-hidden="true" />

        <div className="p-6 sm:p-8">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
            <ShieldCheck size={24} className="text-accent" strokeWidth={1.75} />
          </div>

          <h1 className="text-center font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Mot de passe oublié
          </h1>
          <p className="mt-1.5 text-center text-sm text-muted-light dark:text-muted-dark">
            Entrez votre code de récupération personnel, puis choisissez un nouveau mot de passe.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="reset-code" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                Code de récupération
              </label>
              <div className={fieldClass}>
                <KeyRound size={16} className="ml-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                <input
                  id="reset-code" type="text" placeholder="Ex : A1B2C3D4" autoComplete="off" required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="reset-password" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                Nouveau mot de passe
              </label>
              <div className={fieldClass}>
                <Lock size={16} className="ml-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                <input
                  id="reset-password" type="password" placeholder="••••••••" autoComplete="new-password" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="reset-confirm" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                Confirmer le mot de passe
              </label>
              <div className={fieldClass}>
                <Lock size={16} className="ml-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                <input
                  id="reset-confirm" type="password" placeholder="••••••••" autoComplete="new-password" required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-2.5 font-semibold text-white shadow-md shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Réinitialisation...
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                Réinitialiser le mot de passe
              </>
            )}
          </button>

          <div className="mt-4 flex flex-col items-center gap-1.5 text-sm">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 font-medium text-muted-light transition hover:text-accent dark:text-muted-dark"
            >
              <ArrowLeft size={13} />
              Retour à la connexion
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
