import { useState, useEffect, useCallback } from 'react'
import { THEME_STORAGE_KEY } from '../lib/constants'
import type { ThemeMode } from '../types'

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

function applyToDOM(resolved: 'light' | 'dark') {
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(
    () => (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'system',
  )

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const saved = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'system'
    return resolveMode(saved)
  })

  useEffect(() => {
    const resolved = resolveMode(theme)
    setResolvedTheme(resolved)
    applyToDOM(resolved)

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => {
        const r = resolveMode('system')
        setResolvedTheme(r)
        applyToDOM(r)
      }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  const setTheme = useCallback((newTheme: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    setThemeState(newTheme)
  }, [])

  return { theme, setTheme, resolvedTheme }
}
