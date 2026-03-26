import { create } from 'zustand'
import type { ProcessData, SystemStats, Session, SortColumn, SortDirection, ChartDataPoint } from '../types'
import { MAX_CHART_POINTS } from '../lib/constants'

interface DashboardState {
  processes: ProcessData[]
  filteredProcesses: ProcessData[]
  stats: SystemStats | null
  session: Session | null
  isConnected: boolean
  isPaused: boolean
  selectedPid: number | null
  chartData: ChartDataPoint[]
  sortColumn: SortColumn
  sortDirection: SortDirection
  filterText: string
  statusFilter: string
  lastUpdateTime: number | null
}

interface DashboardActions {
  setProcesses: (processes: ProcessData[]) => void
  setStats: (stats: SystemStats) => void
  setSession: (session: Session | null) => void
  setConnected: (connected: boolean) => void
  setPaused: (paused: boolean) => void
  setSelectedPid: (pid: number | null) => void
  setFilter: (text: string) => void
  setStatusFilter: (status: string) => void
  setSortColumn: (column: SortColumn) => void
  setSort: (column: SortColumn, direction: SortDirection) => void
  resetFilters: () => void
}

function applyFiltersAndSort(
  processes: ProcessData[],
  filterText: string,
  statusFilter: string,
  sortColumn: SortColumn,
  sortDirection: SortDirection,
): ProcessData[] {
  let result = [...processes]

  if (filterText) {
    const lower = filterText.toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(lower) || String(p.pid).includes(lower),
    )
  }

  if (statusFilter && statusFilter !== 'all') {
    result = result.filter((p) => p.status === statusFilter)
  }

  result.sort((a, b) => {
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    const aNum = aVal as number
    const bNum = bVal as number
    return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
  })

  return result.slice(0, 100)
}

export const useDashboardStore = create<DashboardState & DashboardActions>((set, get) => ({
  processes: [],
  filteredProcesses: [],
  stats: null,
  session: null,
  isConnected: false,
  isPaused: false,
  selectedPid: null,
  chartData: [],
  sortColumn: 'cpu_percent',
  sortDirection: 'desc',
  filterText: '',
  statusFilter: 'all',
  lastUpdateTime: null,

  setProcesses: (processes) => {
    const { filterText, statusFilter, sortColumn, sortDirection } = get()
    const filtered = applyFiltersAndSort(processes, filterText, statusFilter, sortColumn, sortDirection)
    set({ processes, filteredProcesses: filtered, lastUpdateTime: Date.now() })
  },

  setStats: (stats) => {
    const { chartData } = get()
    const newPoint: ChartDataPoint = {
      timestamp: Date.now(),
      cpu: stats.cpu_percent,
      memory: stats.memory_percent,
    }
    const updatedChart = [...chartData, newPoint].slice(-MAX_CHART_POINTS)
    set({ stats, chartData: updatedChart })
  },

  setSession: (session) => set({ session }),

  setConnected: (isConnected) => set({ isConnected }),

  setPaused: (isPaused) => set({ isPaused }),

  setSelectedPid: (selectedPid) => set({ selectedPid }),

  setFilter: (filterText) => {
    const { processes, statusFilter, sortColumn, sortDirection } = get()
    const filtered = applyFiltersAndSort(processes, filterText, statusFilter, sortColumn, sortDirection)
    set({ filterText, filteredProcesses: filtered })
  },

  setStatusFilter: (statusFilter) => {
    const { processes, filterText, sortColumn, sortDirection } = get()
    const filtered = applyFiltersAndSort(processes, filterText, statusFilter, sortColumn, sortDirection)
    set({ statusFilter, filteredProcesses: filtered })
  },

  setSortColumn: (column) => {
    const { sortColumn, sortDirection, processes, filterText, statusFilter } = get()
    const newDirection: SortDirection =
      column === sortColumn ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc'
    const filtered = applyFiltersAndSort(processes, filterText, statusFilter, column, newDirection)
    set({ sortColumn: column, sortDirection: newDirection, filteredProcesses: filtered })
  },

  setSort: (sortColumn, sortDirection) => {
    const { processes, filterText, statusFilter } = get()
    const filtered = applyFiltersAndSort(processes, filterText, statusFilter, sortColumn, sortDirection)
    set({ sortColumn, sortDirection, filteredProcesses: filtered })
  },

  resetFilters: () => {
    const { processes } = get()
    const filtered = applyFiltersAndSort(processes, '', 'all', 'cpu_percent', 'desc')
    set({
      filterText: '',
      statusFilter: 'all',
      sortColumn: 'cpu_percent',
      sortDirection: 'desc',
      filteredProcesses: filtered,
    })
  },
}))
