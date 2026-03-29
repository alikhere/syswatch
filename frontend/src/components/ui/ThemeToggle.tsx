import { useTheme } from '../../hooks/useTheme'
import type { ThemeMode } from '../../types'

const order: ThemeMode[] = ['light', 'dark', 'system']
const labels: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', system: 'System' }

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" strokeWidth="2" />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
      <path strokeWidth="2" strokeLinecap="round" d="M8 21h8M12 17v4" />
    </svg>
  )
}

const icons: Record<ThemeMode, React.ReactNode> = {
  light: <SunIcon />,
  dark: <MoonIcon />,
  system: <MonitorIcon />,
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycle = () => {
    const idx = order.indexOf(theme)
    setTheme(order[(idx + 1) % order.length])
  }

  return (
    <div className="relative group">
      <button
        onClick={cycle}
        className="flex items-center justify-center w-9 h-9 rounded-btn bg-card border border-[var(--color-border)] text-muted hover:text-primary hover:border-purple-500 transition-all duration-150"
        aria-label={`Theme: ${labels[theme]}`}
      >
        {icons[theme]}
      </button>
      <div className="absolute right-0 top-11 px-2 py-1 bg-card border border-[var(--color-border)] rounded-badge text-xs text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
        {labels[theme]}
      </div>
    </div>
  )
}
