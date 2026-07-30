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

import Timeline from '../Timeline'

describe('Timeline', () => {
  it('renders education experiences', () => {
    mockData.experiences = [
      { id: '1', title: 'Degree', type: 'education', company: 'Uni', period: '2024', description: 'Studied' },
      { id: '2', title: 'Stage', type: 'stage', company: 'Co', period: '2023', description: 'Worked' },
    ]
    render(<Timeline />)
    expect(screen.getByText('Degree')).toBeInTheDocument()
    expect(screen.queryByText('Stage')).not.toBeInTheDocument()
  })

  it('returns null when experiences is null', () => {
    mockData.experiences = null
    const { container } = render(<Timeline />)
    expect(container.innerHTML).toBe('')
  })

  it('returns null when no education items', () => {
    mockData.experiences = [
      { id: '1', title: 'Stage', type: 'stage', company: 'Co', period: '2023', description: 'W' },
    ]
    render(<Timeline />)
    expect(screen.queryByText('Stage')).not.toBeInTheDocument()
  })

  it('renders SectionHeading with correct labels', () => {
    mockData.experiences = [
      { id: '1', title: 'Degree', type: 'education', company: 'Uni', period: '2024', description: 'D' },
    ]
    render(<Timeline />)
    expect(screen.getByText('Parcours')).toBeInTheDocument()
    expect(screen.getByText('Formation')).toBeInTheDocument()
  })
})
