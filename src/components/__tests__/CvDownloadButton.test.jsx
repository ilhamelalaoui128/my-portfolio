import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false, theme: 'light', setTheme: vi.fn(), toggleTheme: vi.fn() }),
}))

const mockFetchProfile = vi.fn()
vi.mock('../../lib/api', () => ({
  fetchProfile: (...args) => mockFetchProfile(...args),
}))

import CvDownloadButton from '../CvDownloadButton'

describe('CvDownloadButton', () => {
  beforeEach(() => {
    mockFetchProfile.mockResolvedValue({ cvUrl: '/custom-cv.pdf' })
  })

  it('renders a download link with default CV URL initially', () => {
    mockFetchProfile.mockResolvedValue(null)
    render(<CvDownloadButton />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/cv.pdf')
    expect(link).toHaveAttribute('download', 'CV_ILHAM.pdf')
  })

  it('updates href after fetching profile CV URL', async () => {
    render(<CvDownloadButton />)
    const link = await screen.findByRole('link')
    expect(link).toHaveAttribute('href', '/custom-cv.pdf')
  })

  it('renders compact variant by default', () => {
    render(<CvDownloadButton />)
    expect(screen.getByText('CV')).toBeInTheDocument()
  })

  it('renders full variant with different text', () => {
    render(<CvDownloadButton variant="full" />)
    expect(screen.getByText('Télécharger le CV')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<CvDownloadButton className="my-class" />)
    const link = screen.getByRole('link')
    expect(link.className).toContain('my-class')
  })
})
