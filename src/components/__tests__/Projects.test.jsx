import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }) => children,
  useReducedMotion: () => false,
}))

const mockData = vi.hoisted(() => ({ projects: null }))

vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockData,
}))

import Projects from '../Projects'

describe('Projects', () => {
  it('renders project cards from context', () => {
    mockData.projects = [
      { id: '1', title: 'Project A', description: 'Desc A', stack: [], image_url: '' },
      { id: '2', title: 'Project B', description: 'Desc B', stack: [], image_url: '' },
    ]
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(screen.getByText('Project A')).toBeInTheDocument()
    expect(screen.getByText('Project B')).toBeInTheDocument()
  })

  it('renders SectionHeading with correct labels', () => {
    mockData.projects = [{ id: '1', title: 'P', description: 'D', stack: [], image_url: '' }]
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Projets récents')).toBeInTheDocument()
  })

  it('returns null when projects is null', () => {
    mockData.projects = null
    const { container } = render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders section shell when projects is empty array', () => {
    mockData.projects = []
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Projets récents')).toBeInTheDocument()
    expect(screen.queryByText('Project')).not.toBeInTheDocument()
  })
})
