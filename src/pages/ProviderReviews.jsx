import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { RatingStars } from '@/components/ui/Rating'
import EmptyState from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function ProviderReviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [techProfile, setTechProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const fetchData = async () => {
      setLoading(true)

      const { data: techData } = await supabase
        .from('fixmate_technician_profiles')
        .select('rating, review_count')
        .eq('user_id', user.id)
        .maybeSingle()

      if (techData) setTechProfile(techData)

      const { data: revData } = await supabase
        .from('fixmate_reviews')
        .select('*, customer:customer_id(name, avatar_url)')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })

      if (revData) setReviews(revData)
      setLoading(false)
    }
    fetchData()
  }, [user?.id])

  // Calculate distribution from actual reviews
  const displayRating = techProfile?.rating || (reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : 0)

  const totalReviews = techProfile?.review_count || reviews.length

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
    return { star, count, pct }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Reviews &amp; Ratings</h1>
        <p className="text-sm text-muted mt-1">See what customers are saying about your work.</p>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <div className="h-64 rounded-2xl bg-white border border-line animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-line animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-line rounded-2xl p-6 h-fit"
          >
            <div className="text-center">
              <p className="font-display text-5xl font-bold text-ink">
                {reviews.length ? displayRating.toFixed(1) : '—'}
              </p>
              {reviews.length > 0 && (
                <RatingStars value={displayRating} size={16} className="justify-center mt-2" />
              )}
              <p className="text-sm text-muted mt-1.5">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="mt-6 space-y-2.5">
                {distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-muted w-3">{d.star}</span>
                    <div className="flex-1 h-2 rounded-full bg-porcelain overflow-hidden">
                      <div className="h-full bg-amber rounded-full" style={{ width: `${d.pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-2 w-8 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <div>
            {reviews.length === 0 ? (
              <div className="bg-white border border-line rounded-2xl">
                <EmptyState icon={MessageSquare} title="No reviews yet" description="Reviews from customers will appear here after completed jobs." />
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r, i) => {
                  const customerAvatar = r.customer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customer?.name || 'C')}&background=eef0f4&color=1a1a2e&size=80`
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="bg-white border border-line rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={customerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-ink text-sm">{r.customer?.name || 'Customer'}</p>
                            <p className="text-xs text-muted">{r.service} · {formatDate(r.created_at)}</p>
                          </div>
                        </div>
                        <RatingStars value={r.rating} size={13} />
                      </div>
                      <p className="text-sm text-ink mt-3 leading-relaxed">{r.comment}</p>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
