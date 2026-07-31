import { useState } from 'react'
import { KeyRound, RefreshCw, Save, Eye, EyeOff } from 'lucide-react'
import { setRecoveryCode } from '../lib/api'
import { useToast } from '../components/Toast'

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint32Array(10)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 0xffffffff)
  }
  let code = ''
  for (let i = 0; i < bytes.length; i += 1) code += chars[bytes[i] % chars.length]
  return code
}

export default function AdminSecurity() {
  const toast = useToast()
  const [code, setCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (code.trim().length < 8) {
      toast.error('Le code de récupération contient au moins 8 caractères.')
      return
    }
    setLoading(true)
    try {
      await setRecoveryCode(code.trim())
      setCode('')
      toast.success('Code de récupération mis à jour.')
    } catch (err) {
      toast.error((err && err.message) || 'Erreur lors de la mise à jour.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Sécurité</h2>
          <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark sm:mt-1 sm:text-sm">
            Gérez le code de récupération de votre mot de passe.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#18181C] sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <KeyRound size={18} className="text-accent" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-gray-900 dark:text-white">Code de récupération</h3>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                Utilisé sur l'écran « Mot de passe oublié » si vous perdez votre mot de passe. Aucun email n'est nécessaire.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="recovery-code" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
              Nouveau code
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center rounded-xl border border-accent/20 bg-[#FFF8F5] shadow-sm shadow-accent/5 transition duration-200 focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/20 dark:border-accent/25 dark:bg-[#18181C] dark:focus-within:border-accent dark:focus-within:bg-[#1E1E22] dark:focus-within:ring-accent/25">
                <input
                  id="recovery-code" type={showCode ? 'text' : 'password'}
                  placeholder="Ex : A1B2C3D4" autoComplete="off" required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-transparent py-2.5 pl-4 pr-10 font-mono text-gray-900 outline-none placeholder:font-sans placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
                />
                <button
                  type="button" onClick={() => setShowCode((s) => !s)} aria-label={showCode ? 'Masquer' : 'Afficher'}
                  className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:text-accent"
                >
                  {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="button" onClick={() => setCode(generateCode())}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/10"
              >
                <RefreshCw size={15} />
                Générer
              </button>
            </div>
            <p className="mt-1.5 text-xs text-muted-light dark:text-muted-dark">
              8 caractères minimum. Gardez ce code en lieu sûr : il ne peut pas être récupéré par email.
            </p>
          </div>

          <button
            type="submit" disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={15} />
                Enregistrer le code
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
