import { useDashboardStore } from '../../store/dashboardStore'

export function ConnectionStatus() {
  const isConnected = useDashboardStore((s) => s.isConnected)
  const lastUpdateTime = useDashboardStore((s) => s.lastUpdateTime)

  const isStale = lastUpdateTime !== null && Date.now() - lastUpdateTime > 6000

  const state = !isConnected ? 'disconnected' : isStale ? 'reconnecting' : 'live'

  const config = {
    live: {
      dot: 'bg-emerald-400 animate-pulse',
      text: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
      label: 'Live',
    },
    reconnecting: {
      dot: 'bg-yellow-400 animate-pulse',
      text: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/20',
      label: 'Reconnecting',
    },
    disconnected: {
      dot: 'bg-red-400',
      text: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/20',
      label: 'Disconnected',
    },
  }[state]

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  )
}
