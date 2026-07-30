import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectActions from '../ProjectActions'

describe('ProjectActions', () => {
  const baseProject = {
    demo_url: 'https://demo.example.com',
    repo_url: 'https://github.com/user/repo',
  }

  it('renders demo and repo links when both provided', () => {
    render(<ProjectActions project={baseProject} />)
    expect(screen.getByText('Démo')).toBeInTheDocument()
    expect(screen.getByText('Code')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', 'https://demo.example.com')
    expect(links[1]).toHaveAttribute('href', 'https://github.com/user/repo')
  })

  it('renders nothing when no links provided', () => {
    const { container } = render(<ProjectActions project={{}} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders only demo link when no repo', () => {
    render(<ProjectActions project={{ demo_url: 'https://demo.example.com' }} />)
    expect(screen.getByText('Démo')).toBeInTheDocument()
    expect(screen.queryByText('Code')).not.toBeInTheDocument()
  })

  it('renders only repo link when no demo', () => {
    render(<ProjectActions project={{ repo_url: 'https://github.com/user/repo' }} />)
    expect(screen.queryByText('Démo')).not.toBeInTheDocument()
    expect(screen.getByText('Code')).toBeInTheDocument()
  })

  it('opens links in new tab with rel noopener', () => {
    render(<ProjectActions project={baseProject} />)
    screen.getAllByRole('link').forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
})
