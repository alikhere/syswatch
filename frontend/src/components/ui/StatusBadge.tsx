const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  running: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  sleeping: { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
  zombie: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
  stopped: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  disk_sleep: { bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400' },
  dead: { bg: 'bg-gray-500/15', text: 'text-gray-400', dot: 'bg-gray-400' },
}

const fallback = { bg: 'bg-muted/15', text: 'text-muted', dot: 'bg-muted' }

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? fallback

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-badge text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  )
}
