import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme, readStoredTheme, applyThemeClass, THEME_STORAGE_KEY } from '../useTheme'

function TestConsumer() {
  const { theme, isDark, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isDark">{String(isDark)}</span>
      <button data-testid="toggle" onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

describe('readStoredTheme', () => {
  it('returns "light" when no theme stored', () => {
    localStorage.removeItem(THEME_STORAGE_KEY)
    expect(readStoredTheme()).toBe('light')
  })

  it('returns "dark" when stored theme is dark', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('returns "light" when stored theme is light', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light')
    expect(readStoredTheme()).toBe('light')
  })

  it('returns "light" for unknown stored values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'unknown')
    expect(readStoredTheme()).toBe('light')
  })
})

describe('applyThemeClass', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('adds dark class for dark theme', () => {
    applyThemeClass('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class for light theme', () => {
    document.documentElement.classList.add('dark')
    applyThemeClass('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

describe('useTheme', () => {
  it('throws error when used outside ThemeProvider', () => {
    expect(() => render(<TestConsumer />)).toThrow('useTheme must be used within ThemeProvider')
  })

  it('renders with ThemeProvider and provides context', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(screen.getByTestId('isDark')).toHaveTextContent('false')
  })

  it('persists initial theme to localStorage on mount', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('isDark')).toHaveTextContent('true')
  })
})
