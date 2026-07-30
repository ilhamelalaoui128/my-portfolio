import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }) => children,
}))

const mockData = vi.hoisted(() => ({ profile: null }))
vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockData,
}))

import About from '../About'

const defaultProfile = {
  name: 'Ilham',
  fullName: 'Ilham El-Alaoui',
  title: 'Développeuse Full-Stack',
  location: 'Oujda, Maroc',
  photoUrl: '/photo.png',
  seekingType: null,
  about: {
    bio: 'Passionnée par le développement.\n\nToujours en apprentissage.',
    stack: [
      { category: 'Frontend', items: ['React', 'Vue'] },
      { category: 'Backend', items: ['Node.js', 'Python'] },
    ],
    values: [
      { label: 'Créativité', desc: 'Trouver des solutions originales' },
      { label: 'Rigueur', desc: 'Code propre et bien testé' },
    ],
  },
}

describe('About', () => {
  beforeEach(() => {
    mockData.profile = defaultProfile
  })

  it('renders profile photo, name, and title', () => {
    render(<About />)
    const img = screen.getByAltText(/Portrait/)
    expect(img).toHaveAttribute('src', '/photo.png')
    expect(screen.getByText('Ilham El-Alaoui')).toBeInTheDocument()
    expect(screen.getByText('Développeuse Full-Stack')).toBeInTheDocument()
  })

  it('renders bio paragraphs split by line breaks', () => {
    render(<About />)
    expect(screen.getByText('Passionnée par le développement.')).toBeInTheDocument()
    expect(screen.getByText('Toujours en apprentissage.')).toBeInTheDocument()
  })

  it('renders stack categories with items', () => {
    render(<About />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Vue')).toBeInTheDocument()
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('renders values cards', () => {
    render(<About />)
    expect(screen.getByText('Créativité')).toBeInTheDocument()
    expect(screen.getByText('Trouver des solutions originales')).toBeInTheDocument()
    expect(screen.getByText('Rigueur')).toBeInTheDocument()
    expect(screen.getByText('Code propre et bien testé')).toBeInTheDocument()
  })

  it('renders stage seeking badge', () => {
    mockData.profile = { ...defaultProfile, seekingType: 'stage', internshipTarget: 'Stagiaire' }
    render(<About />)
    expect(screen.getByText(/Stagiaire/)).toBeInTheDocument()
  })

  it('renders travail seeking badge', () => {
    mockData.profile = { ...defaultProfile, seekingType: 'travail', jobTarget: 'CDI', jobContract: 'CDI' }
    render(<About />)
    expect(screen.getByText(/CDI/)).toBeInTheDocument()
  })

  it('returns null when profile is null', () => {
    mockData.profile = null
    const { container } = render(<About />)
    expect(container.innerHTML).toBe('')
  })

  it('renders section heading', () => {
    render(<About />)
    expect(screen.getByText('À propos')).toBeInTheDocument()
    expect(screen.getByText('Qui suis-je ?')).toBeInTheDocument()
  })
})
