import { motion, AnimatePresence } from 'framer-motion'
import { useDashboardStore } from '../../store/dashboardStore'
import { formatSystemUptime, getCpuBarColor, getMemBarColor } from '../../lib/utils'

function StatCard({
  icon,
  label,
  value,
  sub,
  bar,
  barColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  bar?: number
  barColor?: string
}) {
  return (
    <div className="bg-card border border-[var(--color-border)] rounded-card p-4 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-muted">{icon}</span>
        <span className="text-xs text-muted font-medium uppercase tracking-wide">{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold text-primary tabular-nums"
        >
          {value}
        </motion.div>
      </AnimatePresence>
      {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
      {bar !== undefined && barColor && (
        <div className="mt-3 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(bar, 100)}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  )
}

export function StatsBar() {
  const stats = useDashboardStore((s) => s.stats)

  const cpuVal = stats?.cpu_percent ?? 0
  const memVal = stats?.memory_percent ?? 0

  return (
    <div className="flex gap-4">
      <StatCard
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
            <rect x="9" y="9" width="6" height="6" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
          </svg>
        }
        label="Total Processes"
        value={String(stats?.total_processes ?? '—')}
        sub={`${stats?.cpu_count ?? '—'} CPU cores · ${stats?.cpu_freq_mhz ?? '—'} MHz`}
      />
      <StatCard
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0v10l6 3" />
          </svg>
        }
        label="CPU Usage"
        value={stats ? `${cpuVal.toFixed(1)}%` : '—'}
        sub="across all cores"
        bar={cpuVal}
        barColor={getCpuBarColor(cpuVal)}
      />
      <StatCard
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            <path strokeWidth="2" strokeLinecap="round" d="M9 9h6M9 12h6M9 15h4" />
          </svg>
        }
        label="RAM Used"
        value={stats ? `${stats.memory_used_gb} GB` : '—'}
        sub={stats ? `of ${stats.memory_total_gb} GB total · ${memVal.toFixed(1)}%` : 'loading...'}
        bar={memVal}
        barColor={getMemBarColor(memVal)}
      />
      <StatCard
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
          </svg>
        }
        label="System Uptime"
        value={stats ? formatSystemUptime(stats.system_uptime_seconds) : '—'}
        sub="since last boot"
      />
    </div>
  )
}
