import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, ArrowRight, ClipboardList } from 'lucide-react'
import StatusPill from '@/components/ui/StatusPill'
import EmptyState from '@/components/ui/EmptyState'
import { bookings } from '@/data/bookings'
import { getTechnicianById } from '@/data/technicians'
import { formatDateTime, cn } from '@/lib/utils'

const TABS = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function MyBookings() {
  const [tab, setTab] = useState('active')

  const filtered = useMemo(() => {
    if (tab === 'active') return bookings.filter((b) => !['completed', 'cancelled'].includes(b.status))
    if (tab === 'completed') return bookings.filter((b) => b.status === 'completed')
    return bookings.filter((b) => b.status === 'cancelled')
  }, [tab])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">My Bookings</h1>
          <p className="text-sm text-muted mt-1">Track and manage all your service requests.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-white border border-line rounded-xl p-1 w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              tab === t.key ? 'bg-ink text-white' : 'text-muted hover:text-ink'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl">
          <EmptyState
            icon={ClipboardList}
            title="No bookings here yet"
            description="When you book a service, it will show up in this tab."
            actionLabel="Find a professional"
            to="/search"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b, i) => {
            const tech = getTechnicianById(b.technicianId)
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Link
                  to={`/bookings/${b.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-line rounded-2xl p-5 hover:shadow-lg hover:shadow-ink/5 transition-all"
                >
                  <img src={tech?.avatar} alt={tech?.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-ink">{b.service}</h3>
                      <StatusPill status={b.status} />
                    </div>
                    <p className="text-xs text-muted mt-1">with {tech?.name} · <span className="font-mono-tag">{b.id}</span></p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-xs text-muted">
                      <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDateTime(b.scheduledFor)}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={13} /> {b.address}</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <p className="font-display font-bold text-ink">₹{b.price}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-signal">
                      Details <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
