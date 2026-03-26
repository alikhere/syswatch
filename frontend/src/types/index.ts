export interface ProcessData {
  pid: number
  name: string
  cpu_percent: number
  memory_mb: number
  status: string
  username: string
  uptime_seconds: number
  num_threads: number
}

export interface SystemStats {
  total_processes: number
  cpu_percent: number
  memory_percent: number
  memory_used_gb: number
  memory_total_gb: number
  system_uptime_seconds: number
  cpu_count: number
  cpu_freq_mhz: number
}

export interface Preferences {
  filter_text: string
  sort_column: SortColumn
  sort_direction: SortDirection
  status_filter: string
  paused: boolean
}

export interface Session {
  session_id: string
  created_at: number
  last_seen: number
  preferences: Preferences
}

export type SortColumn = 'pid' | 'name' | 'cpu_percent' | 'memory_mb' | 'uptime_seconds'
export type SortDirection = 'asc' | 'desc'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface ChartDataPoint {
  timestamp: number
  cpu: number
  memory: number
}
