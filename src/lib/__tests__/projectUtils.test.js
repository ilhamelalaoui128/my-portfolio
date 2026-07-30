import { describe, it, expect } from 'vitest'
import { hasProjectImage, hasDemoUrl, hasRepoUrl } from '../projectUtils'

describe('hasProjectImage(url)', () => {
  it('returns true for a valid URL', () => {
    expect(hasProjectImage('/projects/image.png')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(hasProjectImage('')).toBe(false)
  })

  it('returns false for "#"', () => {
    expect(hasProjectImage('#')).toBe(false)
  })

  it('returns false for whitespace-only string', () => {
    expect(hasProjectImage('   ')).toBe(false)
  })

  it('returns false for null', () => {
    expect(hasProjectImage(null)).toBe(false)
  })
})

describe('hasDemoUrl(url)', () => {
  it('returns true for valid demo URL', () => {
    expect(hasDemoUrl('https://demo.example.com')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(hasDemoUrl('')).toBe(false)
  })

  it('returns false for "#"', () => {
    expect(hasDemoUrl('#')).toBe(false)
  })
})

describe('hasRepoUrl(url)', () => {
  it('returns true for valid repo URL', () => {
    expect(hasRepoUrl('https://github.com/user/repo')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(hasRepoUrl('')).toBe(false)
  })

  it('returns true for "#" (no special handling in this function)', () => {
    expect(hasRepoUrl('#')).toBe(true)
  })
})
