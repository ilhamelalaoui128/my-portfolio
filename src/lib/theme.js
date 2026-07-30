export const brand = {
  accent: '#E05A3A',
  accentLight: '#F07050',
  accentDark: '#C44A2E',
  accentGlow: '#FF9B7A',
  accentDeep: '#8B2E1A',
  surfaceLight: '#FFF9F7',
  surfaceDark: '#101012',
  warmHighlight: '#FFD4C4',
}

/** Palette Ferrofluid — mode sombre */
export const ferrofluidColorsDark = [
  brand.accentDeep,
  brand.accentDark,
  brand.accent,
  brand.accentLight,
  brand.accentGlow,
  brand.warmHighlight,
]

/** Palette Ferrofluid — mode clair (tons plus profonds pour contraste sur blanc) */
export const ferrofluidColorsLight = [
  brand.accentDeep,
  brand.accentDeep,
  brand.accentDark,
  brand.accent,
  brand.accentLight,
  brand.accentDark,
]

const baseFerrofluidConfig = {
  speed: 0.5,
  scale: 1.6,
  turbulence: 1,
  fluidity: 0.12,
  rimWidth: 0.22,
  sharpness: 2.2,
  shimmer: 1.3,
  flowDirection: 'down',
  mouseInteraction: true,
  mouseStrength: 1.1,
  mouseRadius: 0.38,
}

export const ferrofluidConfigDark = {
  ...baseFerrofluidConfig,
  colors: ferrofluidColorsDark,
  glow: 1.75,
  opacity: 0.95,
}

export const ferrofluidConfigLight = {
  ...baseFerrofluidConfig,
  colors: ferrofluidColorsLight,
  glow: 2.1,
  opacity: 1,
}

/** @deprecated use ferrofluidConfigLight/Dark */
export const ferrofluidConfig = ferrofluidConfigDark
