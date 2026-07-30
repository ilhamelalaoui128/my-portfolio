import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SectionDivider from '../SectionDivider'

describe('SectionDivider', () => {
  it('renders default divider with role separator', () => {
    const { container } = render(<SectionDivider />)
    const separators = container.querySelectorAll('[role="separator"]')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('renders nested variant without container wrapping', () => {
    const { container } = render(<SectionDivider nested />)
    const separators = container.querySelectorAll('[role="separator"]')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('renders narrow variant', () => {
    const { container } = render(<SectionDivider narrow />)
    const innerLine = container.querySelector('.w-\\[60\\%\\]')
    expect(innerLine).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<SectionDivider className="my-custom" />)
    expect(container.querySelector('.my-custom')).toBeInTheDocument()
  })
})
