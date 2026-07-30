import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockFetchMessages = vi.hoisted(() => vi.fn())
vi.mock('../../lib/api', () => ({
  fetchMessages: mockFetchMessages,
}))

const mockData = vi.hoisted(() => ({ profile: null }))
vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockData,
}))

const mockActiveSection = vi.hoisted(() => 'hero')
vi.mock('../../hooks/useActiveSection', () => ({
  useActiveSection: () => mockActiveSection,
  linkClass: (isActive) => (isActive ? 'link-active' : 'link-inactive'),
}))

vi.mock('../MobileMenu', () => ({
  default: ({ open, isAdmin, msgCount }) => (
    <div data-testid="mobile-menu" data-open={open} data-admin={isAdmin} data-msgs={msgCount} />
  ),
}))

vi.mock('../ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}))

vi.mock('../CvDownloadButton', () => ({
  default: () => <div data-testid="cv-button" />,
}))

import Navbar from '../Navbar'

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchMessages.mockResolvedValue([])
    mockData.profile = { name: 'Ilham El-Alaoui' }
  })

  it('renders profile name as logo on home page', () => {
    renderNavbar('/')
    expect(screen.getByText(/Ilham El-Alaoui/)).toBeInTheDocument()
  })

  it('renders Admin as logo on admin page', () => {
    renderNavbar('/admin')
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders nav links on home page', () => {
    renderNavbar('/')
    expect(screen.getByText('À propos')).toBeInTheDocument()
    expect(screen.getByText('Compétences')).toBeInTheDocument()
    expect(screen.getByText('Projets')).toBeInTheDocument()
    expect(screen.getByText('Parcours')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders admin links on admin page', () => {
    renderNavbar('/admin')
    expect(screen.getByText('Profil')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Expériences')).toBeInTheDocument()
  })

  it('calls fetchMessages on admin page', () => {
    renderNavbar('/admin')
    expect(mockFetchMessages).toHaveBeenCalledTimes(1)
  })

  it('renders msgCount badge when messages exist', async () => {
    mockFetchMessages.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }])
    renderNavbar('/admin')
    expect(await screen.findByText('3')).toBeInTheDocument()
  })

  it('does not call fetchMessages on home page', () => {
    renderNavbar('/')
    expect(mockFetchMessages).not.toHaveBeenCalled()
  })

  it('renders theme toggle on desktop and mobile', () => {
    renderNavbar('/')
    expect(screen.getAllByTestId('theme-toggle')).toHaveLength(2)
  })

  it('renders CV download button on home page', () => {
    renderNavbar('/')
    expect(screen.getByTestId('cv-button')).toBeInTheDocument()
  })

  it('renders mobile menu', () => {
    renderNavbar('/')
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
  })

  it('passes isAdmin=false to MobileMenu on home page', () => {
    renderNavbar('/')
    expect(screen.getByTestId('mobile-menu')).toHaveAttribute('data-admin', 'false')
  })

  it('passes isAdmin=true to MobileMenu on admin page', () => {
    renderNavbar('/admin')
    expect(screen.getByTestId('mobile-menu')).toHaveAttribute('data-admin', 'true')
  })
})
