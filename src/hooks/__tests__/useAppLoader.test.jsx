import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act, cleanup } from '@testing-library/react'
import { useAppLoader } from '../useAppLoader'

const MIN_DURATION = 1400

beforeEach(() => {
  vi.useFakeTimers()

  vi.spyOn(performance, 'now').mockImplementation(() => 0)

  window.matchMedia = vi.fn().mockReturnValue({ matches: false })

  Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true })
  document.fonts = { ready: Promise.resolve() }
})

afterEach(() => {
  vi.useRealTimers()
  document.body.style.overflow = ''
  vi.restoreAllMocks()
  cleanup()
})

function setup(minDuration) {
  const state = {}
  function Test() {
    Object.assign(state, useAppLoader(minDuration))
    return null
  }
  const { unmount } = render(<Test />)
  return { state, unmount }
}

describe('useAppLoader', () => {
  it('starts with isReady false and progress 0', () => {
    const { state } = setup()
    expect(state.isReady).toBe(false)
    expect(state.progress).toBe(0)
  })

  it('locks body scroll while loading', () => {
    setup()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('completes loading after min duration and exit delay', async () => {
    const { state } = setup()
    act(() => { vi.advanceTimersByTime(MIN_DURATION) })
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(state.progress).toBe(100)
    act(() => { vi.advanceTimersByTime(380) })
    expect(state.isReady).toBe(true)
    expect(document.body.style.overflow).toBe('')
  })

  it('releases body scroll when ready', async () => {
    const { state } = setup()
    act(() => { vi.advanceTimersByTime(MIN_DURATION) })
    await act(async () => { await Promise.resolve(); await Promise.resolve() })
    act(() => { vi.advanceTimersByTime(380) })
    expect(document.body.style.overflow).toBe('')
  })

  it('progress animation increases over time', async () => {
    const { state } = setup()
    expect(state.progress).toBe(0)
    act(() => { vi.advanceTimersByTime(700) })
    expect(state.progress).toBeGreaterThan(0)
    expect(state.progress).toBeLessThanOrEqual(92)
    act(() => { vi.advanceTimersByTime(700) })
    await act(async () => { await Promise.resolve(); await Promise.resolve() })
    expect(state.progress).toBe(100)
  })

  it('sets isReady after exit delay', async () => {
    const { state } = setup()
    act(() => { vi.advanceTimersByTime(MIN_DURATION) })
    await act(async () => { await Promise.resolve(); await Promise.resolve() })
    act(() => { vi.advanceTimersByTime(380) })
    expect(state.isReady).toBe(true)
  })

  it('skips animation when reduced motion is on', async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    const { state } = setup()
    expect(state.isReady).toBe(false)
    expect(state.progress).toBe(0)

    await act(async () => {
      vi.advanceTimersByTime(0)
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(state.isReady).toBe(true)
    expect(state.progress).toBe(100)
  })

  it('cancels pending callbacks on unmount', () => {
    const { unmount } = setup()
    const rafSpy = vi.fn()
    globalThis.requestAnimationFrame = rafSpy
    unmount()
    act(() => { vi.advanceTimersByTime(1000) })
    expect(rafSpy).not.toHaveBeenCalled()
  })
})
