import { describe, it, expect } from 'vitest'

describe('brand colors', () => {
  it('exports brand with all color keys', async () => {
    const { brand } = await import('../theme')
    expect(brand.accent).toBe('#E05A3A')
    expect(brand.accentLight).toBe('#F07050')
    expect(brand.accentDark).toBe('#C44A2E')
    expect(brand.accentGlow).toBe('#FF9B7A')
    expect(brand.accentDeep).toBe('#8B2E1A')
    expect(brand.surfaceLight).toBe('#FFF9F7')
    expect(brand.surfaceDark).toBe('#101012')
    expect(brand.warmHighlight).toBe('#FFD4C4')
  })
})

describe('ferrofluidColorsDark', () => {
  it('contains 6 colors in correct order', async () => {
    const { ferrofluidColorsDark, brand } = await import('../theme')
    expect(ferrofluidColorsDark).toEqual([
      brand.accentDeep,
      brand.accentDark,
      brand.accent,
      brand.accentLight,
      brand.accentGlow,
      brand.warmHighlight,
    ])
  })
})

describe('ferrofluidColorsLight', () => {
  it('contains 6 colors in correct order', async () => {
    const { ferrofluidColorsLight, brand } = await import('../theme')
    expect(ferrofluidColorsLight).toEqual([
      brand.accentDeep,
      brand.accentDeep,
      brand.accentDark,
      brand.accent,
      brand.accentLight,
      brand.accentDark,
    ])
  })
})

describe('baseFerrofluidConfig (internal via ferrofluidConfigDark)', () => {
  it('has expected default values', async () => {
    const { ferrofluidConfigDark } = await import('../theme')
    expect(ferrofluidConfigDark.speed).toBe(0.5)
    expect(ferrofluidConfigDark.scale).toBe(1.6)
    expect(ferrofluidConfigDark.turbulence).toBe(1)
    expect(ferrofluidConfigDark.fluidity).toBe(0.12)
    expect(ferrofluidConfigDark.sharpness).toBe(2.2)
    expect(ferrofluidConfigDark.mouseInteraction).toBe(true)
  })
})

describe('ferrofluidConfigDark vs light', () => {
  it('dark config uses dark colors and has glow 1.75', async () => {
    const { ferrofluidConfigDark } = await import('../theme')
    expect(ferrofluidConfigDark.glow).toBe(1.75)
    expect(ferrofluidConfigDark.opacity).toBe(0.95)
  })

  it('light config uses light colors and has glow 2.1', async () => {
    const { ferrofluidConfigLight } = await import('../theme')
    expect(ferrofluidConfigLight.glow).toBe(2.1)
    expect(ferrofluidConfigLight.opacity).toBe(1)
  })
})

describe('ferrofluidConfig (deprecated alias)', () => {
  it('equals ferrofluidConfigDark', async () => {
    const { ferrofluidConfig, ferrofluidConfigDark } = await import('../theme')
    expect(ferrofluidConfig).toBe(ferrofluidConfigDark)
  })
})
