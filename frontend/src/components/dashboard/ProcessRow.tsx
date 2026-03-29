import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { StatusBadge } from '../ui/StatusBadge'
import { useDashboardStore } from '../../store/dashboardStore'
import { formatMemory, formatUptime, getCpuTextColor } from '../../lib/utils'
import type { ProcessData } from '../../types'

interface ProcessRowProps {
  process: ProcessData
}

export function ProcessRow({ process }: ProcessRowProps) {
  const selectedPid = useDashboardStore((s) => s.selectedPid)
  const setSelectedPid = useDashboardStore((s) => s.setSelectedPid)
  const prevCpuRef = useRef(process.cpu_percent)
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    if (Math.abs(process.cpu_percent - prevCpuRef.current) > 5) {
      setHighlight(true)
      const t = setTimeout(() => setHighlight(false), 800)
      prevCpuRef.current = process.cpu_percent
      return () => clearTimeout(t)
    }
    prevCpuRef.current = process.cpu_percent
  }, [process.cpu_percent])

  const isSelected = selectedPid === process.pid

  const handleClick = () => {
    setSelectedPid(isSelected ? null : process.pid)
  }

  return (
    <motion.tr
      onClick={handleClick}
      animate={highlight ? { backgroundColor: ['rgba(168,85,247,0.12)', 'rgba(168,85,247,0)'] } : {}}
      transition={{ duration: 0.8 }}
      className={`border-b border-[var(--color-border)] cursor-pointer transition-colors duration-150 ${
        isSelected
          ? 'bg-purple-500/10 border-l-2 border-l-purple-500'
          : 'hover:bg-card'
      }`}
    >
      <td className="px-4 py-2.5 text-sm text-muted tabular-nums">{process.pid}</td>
      <td className="px-4 py-2.5 text-sm text-primary font-medium max-w-[180px] truncate">
        {process.name}
      </td>
      <td className={`px-4 py-2.5 text-sm font-semibold tabular-nums ${getCpuTextColor(process.cpu_percent)}`}>
        {process.cpu_percent.toFixed(1)}%
      </td>
      <td className="px-4 py-2.5 text-sm text-primary tabular-nums">
        {formatMemory(process.memory_mb)}
      </td>
      <td className="px-4 py-2.5">
        <StatusBadge status={process.status} />
      </td>
      <td className="px-4 py-2.5 text-sm text-muted max-w-[120px] truncate">{process.username}</td>
      <td className="px-4 py-2.5 text-sm text-muted tabular-nums">{formatUptime(process.uptime_seconds)}</td>
      <td className="px-4 py-2.5 text-sm text-muted tabular-nums text-center">{process.num_threads}</td>
    </motion.tr>
  )
}
