import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }) => children,
  useReducedMotion: () => false,
}))

const mockData = vi.hoisted(() => ({ profile: null }))

vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockData,
}))

import Footer from '../Footer'

describe('Footer', () => {
  const defaultProfile = {
    name: 'Ilham',
    fullName: 'Ilham El-Alaoui',
    email: 'test@test.com',
    social: {
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
    },
  }

  it('renders profile name and social links', () => {
    mockData.profile = defaultProfile
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText(/Ilham El-Alaoui/)).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('href', 'mailto:test@test.com')
    expect(screen.getByLabelText('GitHub')).toHaveAttribute('href', 'https://github.com/test')
    expect(screen.getByLabelText('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/in/test')
  })

  it('falls back to profile.name when fullName is missing', () => {
    mockData.profile = { ...defaultProfile, fullName: undefined }
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText(/Ilham/)).toBeInTheDocument()
  })

  it('uses fallback LinkedIn URL when not in profile', () => {
    mockData.profile = { ...defaultProfile, social: { github: '', linkedin: '' } }
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByLabelText('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/in/ilhamelalaoui')
  })

  it('returns null when profile is null', () => {
    mockData.profile = null
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(container.innerHTML).toBe('')
  })
})
