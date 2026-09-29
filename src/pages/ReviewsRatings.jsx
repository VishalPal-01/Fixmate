import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ShieldCheck } from 'lucide-react'
import { RatingInput, RatingStars } from '@/components/ui/Rating'
import { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { bookings } from '@/data/bookings'
import { getTechnicianById } from '@/data/technicians'
import { useToast } from '@/context/ToastContext'
import { formatDate } from '@/lib/utils'

export default function ReviewsRatings() {
  const { showToast } = useToast()
  const [ratedMap, setRatedMap] = useState(
    Object.fromEntries(bookings.filter((b) => b.rated).map((b) => [b.id, { rating: b.ratingGiven, comment: '' }]))
  )
  const [drafts, setDrafts] = useState({})

  const completed = bookings.filter((b) => b.status === 'completed')
  const toRate = completed.filter((b) => !ratedMap[b.id])
  const rated = completed.filter((b) => ratedMap[b.id])

  const setDraftRating = (id, val) => setDrafts((d) => ({ ...d, [id]: { ...d[id], rating: val } }))
  const setDraftComment = (id, val) => setDrafts((d) => ({ ...d, [id]: { ...d[id], comment: val } }))

  const submitReview = (id) => {
    const draft = drafts[id]
    if (!draft?.rating) {
      showToast('Please select a star rating first.', 'error')
      return
    }
    setRatedMap((m) => ({ ...m, [id]: draft }))
    showToast('Thanks for your feedback!', 'success')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Reviews & Ratings</h1>
        <p className="text-sm text-muted mt-1">Rate completed jobs to help other customers choose well.</p>
      </div>

      <div>
        <h2 className="font-bold text-ink text-sm uppercase tracking-wide font-mono-tag mb-4">
          Pending your review ({toRate.length})
        </h2>
        {toRate.length === 0 ? (
          <div className="bg-white border border-line rounded-2xl">
            <EmptyState icon={Star} title="You're all caught up" description="No completed jobs are waiting for a review right now." />
          </div>
        ) : (
          <div className="space-y-4">
            {toRate.map((b, i) => {
              const tech = getTechnicianById(b.technicianId)
              const draft = drafts[b.id] || {}
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="bg-white border border-line rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3.5">
                    <img src={tech?.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink flex items-center gap-1.5">
                        {tech?.name} {tech?.verified && <ShieldCheck size={13} className="text-volt" />}
                      </p>
                      <p className="text-xs text-muted">{b.service} · {formatDate(b.scheduledFor)}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-ink mb-2">How was the service?</p>
                    <RatingInput value={draft.rating || 0} onChange={(v) => setDraftRating(b.id, v)} />
                  </div>

                  <Textarea
                    className="mt-4"
                    rows={3}
                    placeholder="Tell others about your experience (optional)"
                    value={draft.comment || ''}
                    onChange={(e) => setDraftComment(b.id, e.target.value)}
                  />

                  <Button className="mt-4" onClick={() => submitReview(b.id)}>
                    Submit review
                  </Button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {rated.length > 0 && (
        <div>
          <h2 className="font-bold text-ink text-sm uppercase tracking-wide font-mono-tag mb-4">
            Your reviews ({rated.length})
          </h2>
          <div className="space-y-3">
            {rated.map((b) => {
              const tech = getTechnicianById(b.technicianId)
              const info = ratedMap[b.id]
              return (
                <div key={b.id} className="bg-white border border-line rounded-2xl p-5 flex items-start gap-3.5">
                  <img src={tech?.avatar} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-ink text-sm">{tech?.name}</p>
                      <RatingStars value={info.rating} size={13} />
                    </div>
                    <p className="text-xs text-muted mt-1">{b.service} · {formatDate(b.scheduledFor)}</p>
                    {info.comment && <p className="text-sm text-ink mt-2 leading-relaxed">{info.comment}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
