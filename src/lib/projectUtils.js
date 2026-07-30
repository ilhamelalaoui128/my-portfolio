import { ImageOff } from 'lucide-react'

export function hasProjectImage(url) {
  return Boolean(url && url.trim() && url !== '#')
}

export function hasDemoUrl(url) {
  return Boolean(url && url.trim() && url !== '#')
}

export function hasRepoUrl(url) {
  return Boolean(url && url.trim())
}
