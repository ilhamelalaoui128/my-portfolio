import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { getScrollRatio, useScrollProgress } from '../useScrollProgress'

describe('getScrollRatio', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  })

  it('returns 0 at top of page', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    expect(getScrollRatio()).toBe(0)
  })

  it('returns 1 at bottom of page', () => {
    Object.defineProperty(window, 'scrollY', { value: 1200, configurable: true })
    expect(getScrollRatio()).toBe(1)
  })

  it('returns ratio in the middle', () => {
    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
    expect(getScrollRatio()).toBeCloseTo(0.5, 1)
  })

  it('returns 0 when document is not scrollable', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    expect(getScrollRatio()).toBe(0)
  })

  it('clamps values below 0', () => {
    Object.defineProperty(window, 'scrollY', { value: -50, configurable: true })
    expect(getScrollRatio()).toBe(0)
  })

  it('clamps values above 1', () => {
    Object.defineProperty(window, 'scrollY', { value: 2000, configurable: true })
    expect(getScrollRatio()).toBe(1)
  })
})

describe('useScrollProgress', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  it('calls onUpdate with current ratio on mount', () => {
    const onUpdate = vi.fn()
    function Test() { useScrollProgress(onUpdate); return null }
    render(<Test />)
    expect(onUpdate).toHaveBeenCalledWith(0)
  })

  it('calls onUpdate with new ratio on scroll', () => {
    vi.useFakeTimers()
    const onUpdate = vi.fn()
    function Test() { useScrollProgress(onUpdate); return null }
    render(<Test />)
    onUpdate.mockClear()

    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
    act(() => { window.dispatchEvent(new Event('scroll')) })
    act(() => { vi.advanceTimersByTime(16) })

    expect(onUpdate).toHaveBeenCalled()
    const ratio = onUpdate.mock.calls[0][0]
    expect(ratio).toBeCloseTo(0.5, 1)
    vi.useRealTimers()
  })

  it('calls onUpdate on resize', () => {
    vi.useFakeTimers()
    const onUpdate = vi.fn()
    function Test() { useScrollProgress(onUpdate); return null }
    render(<Test />)
    onUpdate.mockClear()

    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
    act(() => { window.dispatchEvent(new Event('resize')) })
    act(() => { vi.advanceTimersByTime(16) })

    expect(onUpdate).toHaveBeenCalled()
    const ratio = onUpdate.mock.calls[0][0]
    expect(ratio).toBeCloseTo(0.5, 1)
    vi.useRealTimers()
  })

  it('debounces scroll via rAF', () => {
    vi.useFakeTimers()
    const onUpdate = vi.fn()
    function Test() { useScrollProgress(onUpdate); return null }
    render(<Test />)
    onUpdate.mockClear()

    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
    act(() => { window.dispatchEvent(new Event('scroll')) })
    act(() => { window.dispatchEvent(new Event('scroll')) })
    act(() => { window.dispatchEvent(new Event('scroll')) })
    act(() => { vi.advanceTimersByTime(16) })

    expect(onUpdate).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('does not call onUpdate after unmount', () => {
    const onUpdate = vi.fn()
    function Test() { useScrollProgress(onUpdate); return null }
    const { unmount } = render(<Test />)
    unmount()
    onUpdate.mockClear()

    act(() => { window.dispatchEvent(new Event('scroll')) })
    expect(onUpdate).not.toHaveBeenCalled()
  })
})
