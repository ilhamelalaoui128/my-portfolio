import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', p: 'p', span: 'span' },
  AnimatePresence: ({ children }) => children,
}))

const mockTheme = vi.hoisted(() => ({ isDark: false }))
vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => mockTheme,
}))

const mockData = vi.hoisted(() => ({ profile: null, isLive: false }))
vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockData,
}))

vi.mock('../Ferrofluid/Ferrofluid', () => ({
  default: () => null,
}))

import Hero from '../Hero'

const defaultProfile = {
  name: 'Ilham',
  fullName: 'Ilham El-Alaoui',
  title: 'Développeuse Full-Stack',
  subtitle: 'Licenciée en Informatique',
  tagline: 'Passionnée par le développement.',
  location: 'Oujda, Maroc',
  email: 'test@test.com',
  seekingType: null,
  social: {
    github: 'https://github.com/test',
    linkedin: 'https://linkedin.com/in/test',
  },
}

describe('Hero', () => {
  beforeEach(() => {
    mockData.profile = defaultProfile
    mockData.isLive = false
    mockTheme.isDark = false
  })

  it('renders profile name, title, and tagline', () => {
    render(<Hero />)
    expect(screen.getByText(/Ilham El-Alaoui/)).toBeInTheDocument()
    expect(screen.getByText('Développeuse Full-Stack')).toBeInTheDocument()
    expect(screen.getByText('Passionnée par le développement.')).toBeInTheDocument()
  })

  it('renders location', () => {
    render(<Hero />)
    expect(screen.getByText('Oujda, Maroc')).toBeInTheDocument()
  })

  it('renders social links with correct hrefs', () => {
    render(<Hero />)
    expect(screen.getByLabelText(/Envoyer un email/)).toHaveAttribute('href', 'mailto:test@test.com')
    expect(screen.getByLabelText('Profil GitHub')).toHaveAttribute('href', 'https://github.com/test')
    expect(screen.getByLabelText('Profil LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/in/test')
  })

  it('uses fallback LinkedIn URL when not in social', () => {
    mockData.profile = { ...defaultProfile, social: { github: '', linkedin: '' } }
    render(<Hero />)
    expect(screen.getByLabelText('Profil LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/in/ilhamelalaoui')
  })

  it('renders stage seeking badge', () => {
    mockData.profile = { ...defaultProfile, seekingType: 'stage', internshipTarget: 'Développeur', internshipPeriod: '2025' }
    render(<Hero />)
    expect(screen.getByText(/Stage/)).toBeInTheDocument()
    expect(screen.getByText(/Développeur/)).toBeInTheDocument()
    expect(screen.getByText(/2025/)).toBeInTheDocument()
  })

  it('renders travail seeking badge', () => {
    mockData.profile = { ...defaultProfile, seekingType: 'travail', jobTarget: 'CDI', jobContract: 'Temps plein' }
    render(<Hero />)
    expect(screen.getByText(/CDI/)).toBeInTheDocument()
    expect(screen.getByText(/Temps plein/)).toBeInTheDocument()
  })

  it('renders subtitle when present', () => {
    render(<Hero />)
    expect(screen.getByText('Licenciée en Informatique')).toBeInTheDocument()
  })

  it('returns null when profile is null', () => {
    mockData.profile = null
    const { container } = render(<Hero />)
    expect(container.innerHTML).toBe('')
  })

  it('shows Supabase badge when isLive is true', () => {
    mockData.isLive = true
    render(<Hero />)
    expect(screen.getByText('Supabase')).toBeInTheDocument()
  })

  it('shows Fallback badge when isLive is false', () => {
    render(<Hero />)
    expect(screen.getByText('Fallback')).toBeInTheDocument()
  })
})
