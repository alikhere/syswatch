import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { BACKEND_URL } from '../lib/constants'
import { useDashboardStore } from '../store/dashboardStore'
import type { ProcessData, SystemStats, Preferences } from '../types'

interface ProcessUpdatePayload {
  processes: ProcessData[]
  stats: SystemStats
  session_id: string
}

export function useSocket(sessionId: string | null) {
  const socketRef = useRef<Socket | null>(null)
  const setConnected = useDashboardStore((s) => s.setConnected)
  const setProcesses = useDashboardStore((s) => s.setProcesses)
  const setStats = useDashboardStore((s) => s.setStats)
  const setSession = useDashboardStore((s) => s.setSession)

  useEffect(() => {
    if (!sessionId) return

    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('connect_session', { session_id: sessionId })
    })

    socket.on('connected', (session) => {
      setSession(session)
      setConnected(true)
    })

    socket.on('process_update', (data: ProcessUpdatePayload) => {
      setProcesses(data.processes)
      setStats(data.stats)
    })

    socket.on('preferences_updated', (session) => {
      setSession(session)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('reconnect', () => {
      socket.emit('connect_session', { session_id: sessionId })
      setConnected(true)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
    }
  }, [sessionId, setConnected, setProcesses, setStats, setSession])

  const emitPause = useCallback(
    (paused: boolean) => {
      socketRef.current?.emit('pause_stream', { session_id: sessionId, paused })
    },
    [sessionId],
  )

  const emitPreferences = useCallback(
    (preferences: Partial<Preferences>) => {
      socketRef.current?.emit('update_preferences', { session_id: sessionId, preferences })
    },
    [sessionId],
  )

  const emitSnapshot = useCallback(() => {
    socketRef.current?.emit('request_snapshot', { session_id: sessionId })
  }, [sessionId])

  return { emitPause, emitPreferences, emitSnapshot }
}
