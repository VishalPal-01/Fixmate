import { useState, useEffect } from 'react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, ArrowRight, ClipboardList } from 'lucide-react'
import StatusPill from '@/components/ui/StatusPill'
import EmptyState from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { formatDateTime, cn } from '@/lib/utils'

const TABS = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function MyBookings() {
  const { user } = useAuth()
  const [tab, setTab] = useState('active')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const fetchBookings = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('fixmate_bookings')
        .select('*, fixmate_technician_profiles:technician_id(id, name, avatar_url, title)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) setBookings(data)
      setLoading(false)
    }
    fetchBookings()
  }, [user?.id])

  const filtered = useMemo(() => {
    if (tab === 'active') return bookings.filter((b) => !['completed', 'cancelled'].includes(b.status))
    if (tab === 'completed') return bookings.filter((b) => b.status === 'completed')
    return bookings.filter((b) => b.status === 'cancelled')
  }, [tab, bookings])

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

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-line animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
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
            const tech = b.fixmate_technician_profiles || b.technician_profiles
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
                  <img
                    src={tech?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech?.name || 'T')}&background=1a1a2e&color=fff&size=80`}
                    alt={tech?.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-ink">{b.service}</h3>
                      <StatusPill status={b.status} />
                    </div>
                    <p className="text-xs text-muted mt-1">with {tech?.name} · <span className="font-mono-tag">{b.booking_ref || b.id}</span></p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-xs text-muted">
                      <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDateTime(b.scheduled_for)}</span>
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
