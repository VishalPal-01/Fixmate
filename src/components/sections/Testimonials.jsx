import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { RatingStars } from '@/components/ui/Rating'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function Testimonials() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReviews() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('fixmate_reviews')
          .select('*, customer:fixmate_profiles!fixmate_reviews_customer_id_fkey(name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(4)

        if (!error && data && data.length > 0) {
          setReviews(
            data.map((r) => ({
              id: r.id,
              name: r.customer?.name || 'Verified Customer',
              avatar:
                r.customer?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customer?.name || 'Customer')}&background=2C6EEA&color=fff&size=100`,
              role: r.service || 'Service Booking',
              quote: r.comment || 'Great professional service and on-time completion.',
              rating: r.rating || 5,
            }))
          )
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [])

  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Customer stories"
          title="Trusted by thousands of households"
          align="center"
        />

        {loading ? (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-porcelain animate-pulse" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-porcelain rounded-2xl p-6 flex flex-col h-full"
              >
                <Quote size={22} className="text-signal/40 mb-3" fill="currentColor" />
                <p className="text-sm text-ink leading-relaxed flex-1">"{t.quote}"</p>
                <div className="mt-5 pt-5 border-t border-line flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{t.name}</p>
                    <p className="text-xs text-muted truncate">{t.role}</p>
                  </div>
                </div>
                <RatingStars value={t.rating} size={12} className="mt-3" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-12 bg-porcelain rounded-2xl border border-line p-10 text-center max-w-lg mx-auto">
            <Quote size={24} className="text-muted/40 mx-auto mb-3" />
            <p className="font-bold text-ink text-sm">No customer reviews yet</p>
            <p className="text-xs text-muted mt-1">Real ratings and reviews from verified jobs will appear here as repairs are completed.</p>
          </div>
        )}
      </Container>
    </section>
  )
}
