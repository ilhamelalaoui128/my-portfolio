import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useScrollReveal } from '../useScrollReveal'

let intersectionCallback
let observeMock
let unobserveMock
let disconnectMock
let OrigObserver

beforeEach(() => {
  OrigObserver = globalThis.IntersectionObserver
  intersectionCallback = null
  observeMock = vi.fn()
  unobserveMock = vi.fn()
  disconnectMock = vi.fn()
  globalThis.IntersectionObserver = class {
    constructor(cb) { intersectionCallback = cb }
    observe = observeMock
    unobserve = unobserveMock
    disconnect = disconnectMock
  }
})

afterEach(() => {
  globalThis.IntersectionObserver = OrigObserver
})

function setup() {
  const state = {}
  function Test() {
    const { ref, isVisible } = useScrollReveal()
    state.ref = ref
    state.isVisible = isVisible
    return <div ref={ref} data-testid="observed" />
  }
  const { unmount } = render(<Test />)
  return { state, unmount }
}

describe('useScrollReveal', () => {
  it('starts with isVisible false', () => {
    const { state } = setup()
    expect(state.isVisible).toBe(false)
  })

  it('returns a ref object', () => {
    const { state } = setup()
    expect(state.ref).toBeDefined()
    expect(state.ref.current).not.toBe(null)
  })

  it('observes the element on mount', () => {
    setup()
    expect(observeMock).toHaveBeenCalledTimes(1)
  })

  it('sets isVisible true when intersecting', () => {
    const { state } = setup()
    act(() => {
      intersectionCallback([{ isIntersecting: true, intersectionRatio: 0.5 }])
    })
    expect(state.isVisible).toBe(true)
  })

  it('unobserves after first intersection', () => {
    setup()
    act(() => {
      intersectionCallback([{ isIntersecting: true, intersectionRatio: 0.3 }])
    })
    expect(unobserveMock).toHaveBeenCalledTimes(1)
  })

  it('disconnects observer on unmount', () => {
    const { unmount } = setup()
    unmount()
    expect(disconnectMock).toHaveBeenCalledTimes(1)
  })
})
