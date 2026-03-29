import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDashboardStore } from '../../store/dashboardStore'

interface ChartProps {
  data: { timestamp: number; value: number }[]
  color: string
  label: string
  gradientId: string
}

function MiniChart({ data, color, label, gradientId }: ChartProps) {
  const current = data[data.length - 1]?.value ?? 0

  return (
    <div className="flex-1 bg-card border border-[var(--color-border)] rounded-card p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="text-xl font-bold tabular-nums" style={{ color }}>
          {current.toFixed(1)}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="timestamp" hide />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--color-muted)' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-primary)',
            }}
            formatter={(val: number) => [`${val.toFixed(1)}%`, label]}
            labelFormatter={() => ''}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LiveCharts() {
  const chartData = useDashboardStore((s) => s.chartData)

  const cpuData = chartData.map((p) => ({ timestamp: p.timestamp, value: p.cpu }))
  const memData = chartData.map((p) => ({ timestamp: p.timestamp, value: p.memory }))

  return (
    <div className="flex gap-4">
      <MiniChart data={cpuData} color="#a855f7" label="CPU %" gradientId="cpuGradient" />
      <MiniChart data={memData} color="#06b6d4" label="Memory %" gradientId="memGradient" />
    </div>
  )
}
