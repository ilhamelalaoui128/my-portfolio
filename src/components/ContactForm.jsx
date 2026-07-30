import { useState } from 'react'
import { Send } from 'lucide-react'
import SectionHeading from './SectionHeading'
import ScrollReveal from './ScrollReveal'
import ContactInfo from './ContactInfo'
import { submitContactMessage } from '../lib/api'
import { useToast } from './Toast'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle')
  const toast = useToast()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (honeypot) return

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }

    if (!EMAIL_REGEX.test(form.email)) {
      toast.error('Adresse email invalide.')
      return
    }

    if (form.message.trim().length < 10) {
      toast.error('Le message doit contenir au moins 10 caractères.')
      return
    }

    setStatus('loading')

    try {
      await submitContactMessage(form)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      toast.success('Message envoyé avec succès. Merci !')
    } catch {
      setStatus('error')
      toast.error('Erreur lors de l\'envoi. Réessayez ou contactez-moi par email.')
    }
  }

  return (
    <section id="contact" className="section-padding bg-surface-light dark:bg-surface-dark">
      <div className="container-narrow">
        <SectionHeading
          label="Contact"
          title="Travaillons ensemble"
          description="En recherche de stage — n'hésitez pas à me contacter pour discuter d'une opportunité ou d'un projet."
        />

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <ContactInfo />

          <ScrollReveal className="lg:col-span-3" delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-sm dark:border-gray-800 dark:bg-[#18181C]"
              noValidate
            >
              <div
                className="h-1 bg-gradient-to-r from-accent-dark via-accent to-accent-light"
                aria-hidden="true"
              />

              <div className="p-7 md:p-9">
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Ne pas remplir</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Nom
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="vous@email.com"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="input-field resize-none"
                  placeholder="Décrivez votre projet ou votre demande..."
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition hover:bg-accent-dark disabled:opacity-60"
                >
                  <Send size={16} />
                  {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </div>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
