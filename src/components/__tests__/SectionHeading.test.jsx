import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHeading from '../SectionHeading'

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }) => children,
  useReducedMotion: () => false,
}))

describe('SectionHeading', () => {
  it('renders label, title, and description', () => {
    render(<SectionHeading label="TestLabel" title="TestTitle" description="TestDesc" />)
    expect(screen.getByText('TestLabel')).toBeInTheDocument()
    expect(screen.getByText('TestTitle')).toBeInTheDocument()
    expect(screen.getByText('TestDesc')).toBeInTheDocument()
  })

  it('renders without description', () => {
    render(<SectionHeading label="L" title="T" />)
    expect(screen.getByText('L')).toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument()
    expect(screen.queryByText('TestDesc')).not.toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<SectionHeading title="T" description="D" />)
    expect(screen.queryByText('TestLabel')).not.toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<SectionHeading title="T" className="custom-class" />)
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
