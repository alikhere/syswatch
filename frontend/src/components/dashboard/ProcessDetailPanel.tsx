import { AnimatePresence, motion } from 'framer-motion'
import { useDashboardStore } from '../../store/dashboardStore'
import { StatusBadge } from '../ui/StatusBadge'
import { formatMemory, formatUptime, getCpuTextColor } from '../../lib/utils'

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-b-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm text-primary font-medium">{value}</span>
    </div>
  )
}

export function ProcessDetailPanel() {
  const selectedPid = useDashboardStore((s) => s.selectedPid)
  const setSelectedPid = useDashboardStore((s) => s.setSelectedPid)
  const processes = useDashboardStore((s) => s.processes)

  const process = selectedPid !== null ? processes.find((p) => p.pid === selectedPid) : null

  return (
    <AnimatePresence>
      {selectedPid !== null && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSelectedPid(null)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-[var(--color-border)] z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-sm font-semibold text-primary">Process Detail</h2>
                <p className="text-xs text-muted">PID {selectedPid}</p>
              </div>
              <button
                onClick={() => setSelectedPid(null)}
                className="flex items-center justify-center w-8 h-8 rounded-btn text-muted hover:text-primary hover:bg-surface transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {process ? (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4 p-3 bg-surface rounded-btn border border-[var(--color-border)]">
                  <p className="text-lg font-bold text-primary truncate">{process.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={process.status} />
                  </div>
                </div>

                <DetailRow label="PID" value={<span className="tabular-nums">{process.pid}</span>} />
                <DetailRow
                  label="CPU Usage"
                  value={
                    <span className={`tabular-nums font-bold ${getCpuTextColor(process.cpu_percent)}`}>
                      {process.cpu_percent.toFixed(1)}%
                    </span>
                  }
                />
                <DetailRow
                  label="Memory"
                  value={<span className="tabular-nums">{formatMemory(process.memory_mb)}</span>}
                />
                <DetailRow label="User" value={process.username} />
                <DetailRow
                  label="Uptime"
                  value={<span className="tabular-nums">{formatUptime(process.uptime_seconds)}</span>}
                />
                <DetailRow
                  label="Threads"
                  value={<span className="tabular-nums">{process.num_threads}</span>}
                />
                <DetailRow label="Status" value={<StatusBadge status={process.status} />} />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted">Process no longer active</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
