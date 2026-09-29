import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  })
}

export function formatTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return `${formatDate(dateStr)} · ${formatTime(dateStr)}`
}

export const statusMeta = {
  requested: { label: 'Requested', color: '#5B677A', bg: '#EEF0F4' },
  accepted: { label: 'Accepted', color: '#0B6CD6', bg: '#E6F0FD' },
  en_route: { label: 'En Route', color: '#F5A524', bg: '#FDF0DA' },
  in_progress: { label: 'In Progress', color: '#FF5A1F', bg: '#FFE4D6' },
  completed: { label: 'Completed', color: '#0FAE82', bg: '#D9F5EC' },
  cancelled: { label: 'Cancelled', color: '#D64545', bg: '#FBE4E4' },
}
