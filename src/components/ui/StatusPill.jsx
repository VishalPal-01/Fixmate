import { statusMeta } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function StatusPill({ status, className, animated = true }) {
  const meta = statusMeta[status] || statusMeta.requested
  const live = ['accepted', 'en_route', 'in_progress'].includes(status)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide',
        className
      )}
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      {live && animated ? (
        <span className="pulse-dot" style={{ color: meta.color }} />
      ) : (
        <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
      )}
      {meta.label}
    </span>
  )
}
