import { useEffect } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { StatsBar } from './components/dashboard/StatsBar'
import { LiveCharts } from './components/dashboard/LiveCharts'
import { ProcessTable } from './components/dashboard/ProcessTable'
import { ProcessDetailPanel } from './components/dashboard/ProcessDetailPanel'
import { useSession } from './hooks/useSession'
import { useSocket } from './hooks/useSocket'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { session, isLoading, error } = useSession()
  const { emitPause } = useSocket(session?.session_id ?? null)

  useTheme()

  useEffect(() => {
    document.title = 'SysWatch — Real-time Process Monitor'
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Initializing session...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="bg-card border border-red-500/30 rounded-card p-6 max-w-sm text-center">
          <svg className="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-sm font-medium text-primary mb-1">Connection Failed</p>
          <p className="text-xs text-muted">{error}</p>
          <p className="text-xs text-muted mt-2">Make sure the backend is running on port 5000</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface font-sans">
      <Header onPauseToggle={emitPause} />
      <main className="px-12 pt-6 pb-8 flex flex-col gap-5">
        <StatsBar />
        <LiveCharts />
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <ProcessTable />
          </div>
          <Sidebar />
        </div>
      </main>
      <ProcessDetailPanel />
    </div>
  )
}
