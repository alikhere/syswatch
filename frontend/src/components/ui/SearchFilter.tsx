import { useDashboardStore } from '../../store/dashboardStore'

export function SearchFilter() {
  const filterText = useDashboardStore((s) => s.filterText)
  const setFilter = useDashboardStore((s) => s.setFilter)

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" strokeWidth="2" />
        <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={filterText}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by name or PID..."
        className="w-full pl-9 pr-9 py-2 bg-surface border border-[var(--color-border)] rounded-btn text-sm text-primary placeholder:text-muted focus:outline-none focus:border-purple-500 transition-colors duration-150"
      />
      {filterText && (
        <button
          onClick={() => setFilter('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
