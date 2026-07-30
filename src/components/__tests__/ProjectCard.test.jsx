import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProjectCard from '../ProjectCard'

const defaultProject = {
  id: '1',
  title: 'Test Project',
  description: 'A test project description.',
  image_url: '/projects/test.png',
  demo_url: 'https://demo.example.com',
  repo_url: 'https://github.com/user/repo',
  stack: ['React', 'Node.js', 'Tailwind'],
  featured: true,
}

function renderCard(project = defaultProject) {
  return render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>
  )
}

describe('ProjectCard', () => {
  it('renders title and description', () => {
    renderCard()
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('A test project description.')).toBeInTheDocument()
  })

  it('renders tech stack tags', () => {
    renderCard()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('Tailwind')).toBeInTheDocument()
  })

  it('shows featured badge when project.featured is true', () => {
    renderCard()
    expect(screen.getByText('En vedette')).toBeInTheDocument()
  })

  it('hides featured badge when not featured', () => {
    renderCard({ ...defaultProject, featured: false })
    expect(screen.queryByText('En vedette')).not.toBeInTheDocument()
  })

  it('limits stack tags to 4', () => {
    renderCard({ ...defaultProject, stack: ['A', 'B', 'C', 'D', 'E'] })
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.queryByText('E')).not.toBeInTheDocument()
  })

  it('handles missing stack', () => {
    renderCard({ ...defaultProject, stack: undefined })
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders ProjectActions with demo and code links', () => {
    renderCard()
    expect(screen.getByText('Démo')).toBeInTheDocument()
    expect(screen.getByText('Code')).toBeInTheDocument()
  })

  it('links to project detail page', () => {
    renderCard()
    const links = screen.getAllByRole('link')
    const detailLink = links.find(l => l.getAttribute('href') === '/projects/1')
    expect(detailLink).toBeInTheDocument()
  })
})
