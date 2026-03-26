import { BACKEND_URL } from './constants'
import type { Session, Preferences, ProcessData, SystemStats } from '../types'

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

export const api = {
  createSession: () =>
    fetchJSON<Session>(`${BACKEND_URL}/api/session`, { method: 'POST' }),

  getSession: (sessionId: string) =>
    fetchJSON<Session>(`${BACKEND_URL}/api/session/${sessionId}`),

  deleteSession: (sessionId: string) =>
    fetchJSON<{ message: string }>(`${BACKEND_URL}/api/session/${sessionId}`, {
      method: 'DELETE',
    }),

  updatePreferences: (sessionId: string, preferences: Partial<Preferences>) =>
    fetchJSON<Session>(`${BACKEND_URL}/api/session/${sessionId}/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    }),

  getProcesses: (sessionId: string) =>
    fetchJSON<ProcessData[]>(`${BACKEND_URL}/api/processes?session_id=${sessionId}`),

  getProcessDetail: (pid: number) =>
    fetchJSON<ProcessData>(`${BACKEND_URL}/api/processes/${pid}`),

  getStats: () =>
    fetchJSON<SystemStats>(`${BACKEND_URL}/api/stats`),
}
