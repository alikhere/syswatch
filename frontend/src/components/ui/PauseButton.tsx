import { useDashboardStore } from '../../store/dashboardStore'

interface PauseButtonProps {
  onToggle: (paused: boolean) => void
}

export function PauseButton({ onToggle }: PauseButtonProps) {
  const isPaused = useDashboardStore((s) => s.isPaused)
  const setPaused = useDashboardStore((s) => s.setPaused)

  const handleClick = () => {
    const next = !isPaused
    setPaused(next)
    onToggle(next)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-btn text-sm font-medium transition-all duration-150 ${
        isPaused
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
          : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/25'
      }`}
    >
      {isPaused ? (
        <>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Resume
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
          Pause
        </>
      )}
    </button>
  )
}
