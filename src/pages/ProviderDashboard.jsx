import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase, Star, TrendingUp, Clock, ArrowRight, IndianRupee, Power,
} from 'lucide-react'
import { useState } from 'react'
import StatusPill from '@/components/ui/StatusPill'
import Button from '@/components/ui/Button'
import { RatingStars } from '@/components/ui/Rating'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { incomingRequests } from '@/data/bookings'
import { getTechnicianById } from '@/data/technicians'
import { getReviewsByTechnician } from '@/data/reviews'
import { formatDateTime } from '@/lib/utils'

export default function ProviderDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [online, setOnline] = useState(true)
  const profile = getTechnicianById(user?.id) || getTechnicianById('tech-01')
  const pending = incomingRequests.filter((r) => r.status === 'requested')
  const active = incomingRequests.filter((r) => r.status === 'en_route' || r.status === 'in_progress')
  const reviews = getReviewsByTechnician(profile.id)

  const stats = [
    { label: 'This week\'s earnings', value: '₹8,240', icon: IndianRupee, color: '#0FAE82' },
    { label: 'Jobs completed', value: profile.completedJobs, icon: Briefcase, color: '#FF5A1F' },
    { label: 'Average rating', value: profile.rating.toFixed(1), icon: Star, color: '#F5A524' },
    { label: 'Response time', value: profile.responseTime, icon: Clock, color: '#2C6EEA' },
  ]

  const toggleOnline = () => {
    setOnline((o) => !o)
    showToast(!online ? 'You\'re now online and visible to customers.' : 'You\'re now offline.', !online ? 'success' : 'info')
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-ink rounded-3xl p-7 sm:p-9 relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-volt/20 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-2xl object-cover" />
            <div>
              <p className="text-white/50 text-sm">Welcome back,</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">{user?.name}</h1>
              <p className="text-white/60 text-sm mt-1">{profile.title}</p>
            </div>
          </div>
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${
              online ? 'bg-volt text-white' : 'bg-white/10 text-white/70 border border-white/15'
            }`}
          >
            <Power size={16} /> {online ? 'Online — accepting jobs' : 'Offline'}
          </button>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-white border border-line rounded-2xl p-5"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${s.color}18` }}
            >
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p className="font-display text-xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-white border border-line rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-ink">
              New requests <span className="text-signal">({pending.length})</span>
            </h2>
            <Link to="/provider/requests" className="text-xs font-bold text-signal flex items-center gap-1 hover:underline">
              Manage all <ArrowRight size={13} />
            </Link>
          </div>

          {pending.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">No new requests right now. Check back soon.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl border border-line flex items-center gap-3.5">
                  <img src={r.avatar} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink truncate">{r.service}</p>
                    <p className="text-xs text-muted truncate">{r.customerName} · {formatDateTime(r.scheduledFor)}</p>
                  </div>
                  <span className="font-display font-bold text-ink text-sm shrink-0">₹{r.price}</span>
                </div>
              ))}
            </div>
          )}

          {active.length > 0 && (
            <>
              <h3 className="font-bold text-ink text-sm mt-6 mb-3">In progress</h3>
              <div className="space-y-3">
                {active.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl border border-line flex items-center gap-3.5">
                    <img src={r.avatar} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink truncate">{r.service}</p>
                      <p className="text-xs text-muted truncate">{r.customerName}</p>
                    </div>
                    <StatusPill status={r.status} className="shrink-0" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-ink">Recent reviews</h2>
            <Link to="/provider/reviews" className="text-xs font-bold text-signal flex items-center gap-1 hover:underline">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-4">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="pb-4 border-b border-line last:border-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink truncate">{r.customerName}</p>
                    <RatingStars value={r.rating} size={11} />
                  </div>
                </div>
                <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
