import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, BrowserRouter: actual.MemoryRouter }
})

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
  AnimatePresence: ({ children }) => children,
}))

const mockAppLoader = vi.hoisted(() => ({ isReady: false, progress: 50 }))
vi.mock('../../hooks/useAppLoader', () => ({
  useAppLoader: () => mockAppLoader,
}))

const mockContext = vi.hoisted(() => ({ ready: false, profile: null }))
vi.mock('../../context/PortfolioDataContext', () => ({
  usePortfolioData: () => mockContext,
  PortfolioDataProvider: ({ children }) => children,
}))

const mockAdminAuth = vi.hoisted(() => ({ session: null, checking: false }))
vi.mock('../../context/AdminAuthContext', () => ({
  useAdminAuth: () => mockAdminAuth,
  AdminAuthProvider: ({ children }) => children,
}))

vi.mock('../../hooks/useTheme', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({ isDark: false }),
}))

vi.mock('../Navbar', () => ({ default: () => <div data-testid="navbar" /> }))
vi.mock('../Footer', () => ({ default: () => <div data-testid="footer" /> }))
vi.mock('../LoadingScreen', () => ({
  default: ({ progress }) => <div data-testid="loading" data-progress={progress}>Loading...</div>,
}))
vi.mock('../BackToTop', () => ({ default: () => null }))

vi.mock('../../pages/Home', () => ({ default: () => <div data-testid="home-page">Home</div> }))
vi.mock('../../pages/ProjectDetail', () => ({ default: () => <div data-testid="project-detail">Project Detail</div> }))
vi.mock('../../pages/Admin', () => ({ default: () => <div data-testid="admin-page">Admin</div> }))

import App from '../../App'

describe('App', () => {
  beforeEach(() => {
    mockAppLoader.isReady = false
    mockAppLoader.progress = 50
    mockContext.ready = false
    mockAdminAuth.session = null
    mockAdminAuth.checking = false
    window.scrollTo = vi.fn()
  })

  it('shows loading screen when data is not ready', () => {
    render(<App />)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()
  })

  it('shows content when ready and isReady', () => {
    mockContext.ready = true
    mockAppLoader.isReady = true
    render(<App />)
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('passes progress to LoadingScreen', () => {
    mockAppLoader.progress = 75
    render(<App />)
    expect(screen.getByTestId('loading')).toHaveAttribute('data-progress', '75')
  })

  it('renders skip-to-content link', () => {
    render(<App />)
    expect(screen.getByText('Aller au contenu')).toBeInTheDocument()
  })
})
