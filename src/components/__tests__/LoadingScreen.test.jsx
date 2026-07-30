import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: { div: 'div', p: 'p' },
  AnimatePresence: ({ children }) => children,
}))

import LoadingScreen from '../LoadingScreen'

describe('LoadingScreen', () => {
  it('renders name and subtitle', () => {
    render(<LoadingScreen progress={50} />)
    expect(screen.getByText(/Ilham El Alaoui/)).toBeInTheDocument()
    expect(screen.getByText('Développeuse Web')).toBeInTheDocument()
  })

  it('displays progress percentage', () => {
    render(<LoadingScreen progress={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('updates bar transform on progress change', () => {
    const { container } = render(<LoadingScreen progress={42} />)
    const bar = container.querySelector('[class*="origin-left"]')
    expect(bar).toHaveStyle('transform: scaleX(0.42)')
  })

  it('has correct accessibility attributes', () => {
    render(<LoadingScreen progress={0} />)
    const el = screen.getByRole('status')
    expect(el).toHaveAttribute('aria-label', 'Chargement du portfolio')
    expect(el).toHaveAttribute('aria-live', 'polite')
  })
})
