import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, ShieldCheck, Send } from 'lucide-react'
import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
  updateAdminPassword,
} from '../lib/api'
import { useToast } from '../components/Toast'
import TurnstileCaptcha, { TURNSTILE_SITE_KEY } from '../components/TurnstileCaptcha'

const fieldClass =
  'flex items-center rounded-xl border border-accent/20 bg-[#FFF8F5] shadow-sm shadow-accent/5 transition duration-200 focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/20 dark:border-accent/25 dark:bg-[#18181C] dark:focus-within:border-accent dark:focus-within:bg-[#1E1E22] dark:focus-within:ring-accent/25'
const inputClass =
  'w-full bg-transparent py-2.5 pl-3 pr-4 text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500'

const resetErrorToMessage = (err) => {
  const msg = (err && err.message) || ''
  if (msg.toLowerCase().includes('captcha')) {
    return 'Captcha invalide ou expiré, réessayez.'
  }
  if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many')) {
    return 'Trop de tentatives. Attendez quelques minutes puis réessayez.'
  }
  if (msg.toLowerCase().includes('token') || msg.toLowerCase().includes('otp')) {
    return 'Code invalide ou expiré, réessayez.'
  }
  if (msg.includes('Supabase indisponible')) return msg
  if (msg.includes('Supabase non configuré')) return msg
  return 'Une erreur est survenue, réessayez.'
}

export default function ForgotPassword({ onBack }) {
  const toast = useToast()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const digitsRef = useRef(['', '', '', '', '', ''])
  const digitRefs = useRef([])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaKey, setCaptchaKey] = useState(0)
  const [captchaVisible, setCaptchaVisible] = useState(false)
  const captchaTokenRef = useRef('')
  const autoSubmitRef = useRef(false)

  const sendCode = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (step !== 'email') return
    if (TURNSTILE_SITE_KEY && !captchaTokenRef.current) {
      autoSubmitRef.current = true
      setCaptchaVisible(true)
      return
    }
    autoSubmitRef.current = false
    setLoading(true)
    try {
      await sendPasswordResetCode(email, captchaTokenRef.current)
      setStep('code')
      toast.success('Code envoyé. Vérifiez votre boîte mail.')
    } catch (err) {
      toast.error(resetErrorToMessage(err))
      setCaptchaToken('')
      captchaTokenRef.current = ''
      setCaptchaKey((k) => k + 1)
    } finally {
      setLoading(false)
    }
  }

  const onCaptchaToken = (token) => {
    setCaptchaToken(token)
    captchaTokenRef.current = token
    if (autoSubmitRef.current) sendCode()
  }

  const onCaptchaReset = () => {
    setCaptchaToken('')
    captchaTokenRef.current = ''
  }

  const setDigitsState = (next) => {
    digitsRef.current = next
    setDigits(next)
  }

  useEffect(() => {
    if (step === 'code') {
      setDigitsState(['', '', '', '', '', ''])
      setTimeout(() => digitRefs.current[0]?.focus(), 0)
    }
  }, [step])

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, '')
    if (!clean) return
    const next = [...digitsRef.current]
    clean.split('').forEach((d, i) => {
      if (index + i < 6) next[index + i] = d
    })
    setDigitsState(next)
    const target = index + clean.length
    if (target < 6) {
      digitRefs.current[target]?.focus()
    } else if (next.every((d) => d !== '')) {
      verifyCode()
    }
  }

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (digitsRef.current[index]) {
        const next = [...digitsRef.current]
        next[index] = ''
        setDigitsState(next)
      } else if (index > 0) {
        const next = [...digitsRef.current]
        next[index - 1] = ''
        setDigitsState(next)
        digitRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      digitRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const clean = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!clean) return
    e.preventDefault()
    const next = [...digitsRef.current]
    clean.split('').forEach((d, i) => {
      if (i < 6) next[i] = d
    })
    setDigitsState(next)
    if (clean.length >= 6 && next.every((d) => d !== '')) {
      verifyCode()
    } else {
      digitRefs.current[Math.min(clean.length, 5)]?.focus()
    }
  }

  const verifyCode = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const code = digitsRef.current.join('')
    if (code.length !== 6) {
      toast.error('Le code doit contenir 6 chiffres.')
      return
    }
    setLoading(true)
    try {
      await verifyPasswordResetCode(email, code)
      setStep('password')
      toast.success('Code vérifié. Choisissez un nouveau mot de passe.')
    } catch (err) {
      toast.error(resetErrorToMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (e) => {
    e.preventDefault()
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
      await updateAdminPassword(password)
      toast.success('Mot de passe mis à jour. Connectez-vous.')
      onBack()
    } catch (err) {
      toast.error(resetErrorToMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const header = {
    email: { title: 'Mot de passe oublié', desc: 'Entrez votre email pour recevoir un code de vérification.' },
    code: { title: 'Code de vérification', desc: 'Saisissez le code à 6 chiffres reçu par email.' },
    password: { title: 'Nouveau mot de passe', desc: 'Choisissez un nouveau mot de passe (8 caractères min.).' },
  }[step]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm sm:max-w-md"
    >
      <form
        onSubmit={step === 'email' ? sendCode : step === 'code' ? verifyCode : updatePassword}
        className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18181C]"
      >
          <div className="h-1 bg-gradient-to-r from-accent-dark via-accent to-accent-light" aria-hidden="true" />

          <div className="p-6 sm:p-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
              <ShieldCheck size={24} className="text-accent" strokeWidth={1.75} />
            </div>

            <h1 className="text-center font-display text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {header.title}
            </h1>
            <p className="mt-1.5 text-center text-sm text-muted-light dark:text-muted-dark">
              {header.desc}
            </p>

            <div className="mt-6 space-y-4">
              {step === 'email' && (
                <div>
                  <label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Email
                  </label>
                  <div className={fieldClass}>
                    <Mail size={16} className="ml-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                    <input
                      id="reset-email" type="email" placeholder="vous@email.com" required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {captchaVisible && TURNSTILE_SITE_KEY && (
                    <div className="mt-3">
                      <TurnstileCaptcha
                        key={captchaKey}
                        onToken={onCaptchaToken}
                        onExpired={onCaptchaReset}
                        onError={onCaptchaReset}
                      />
                      {!captchaToken && (
                        <p className="mt-1.5 text-center text-xs text-muted-light dark:text-muted-dark">
                          Résolvez le captcha pour continuer.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === 'code' && (
                <div>
                  <label htmlFor="reset-code" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Code à 6 chiffres
                  </label>
                  <div className="grid grid-cols-6 gap-2" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { digitRefs.current[i] = el }}
                        id={i === 0 ? 'reset-code' : undefined}
                        type="text" inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} required
                        maxLength={6} aria-label={`Chiffre ${i + 1}`}
                        value={d}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(i, e)}
                        className="w-full rounded-xl border border-accent/20 bg-[#FFF8F5] px-0 py-3 text-center font-display text-xl font-bold text-gray-900 outline-none shadow-sm shadow-accent/5 transition duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 dark:border-accent/25 dark:bg-[#18181C] dark:text-white dark:focus:border-accent dark:focus:bg-[#1E1E22] dark:focus:ring-accent/25"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-light dark:text-muted-dark">
                    Code envoyé à <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
                  </p>
                </div>
              )}

              {step === 'password' && (
                <>
                  <div>
                    <label htmlFor="reset-password" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                      Nouveau mot de passe
                    </label>
                    <div className={fieldClass}>
                      <Lock size={16} className="ml-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                      <input
                        id="reset-password" type="password" placeholder="••••••••" required
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
                        id="reset-confirm" type="password" placeholder="••••••••" required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-2.5 font-semibold text-white shadow-md shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {step === 'email' ? 'Envoi...' : step === 'code' ? 'Vérification...' : 'Mise à jour...'}
                </>
              ) : (
                <>
                  <Send size={16} />
                  {step === 'email' ? 'Envoyer le code' : step === 'code' ? 'Vérifier le code' : 'Mettre à jour'}
                </>
              )}
            </button>

            <div className="mt-4 flex flex-col items-center gap-1.5 text-sm">
              {step === 'code' && (
                <button
                  type="button"
                  onClick={() => {
                    setCaptchaToken('')
                    captchaTokenRef.current = ''
                    setCaptchaVisible(false)
                    setStep('email')
                  }}
                  className="font-medium text-muted-light transition hover:text-accent dark:text-muted-dark"
                >
                  Changer d'email
                </button>
              )}
              <button
                type="button"
                onClick={() => (step === 'email' ? onBack() : step === 'code' ? setStep('email') : setStep('code'))}
                className="inline-flex items-center gap-1 font-medium text-muted-light transition hover:text-accent dark:text-muted-dark"
              >
                <ArrowLeft size={13} />
                {step === 'email' ? 'Retour à la connexion' : 'Retour'}
              </button>
            </div>
          </div>
        </form>
    </motion.div>
  )
}
