import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase, Star, Clock, ArrowRight, IndianRupee, Power,
} from 'lucide-react'
import StatusPill from '@/components/ui/StatusPill'
import { RatingStars } from '@/components/ui/Rating'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { supabase } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'

export default function ProviderDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [online, setOnline] = useState(true)
  const [providerProfile, setProviderProfile] = useState(null)
  const [requests, setRequests] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const fetchData = async () => {
      setLoading(true)

      // Fetch provider's technician profile
      const { data: techData } = await supabase
        .from('fixmate_technician_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (techData) {
        setProviderProfile(techData)
        setOnline(techData.online ?? true)

        // Fetch incoming requests for this provider
        const { data: reqData } = await supabase
          .from('fixmate_bookings')
          .select('*, customer:customer_id(name, avatar_url)')
          .eq('provider_id', user.id)
          .not('status', 'eq', 'cancelled')
          .order('created_at', { ascending: false })

        if (reqData) setRequests(reqData)

        // Fetch reviews
        const { data: revData } = await supabase
          .from('fixmate_reviews')
          .select('*, customer:customer_id(name, avatar_url)')
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false })

        if (revData) setReviews(revData)
      }

      setLoading(false)
    }
    fetchData()
  }, [user?.id])

  const pending = requests.filter((r) => r.status === 'requested')
  const active = requests.filter((r) => ['en_route', 'in_progress', 'accepted'].includes(r.status))
  const completedJobs = requests.filter((r) => r.status === 'completed')
  const completedCount = completedJobs.length
  const totalEarnings = completedJobs.reduce((sum, r) => sum + (Number(r.price) || 0), 0)

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (providerProfile?.rating ? Number(providerProfile.rating).toFixed(1) : '5.0')

  const stats = [
    { label: "Total earnings", value: loading ? '—' : `₹${totalEarnings}`, icon: IndianRupee, color: '#0FAE82' },
    { label: 'Jobs completed', value: loadingVal(loading, completedCount), icon: Briefcase, color: '#FF5A1F' },
    { label: 'Average rating', value: loadingVal(loading, avgRating), icon: Star, color: '#F5A524' },
    { label: 'Response time', value: providerProfile?.response_time || '~15 min', icon: Clock, color: '#2C6EEA' },
  ]

  const toggleOnline = async () => {
    const nextOnline = !online
    setOnline(nextOnline)
    await supabase
      .from('fixmate_technician_profiles')
      .update({ online: nextOnline })
      .eq('user_id', user.id)
    showToast(
      nextOnline ? "You're now online and visible to customers." : "You're now offline.",
      nextOnline ? 'success' : 'info'
    )
  }

  const profileAvatar = providerProfile?.avatar_url || user?.avatar

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
            <img
              src={profileAvatar}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            <div>
              <p className="text-white/50 text-sm">Welcome back,</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">{user?.name}</h1>
              <p className="text-white/60 text-sm mt-1">{providerProfile?.title || 'Service Professional'}</p>
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
            <p className="font-display text-xl font-bold text-ink">{loading ? '—' : s.value}</p>
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

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-porcelain animate-pulse" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">No new requests right now. Check back soon.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((r) => {
                const customerAvatar = r.customer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customer?.name || 'C')}&background=eef0f4&color=1a1a2e&size=80`
                return (
                  <div key={r.id} className="p-3.5 rounded-xl border border-line flex items-center gap-3.5">
                    <img src={customerAvatar} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink truncate">{r.service}</p>
                      <p className="text-xs text-muted truncate">{r.customer?.name} · {formatDateTime(r.scheduled_for)}</p>
                    </div>
                    <span className="font-display font-bold text-ink text-sm shrink-0">₹{r.price}</span>
                  </div>
                )
              })}
            </div>
          )}

          {active.length > 0 && (
            <>
              <h3 className="font-bold text-ink text-sm mt-6 mb-3">In progress</h3>
              <div className="space-y-3">
                {active.map((r) => {
                  const customerAvatar = r.customer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customer?.name || 'C')}&background=eef0f4&color=1a1a2e&size=80`
                  return (
                    <div key={r.id} className="p-3.5 rounded-xl border border-line flex items-center gap-3.5">
                      <img src={customerAvatar} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-ink truncate">{r.service}</p>
                        <p className="text-xs text-muted truncate">{r.customer?.name}</p>
                      </div>
                      <StatusPill status={r.status} className="shrink-0" />
                    </div>
                  )
                })}
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
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-porcelain animate-pulse" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">No reviews yet. Reviews appear after completed jobs.</p>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 3).map((r) => {
                const customerAvatar = r.customer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customer?.name || 'C')}&background=eef0f4&color=1a1a2e&size=80`
                return (
                  <div key={r.id} className="pb-4 border-b border-line last:border-0 last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <img src={customerAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-ink truncate">{r.customer?.name}</p>
                        <RatingStars value={r.rating} size={11} />
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">{r.comment}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function loadingVal(loading, val) {
  return loading ? '—' : val
}
