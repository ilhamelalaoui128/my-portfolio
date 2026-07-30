import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }) => children,
  useReducedMotion: () => false,
}))

const mockData = vi.hoisted(() => ({ profile: null }))

vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockData,
}))

import ContactInfo from '../ContactInfo'

describe('ContactInfo', () => {
  const defaultProfile = {
    email: 'test@test.com',
    phone: '+212 6 00 00 00 00',
    phoneHref: 'tel:+212600000000',
    location: 'Oujda, Maroc',
    social: {
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
    },
  }

  it('renders email, phone, location, and social links', () => {
    mockData.profile = defaultProfile
    render(<ContactInfo />)
    expect(screen.getByText('test@test.com')).toBeInTheDocument()
    expect(screen.getByText('+212 6 00 00 00 00')).toBeInTheDocument()
    expect(screen.getByText('Oujda, Maroc')).toBeInTheDocument()
    expect(screen.getByText('ilhamelalaoui128')).toBeInTheDocument()
  })

  it('uses fallback LinkedIn URL when not in profile', () => {
    mockData.profile = { ...defaultProfile, social: { github: '', linkedin: '' } }
    render(<ContactInfo />)
    const linkedinLink = screen.getByText('linkedin.com/in/ilhamelalaoui')
    expect(linkedinLink).toBeInTheDocument()
    expect(linkedinLink.closest('a')).toHaveAttribute('href', 'https://linkedin.com/in/ilhamelalaoui')
  })

  it('uses fallback GitHub URL when not in profile', () => {
    mockData.profile = { ...defaultProfile, social: { github: '', linkedin: '' } }
    render(<ContactInfo />)
    const githubLink = screen.getByText('ilhamelalaoui128').closest('a')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/ilhamelalaoui128')
  })

  it('renders plain text for location (no href)', () => {
    mockData.profile = defaultProfile
    render(<ContactInfo />)
    const location = screen.getByText('Oujda, Maroc')
    expect(location.tagName).toBe('P')
  })

  it('returns null when profile is null', () => {
    mockData.profile = null
    const { container } = render(<ContactInfo />)
    expect(container.innerHTML).toBe('')
  })
})
