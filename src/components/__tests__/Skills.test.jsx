import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }) => children,
}))

const mockData = vi.hoisted(() => ({ skills: null, languages: null }))
vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockData,
}))

import Skills from '../Skills'

const defaultSkills = [
  { category: 'Développement Web', items: [{ name: 'React', level: 85 }, { name: 'CSS', level: 90 }] },
  { category: 'Logiciel & Back-End', items: [{ name: 'Java', level: 70 }, { name: 'Python', level: 65 }] },
]

const defaultLanguages = [
  { name: 'Français', level: 'Courant', percent: 95 },
  { name: 'Anglais', level: 'Intermédiaire', percent: 65 },
]

describe('Skills', () => {
  beforeEach(() => {
    mockData.skills = defaultSkills
    mockData.languages = defaultLanguages
  })

  it('renders skill categories with items', () => {
    render(<Skills />)
    expect(screen.getByText('Développement Web')).toBeInTheDocument()
    expect(screen.getByText('Logiciel & Back-End')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('renders skill percentages', () => {
    render(<Skills />)
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('renders languages section', () => {
    render(<Skills />)
    expect(screen.getByText('Langues')).toBeInTheDocument()
    expect(screen.getByText('Français')).toBeInTheDocument()
    expect(screen.getByText('Anglais')).toBeInTheDocument()
    expect(screen.getByText('Courant')).toBeInTheDocument()
    expect(screen.getByText('Intermédiaire')).toBeInTheDocument()
  })

  it('does not render languages when langData is empty', () => {
    mockData.languages = []
    render(<Skills />)
    expect(screen.queryByText('Langues')).not.toBeInTheDocument()
  })

  it('does not render languages when langData is null', () => {
    mockData.languages = null
    render(<Skills />)
    expect(screen.queryByText('Langues')).not.toBeInTheDocument()
  })

  it('returns null when skillData is null', () => {
    mockData.skills = null
    const { container } = render(<Skills />)
    expect(container.innerHTML).toBe('')
  })

  it('renders section heading', () => {
    render(<Skills />)
    expect(screen.getByText('Compétences')).toBeInTheDocument()
    expect(screen.getByText('Stack & outils')).toBeInTheDocument()
  })
})
