import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, Wrench, Clock, CheckCircle2, ArrowRight, Star, Plus,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import StatusPill from '@/components/ui/StatusPill'
import { RatingStars } from '@/components/ui/Rating'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { categories } from '@/data/categories'
import { formatDateTime } from '@/lib/utils'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const fetchBookings = async () => {
      setLoadingData(true)
      const { data, error } = await supabase
        .from('fixmate_bookings')
        .select('*, fixmate_technician_profiles:technician_id(id, name, avatar_url, title)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setBookings(data)
      }
      setLoadingData(false)
    }
    fetchBookings()
  }, [user?.id])

  const activeBookings = bookings.filter((b) => !['completed', 'cancelled'].includes(b.status))
  const recentCompleted = bookings.filter((b) => b.status === 'completed').slice(0, 3)
  const uniqueProviders = new Set(bookings.map((b) => b.provider_id)).size

  const stats = [
    { label: 'Active bookings', value: activeBookings.length, icon: Clock, color: '#F5A524' },
    { label: 'Completed jobs', value: bookings.filter((b) => b.status === 'completed').length, icon: CheckCircle2, color: '#0FAE82' },
    { label: 'Pros contacted', value: uniqueProviders, icon: Wrench, color: '#FF5A1F' },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-ink rounded-3xl p-7 sm:p-9 relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-signal/20 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-white/50 text-sm">Welcome back,</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">{user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-white/60 text-sm mt-2 max-w-md">
              Something new to fix? Search verified pros near you in seconds.
            </p>
          </div>
          <Button as={Link} to="/search" size="lg" className="shrink-0">
            <Search size={17} /> Find a professional
          </Button>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-white border border-line rounded-2xl p-5 flex items-center gap-4"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${s.color}18` }}
            >
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-ink">{loadingData ? '—' : s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-white border border-line rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-ink">Active bookings</h2>
            <Link to="/bookings" className="text-xs font-bold text-signal flex items-center gap-1 hover:underline">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {loadingData ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-porcelain animate-pulse" />
              ))}
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted">No active bookings right now.</p>
              <Link to="/search" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-signal">
                <Plus size={13} /> Book a service
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBookings.map((b) => {
                const tech = b.fixmate_technician_profiles || b.technician_profiles
                return (
                  <Link
                    key={b.id}
                    to={`/bookings/${b.id}`}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl border border-line hover:border-ink/20 hover:bg-porcelain/60 transition-colors"
                  >
                    <img src={tech?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech?.name || 'T')}&background=1a1a2e&color=fff&size=80`} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink truncate">{b.service}</p>
                      <p className="text-xs text-muted truncate">{tech?.name} · {formatDateTime(b.scheduled_for)}</p>
                    </div>
                    <StatusPill status={b.status} className="shrink-0" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-ink mb-5">Browse by category</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                to={`/search?category=${c.id}`}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-line hover:border-ink/20 hover:bg-porcelain transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}18` }}>
                  <c.icon size={15} style={{ color: c.color }} />
                </div>
                <span className="text-xs font-semibold text-ink truncate">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-line rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-ink">Recently completed</h2>
          <Link to="/reviews" className="text-xs font-bold text-signal flex items-center gap-1 hover:underline">
            Rate &amp; review <ArrowRight size={13} />
          </Link>
        </div>

        {loadingData ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-porcelain animate-pulse" />
            ))}
          </div>
        ) : recentCompleted.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">Completed jobs will appear here.</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {recentCompleted.map((b) => {
              const tech = b.fixmate_technician_profiles || b.technician_profiles
              return (
                <div key={b.id} className="border border-line rounded-xl p-4">
                  <div className="flex items-center gap-2.5">
                    <img src={tech?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech?.name || 'T')}&background=1a1a2e&color=fff&size=80`} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink truncate">{tech?.name}</p>
                      <p className="text-xs text-muted truncate">{b.service}</p>
                    </div>
                  </div>
                  {b.rating_given ? (
                    <RatingStars value={b.rating_given} size={13} className="mt-3" />
                  ) : (
                    <Link to="/reviews" className="mt-3 flex items-center gap-1 text-xs font-bold text-signal">
                      <Star size={12} /> Leave a review
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
