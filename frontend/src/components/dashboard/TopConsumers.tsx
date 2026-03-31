import { useDashboardStore } from '../../store/dashboardStore'
import { formatMemory, getCpuBarColor, getMemBarColor } from '../../lib/utils'

interface ConsumerListProps {
  title: string
  items: { pid: number; name: string; value: number; displayValue: string }[]
  barColorFn: (v: number) => string
  max: number
}

function ConsumerList({ title, items, barColorFn, max }: ConsumerListProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.pid} className="flex items-center gap-2">
            <span className="text-xs text-muted w-4 text-right tabular-nums">{idx + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-primary font-medium truncate pr-2">{item.name}</span>
                <span className="text-xs text-muted tabular-nums shrink-0">{item.displayValue}</span>
              </div>
              <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColorFn(item.value)}`}
                  style={{ width: `${max > 0 ? (item.value / max) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted text-center py-2">No data</p>
        )}
      </div>
    </div>
  )
}

export function TopConsumers() {
  const processes = useDashboardStore((s) => s.processes)

  const topCpu = [...processes]
    .sort((a, b) => b.cpu_percent - a.cpu_percent)
    .slice(0, 5)
    .map((p) => ({ pid: p.pid, name: p.name, value: p.cpu_percent, displayValue: `${p.cpu_percent.toFixed(1)}%` }))

  const topMem = [...processes]
    .sort((a, b) => b.memory_mb - a.memory_mb)
    .slice(0, 5)
    .map((p) => ({ pid: p.pid, name: p.name, value: p.memory_mb, displayValue: formatMemory(p.memory_mb) }))

  const maxCpu = topCpu[0]?.value ?? 100
  const maxMem = topMem[0]?.value ?? 1

  return (
    <div className="space-y-6">
      <ConsumerList
        title="Top CPU"
        items={topCpu}
        barColorFn={getCpuBarColor}
        max={maxCpu}
      />
      <div className="border-t border-[var(--color-border)]" />
      <ConsumerList
        title="Top Memory"
        items={topMem}
        barColorFn={getMemBarColor}
        max={maxMem}
      />
    </div>
  )
}
