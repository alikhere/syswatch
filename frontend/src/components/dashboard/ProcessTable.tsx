import { useDashboardStore } from '../../store/dashboardStore'
import { SearchFilter } from '../ui/SearchFilter'
import { ProcessRow } from './ProcessRow'
import type { SortColumn } from '../../types'

const STATUS_OPTIONS = ['all', 'running', 'sleeping', 'stopped', 'zombie', 'disk_sleep']

function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
  if (!active) {
    return (
      <svg className="w-3 h-3 text-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  }
  return direction === 'desc' ? (
    <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" d="M19 9l-7 7-7-7" />
    </svg>
  ) : (
    <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" d="M5 15l7-7 7 7" />
    </svg>
  )
}

interface ColHeaderProps {
  label: string
  col: SortColumn
}

function ColHeader({ label, col }: ColHeaderProps) {
  const sortColumn = useDashboardStore((s) => s.sortColumn)
  const sortDirection = useDashboardStore((s) => s.sortDirection)
  const setSortColumn = useDashboardStore((s) => s.setSortColumn)

  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide cursor-pointer hover:text-primary transition-colors duration-150 select-none"
      onClick={() => setSortColumn(col)}
    >
      <span className="flex items-center gap-1.5">
        {label}
        <SortIcon active={sortColumn === col} direction={sortDirection} />
      </span>
    </th>
  )
}

export function ProcessTable() {
  const filteredProcesses = useDashboardStore((s) => s.filteredProcesses)
  const processes = useDashboardStore((s) => s.processes)
  const statusFilter = useDashboardStore((s) => s.statusFilter)
  const setStatusFilter = useDashboardStore((s) => s.setStatusFilter)
  const resetFilters = useDashboardStore((s) => s.resetFilters)
  const filterText = useDashboardStore((s) => s.filterText)

  const hasActiveFilter = filterText !== '' || statusFilter !== 'all'

  return (
    <div className="bg-card border border-[var(--color-border)] rounded-card overflow-hidden">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <SearchFilter />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-[var(--color-border)] rounded-btn text-sm text-primary focus:outline-none focus:border-purple-500 transition-colors duration-150 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s}
            </option>
          ))}
        </select>
        {hasActiveFilter && (
          <button
            onClick={resetFilters}
            className="text-xs text-muted hover:text-primary transition-colors duration-150 underline underline-offset-2"
          >
            Reset filters
          </button>
        )}
        <span className="text-xs text-muted ml-auto whitespace-nowrap">
          Showing {filteredProcesses.length} of {processes.length} processes
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-[var(--color-border)]">
            <tr>
              <ColHeader label="PID" col="pid" />
              <ColHeader label="Name" col="name" />
              <ColHeader label="CPU %" col="cpu_percent" />
              <ColHeader label="Memory" col="memory_mb" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                User
              </th>
              <ColHeader label="Uptime" col="uptime_seconds" />
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wide">
                Threads
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted text-sm">
                  No processes match your filter
                </td>
              </tr>
            ) : (
              filteredProcesses.map((p) => <ProcessRow key={p.pid} process={p} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
