import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import ProjectImage from '../ProjectImage'

describe('ProjectImage', () => {
  it('renders img when src is valid', () => {
    render(<ProjectImage src="/projects/test.png" alt="Test" />)
    const img = screen.getByRole('img')
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', '/projects/test.png')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('shows placeholder for empty src', () => {
    render(<ProjectImage src="" alt="Test" />)
    expect(screen.getByText('Image indisponible')).toBeInTheDocument()
  })

  it('shows placeholder for "#" src', () => {
    render(<ProjectImage src="#" alt="Test" />)
    expect(screen.getByText('Image indisponible')).toBeInTheDocument()
  })

  it('renders placeholder with role img', () => {
    const { container } = render(<ProjectImage src="" alt="Test" />)
    const placeholder = container.querySelector('[role="img"]')
    expect(placeholder).toBeInTheDocument()
    expect(placeholder).toHaveAttribute('aria-label', 'Image indisponible')
  })

  it('handles image onError by showing placeholder', async () => {
    render(<ProjectImage src="/broken.png" alt="Test" />)
    const img = screen.getByRole('img')
    act(() => { img.dispatchEvent(new Event('error')) })
    await waitFor(() => {
      expect(screen.getByText('Image indisponible')).toBeInTheDocument()
    })
  })

  it('applies imgClassName to the img element', () => {
    render(<ProjectImage src="/test.png" alt="T" imgClassName="custom-img" />)
    const img = screen.getByRole('img')
    expect(img).toHaveClass('custom-img')
  })
})
