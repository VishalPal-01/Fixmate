import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { RatingStars } from '@/components/ui/Rating'
import EmptyState from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { getTechnicianById } from '@/data/technicians'
import { getReviewsByTechnician } from '@/data/reviews'
import { formatDate } from '@/lib/utils'

export default function ProviderReviews() {
  const { user } = useAuth()
  const profile = getTechnicianById(user?.id) || getTechnicianById('tech-01')
  const reviews = getReviewsByTechnician(profile.id)

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
    return { star, count, pct }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Reviews & Ratings</h1>
        <p className="text-sm text-muted mt-1">See what customers are saying about your work.</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-line rounded-2xl p-6 h-fit"
        >
          <div className="text-center">
            <p className="font-display text-5xl font-bold text-ink">{profile.rating.toFixed(1)}</p>
            <RatingStars value={profile.rating} size={16} className="justify-center mt-2" />
            <p className="text-sm text-muted mt-1.5">Based on {profile.reviewCount} reviews</p>
          </div>

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
        </motion.div>

        <div>
          {reviews.length === 0 ? (
            <div className="bg-white border border-line rounded-2xl">
              <EmptyState icon={MessageSquare} title="No reviews yet" description="Reviews from customers will appear here after completed jobs." />
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="bg-white border border-line rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-ink text-sm">{r.customerName}</p>
                        <p className="text-xs text-muted">{r.service} · {formatDate(r.date)}</p>
                      </div>
                    </div>
                    <RatingStars value={r.rating} size={13} />
                  </div>
                  <p className="text-sm text-ink mt-3 leading-relaxed">{r.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
