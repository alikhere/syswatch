import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { SESSION_STORAGE_KEY } from '../lib/constants'
import { useDashboardStore } from '../store/dashboardStore'
import type { Session } from '../types'

export function useSession() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const setSession = useDashboardStore((s) => s.setSession)
  const session = useDashboardStore((s) => s.session)

  useEffect(() => {
    let cancelled = false

    async function initSession() {
      try {
        const storedId = localStorage.getItem(SESSION_STORAGE_KEY)

        if (storedId) {
          try {
            const existing: Session = await api.getSession(storedId)
            if (!cancelled) {
              setSession(existing)
              setIsLoading(false)
              return
            }
          } catch {
            localStorage.removeItem(SESSION_STORAGE_KEY)
          }
        }

        const newSession: Session = await api.createSession()
        if (!cancelled) {
          localStorage.setItem(SESSION_STORAGE_KEY, newSession.session_id)
          setSession(newSession)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to initialize session')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    initSession()
    return () => {
      cancelled = true
    }
  }, [setSession])

  return { session, isLoading, error }
}
