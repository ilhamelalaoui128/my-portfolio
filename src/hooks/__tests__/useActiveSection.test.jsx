import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useActiveSection, linkClass, mobileLinkClass } from '../useActiveSection'

let intersectionCallback
let observeMock
let disconnectMock
let OrigObserver

beforeEach(() => {
  OrigObserver = globalThis.IntersectionObserver
  intersectionCallback = null
  observeMock = vi.fn()
  disconnectMock = vi.fn()
  globalThis.IntersectionObserver = class {
    constructor(cb) { intersectionCallback = cb }
    observe = observeMock
    unobserve = vi.fn()
    disconnect = disconnectMock
  }

  document.body.innerHTML = `
    <section id="about"></section>
    <section id="skills"></section>
    <section id="projects"></section>
    <section id="experience"></section>
    <section id="contact"></section>
  `

  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
})

afterEach(() => {
  globalThis.IntersectionObserver = OrigObserver
})

function setup(enabled = true) {
  const state = {}
  function Test() {
    state.activeSection = useActiveSection(enabled)
    return null
  }
  const { unmount } = render(<Test />)
  return { state, unmount }
}

describe('useActiveSection', () => {
  it('starts with "hero" as default', () => {
    const { state } = setup()
    expect(state.activeSection).toBe('hero')
  })

  it('observes all nav sections', () => {
    setup()
    expect(observeMock).toHaveBeenCalledTimes(5)
  })

  it('updates activeSection when a section becomes visible', () => {
    const { state } = setup()
    act(() => {
      intersectionCallback([
        { isIntersecting: false, intersectionRatio: 0, target: { id: 'skills' } },
        { isIntersecting: true, intersectionRatio: 0.5, target: { id: 'about' } },
      ])
    })
    expect(state.activeSection).toBe('about')
  })

  it('picks the section with highest intersection ratio', () => {
    const { state } = setup()
    act(() => {
      intersectionCallback([
        { isIntersecting: true, intersectionRatio: 0.3, target: { id: 'skills' } },
        { isIntersecting: true, intersectionRatio: 0.8, target: { id: 'projects' } },
      ])
    })
    expect(state.activeSection).toBe('projects')
  })

  it('detects bottom of page and sets contact', () => {
    const { state } = setup()
    Object.defineProperty(window, 'scrollY', { value: 1900, configurable: true })
    act(() => { window.dispatchEvent(new Event('scroll')) })
    expect(state.activeSection).toBe('contact')
  })

  it('does not set contact when not at bottom', () => {
    const { state } = setup()
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true })
    act(() => { window.dispatchEvent(new Event('scroll')) })
    expect(state.activeSection).toBe('hero')
  })

  it('returns "hero" and does not observe when disabled', () => {
    const { state } = setup(false)
    expect(state.activeSection).toBe('hero')
    expect(observeMock).not.toHaveBeenCalled()
  })

  it('disconnects observer on unmount', () => {
    const { unmount } = setup()
    unmount()
    expect(disconnectMock).toHaveBeenCalledTimes(1)
  })
})

describe('linkClass', () => {
  it('adds active styles when isActive is true', () => {
    const result = linkClass(true)
    expect(result).toContain('text-accent')
    expect(result).toContain('after:')
  })

  it('adds inactive styles when isActive is false', () => {
    const result = linkClass(false)
    expect(result).toContain('text-gray-600')
    expect(result).not.toContain('after:')
  })
})

describe('mobileLinkClass', () => {
  it('adds active styles when isActive is true', () => {
    const result = mobileLinkClass(true)
    expect(result).toContain('text-accent')
  })

  it('adds inactive styles when isActive is false', () => {
    const result = mobileLinkClass(false)
    expect(result).toContain('text-gray-700')
  })
})
