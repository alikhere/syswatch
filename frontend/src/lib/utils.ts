import { CPU_WARN_THRESHOLD, CPU_DANGER_THRESHOLD, MEM_WARN_THRESHOLD, MEM_DANGER_THRESHOLD } from './constants'

export function formatMemory(mb: number): string {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`
  }
  return `${mb.toFixed(1)} MB`
}

export function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

export function formatSystemUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function getCpuTextColor(percent: number): string {
  if (percent >= CPU_DANGER_THRESHOLD) return 'text-red-400'
  if (percent >= CPU_WARN_THRESHOLD) return 'text-yellow-400'
  return 'text-emerald-400'
}

export function getCpuBarColor(percent: number): string {
  if (percent >= CPU_DANGER_THRESHOLD) return 'bg-red-500'
  if (percent >= CPU_WARN_THRESHOLD) return 'bg-yellow-500'
  return 'bg-emerald-500'
}

export function getMemTextColor(percent: number): string {
  if (percent >= MEM_DANGER_THRESHOLD) return 'text-red-400'
  if (percent >= MEM_WARN_THRESHOLD) return 'text-yellow-400'
  return 'text-emerald-400'
}

export function getMemBarColor(percent: number): string {
  if (percent >= MEM_DANGER_THRESHOLD) return 'bg-red-500'
  if (percent >= MEM_WARN_THRESHOLD) return 'bg-yellow-500'
  return 'bg-emerald-500'
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
