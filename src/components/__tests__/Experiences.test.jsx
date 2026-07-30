import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }) => children,
  useReducedMotion: () => false,
}))

const mockData = vi.hoisted(() => ({ experiences: null }))

vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockData,
}))

import Experiences from '../Experiences'

describe('Experiences', () => {
  it('renders non-education experiences', () => {
    mockData.experiences = [
      { id: '1', title: 'Job', type: 'work', company: 'Co', period: '2024', description: 'Worked' },
      { id: '2', title: 'Stage', type: 'stage', company: 'Co', period: '2023', description: 'Interned' },
    ]
    render(<Experiences />)
    expect(screen.getByText('Job')).toBeInTheDocument()
    expect(screen.getByText('Stage')).toBeInTheDocument()
  })

  it('filters out education experiences', () => {
    mockData.experiences = [
      { id: '1', title: 'Education 1', type: 'education', company: 'School', period: '2024', description: 'Studied' },
      { id: '2', title: 'Stage 1', type: 'stage', company: 'Co', period: '2023', description: 'Worked' },
    ]
    render(<Experiences />)
    expect(screen.queryByText('Education 1')).not.toBeInTheDocument()
    expect(screen.getByText('Stage 1')).toBeInTheDocument()
  })

  it('returns null when experiences is null', () => {
    mockData.experiences = null
    const { container } = render(<Experiences />)
    expect(container.innerHTML).toBe('')
  })

  it('returns null when filtered list is empty', () => {
    mockData.experiences = [
      { id: '1', title: 'Edu', type: 'education', company: 'S', period: '2024', description: 'D' },
    ]
    const { container } = render(<Experiences />)
    expect(container.innerHTML).toBe('')
  })

  it('renders SectionHeading with correct labels', () => {
    mockData.experiences = [
      { id: '1', title: 'Stage', type: 'stage', company: 'Co', period: '2024', description: 'D' },
    ]
    render(<Experiences />)
    expect(screen.getByText('Professionnel')).toBeInTheDocument()
    expect(screen.getByText('Expériences')).toBeInTheDocument()
  })
})
