import { ConnectionStatus } from '../dashboard/ConnectionStatus'
import { PauseButton } from '../ui/PauseButton'
import { ThemeToggle } from '../ui/ThemeToggle'

interface HeaderProps {
  onPauseToggle: (paused: boolean) => void
}

export function Header({ onPauseToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-surface/80 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-btn bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
              <path strokeWidth="2" strokeLinecap="round" d="M8 21h8M12 17v4" />
              <path strokeWidth="1.5" strokeLinecap="round" d="M7 8h2M11 8h6M7 11h4M13 11h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent leading-none">
              SysWatch
            </h1>
            <p className="text-xs text-muted leading-none mt-0.5">Real-time Process Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <PauseButton onToggle={onPauseToggle} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
