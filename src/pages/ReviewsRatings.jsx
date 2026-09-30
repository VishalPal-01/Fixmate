import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ShieldCheck } from 'lucide-react'
import { RatingInput, RatingStars } from '@/components/ui/Rating'
import { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { formatDate } from '@/lib/utils'

export default function ReviewsRatings() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState({})
  const [submitting, setSubmitting] = useState({})

  useEffect(() => {
    if (!user?.id) return
    const fetchCompleted = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('fixmate_bookings')
        .select('*, fixmate_technician_profiles:technician_id(id, name, avatar_url, verified)')
        .eq('customer_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (!error && data) setBookings(data)
      setLoading(false)
    }
    fetchCompleted()
  }, [user?.id])

  const toRate = bookings.filter((b) => !b.rated)
  const rated = bookings.filter((b) => b.rated)

  const setDraftRating = (id, val) => setDrafts((d) => ({ ...d, [id]: { ...d[id], rating: val } }))
  const setDraftComment = (id, val) => setDrafts((d) => ({ ...d, [id]: { ...d[id], comment: val } }))

  const submitReview = async (id) => {
    const draft = drafts[id]
    if (!draft?.rating) {
      showToast('Please select a star rating first.', 'error')
      return
    }
    const b = bookings.find((x) => x.id === id)
    setSubmitting((s) => ({ ...s, [id]: true }))
    try {
      const { error } = await supabase
        .from('fixmate_bookings')
        .update({ rated: true, rating_given: draft.rating, review_comment: draft.comment || '' })
        .eq('id', id)
        .eq('customer_id', user.id)

      if (error) throw error

      if (b) {
        await supabase.from('fixmate_reviews').insert({
          booking_id: b.id,
          customer_id: user.id,
          provider_id: b.provider_id,
          service: b.service || 'Service Repair',
          rating: draft.rating,
          comment: draft.comment || '',
        })
      }

      setBookings((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, rated: true, rating_given: draft.rating, review_comment: draft.comment }
            : item
        )
      )
      showToast('Thanks for your feedback!', 'success')
    } catch (err) {
      console.error('Submit review error:', err)
      showToast('Could not submit review. Please try again.', 'error')
    } finally {
      setSubmitting((s) => ({ ...s, [id]: false }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Reviews &amp; Ratings</h1>
          <p className="text-sm text-muted mt-1">Rate completed jobs to help other customers choose well.</p>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white border border-line animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Reviews &amp; Ratings</h1>
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
              const tech = b.fixmate_technician_profiles || b.technician_profiles
              const draft = drafts[b.id] || {}
              const techAvatar = tech?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech?.name || 'T')}&background=1a1a2e&color=fff&size=80`
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="bg-white border border-line rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3.5">
                    <img src={techAvatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink flex items-center gap-1.5">
                        {tech?.name} {tech?.verified && <ShieldCheck size={13} className="text-volt" />}
                      </p>
                      <p className="text-xs text-muted">{b.service} · {formatDate(b.scheduled_for)}</p>
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

                  <Button className="mt-4" onClick={() => submitReview(b.id)} loading={submitting[b.id]}>
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
              const tech = b.fixmate_technician_profiles || b.technician_profiles
              const techAvatar = tech?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech?.name || 'T')}&background=1a1a2e&color=fff&size=80`
              return (
                <div key={b.id} className="bg-white border border-line rounded-2xl p-5 flex items-start gap-3.5">
                  <img src={techAvatar} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-ink text-sm">{tech?.name}</p>
                      <RatingStars value={b.rating_given} size={13} />
                    </div>
                    <p className="text-xs text-muted mt-1">{b.service} · {formatDate(b.scheduled_for)}</p>
                    {b.review_comment && <p className="text-sm text-ink mt-2 leading-relaxed">{b.review_comment}</p>}
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
