import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck, MapPin, Clock, Star, MessageCircle, Phone, CheckCircle2,
  Briefcase, Languages, ArrowRight, ThumbsUp,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { RatingStars } from '@/components/ui/Rating'
import TechnicianCard from '@/components/sections/TechnicianCard'
import { fetchTechnicianById, fetchReviewsForTechnician, fetchAllTechnicians } from '@/lib/techniciansApi'
import { getCategoryById } from '@/data/categories'
import { formatDate, cn } from '@/lib/utils'

const TABS = ['Overview', 'Reviews', 'Gallery']

export default function TechnicianDetail() {
  const { id } = useParams()
  const [tab, setTab] = useState('Overview')
  const [tech, setTech] = useState(null)
  const [reviews, setReviews] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const technicianData = await fetchTechnicianById(id)
      setTech(technicianData)

      if (technicianData) {
        const [reviewList, allPros] = await Promise.all([
          fetchReviewsForTechnician(technicianData.id, technicianData.userId),
          fetchAllTechnicians(),
        ])
        setReviews(reviewList)
        setRelated(
          allPros
            .filter((t) => t.category === technicianData.category && t.id !== technicianData.id)
            .slice(0, 3)
        )
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="bg-porcelain min-h-screen py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-ink/20 border-t-ink animate-spin" />
      </div>
    )
  }

  if (!tech) return <Navigate to="/404" replace />

  const category = getCategoryById(tech.category)

  return (
    <div className="bg-porcelain min-h-screen pb-16">
      {/* Header */}
      <section className="bg-white border-b border-line">
        <Container className="py-10">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <img src={tech.avatar} alt={tech.name} className="w-28 h-28 rounded-2xl object-cover" />
              {tech.online && (
                <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-volt border-2 border-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">{tech.name}</h1>
                {tech.verified && (
                  <span title="Verified professional">
                    <ShieldCheck size={20} className="text-volt" />
                  </span>
                )}
              </div>
              <p className="text-muted mt-1">{tech.title}</p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                <RatingStars value={tech.rating} count={tech.reviewCount} showValue size={15} />
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <MapPin size={14} /> {tech.area} · {tech.distanceKm} km away
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <Clock size={14} /> Responds in {tech.responseTime}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {category && <Badge variant="outline" icon={category.icon}>{category.name}</Badge>}
                {(tech.badges || []).map((b) => (
                  <Badge key={b} variant="volt" icon={CheckCircle2}>{b}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="mt-10 grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div>
          <div className="flex items-center gap-1 border-b border-line">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors',
                  tab === t ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
                )}
              >
                {t}
                {t === 'Reviews' && ` (${reviews.length})`}
              </button>
            ))}
          </div>

          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="pt-8">
            {tab === 'Overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-ink mb-3">About</h3>
                  <p className="text-sm text-muted leading-relaxed">{tech.bio || 'Professional technician ready to help with repair and maintenance services.'}</p>
                </div>

                <div>
                  <h3 className="font-bold text-ink mb-3">Skills & services</h3>
                  <div className="flex flex-wrap gap-2">
                    {(tech.skills || []).map((s) => (
                      <Badge key={s} variant="neutral">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-line rounded-2xl p-5">
                    <Briefcase size={18} className="text-signal mb-2.5" />
                    <p className="font-display text-xl font-bold text-ink">{tech.experienceYears} yrs</p>
                    <p className="text-xs text-muted mt-0.5">Experience</p>
                  </div>
                  <div className="bg-white border border-line rounded-2xl p-5">
                    <ThumbsUp size={18} className="text-volt mb-2.5" />
                    <p className="font-display text-xl font-bold text-ink">{(tech.completedJobs || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted mt-0.5">Jobs completed</p>
                  </div>
                  <div className="bg-white border border-line rounded-2xl p-5">
                    <Languages size={18} className="text-amber mb-2.5" />
                    <p className="font-display text-sm font-bold text-ink leading-snug">{(tech.languages || ['English']).join(', ')}</p>
                    <p className="text-xs text-muted mt-0.5">Languages</p>
                  </div>
                </div>
              </div>
            )}

            {tab === 'Reviews' && (
              <div className="space-y-5">
                {reviews.length === 0 && <p className="text-sm text-muted">No reviews yet for this professional.</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white border border-line rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={r.avatar} alt={r.customerName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-bold text-ink">{r.customerName}</p>
                          <p className="text-xs text-muted">{r.service} · {formatDate(r.date)}</p>
                        </div>
                      </div>
                      <RatingStars value={r.rating} size={13} />
                    </div>
                    <p className="text-sm text-muted leading-relaxed mt-3.5">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Gallery' && (
              <div className="grid sm:grid-cols-3 gap-4">
                {(tech.gallery || [1, 2, 3]).map((g) => (
                  <div
                    key={g}
                    className="aspect-square rounded-2xl bg-gradient-to-br from-ink to-slate flex items-center justify-center"
                  >
                    {category && <category.icon size={32} className="text-white/30" />}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:sticky lg:top-24 bg-white border border-line rounded-2xl p-6 shadow-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">Starting price</span>
            <span className="font-display text-2xl font-bold text-ink">₹{tech.priceStart}</span>
          </div>
          <p className="text-xs text-muted-2 mt-1">Final price confirmed after diagnosis</p>

          <Button as={Link} to={`/booking/${tech.id}`} className="w-full mt-5" size="lg">
            Book this pro <ArrowRight size={17} />
          </Button>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Button
              as="a"
              href={
                tech.phone
                  ? `https://wa.me/${tech.phone.replace(/[^0-9]/g, '')}`
                  : 'https://wa.me/9118002663529'
              }
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="w-full"
            >
              <MessageCircle size={16} /> Message
            </Button>
            <Button
              as="a"
              href={tech.phone ? `tel:${tech.phone}` : 'tel:18002663529'}
              variant="outline"
              className="w-full"
            >
              <Phone size={16} /> Call
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-line space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <ShieldCheck size={15} className="text-volt shrink-0" /> ID & background verified
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <Star size={15} className="text-amber shrink-0" fill="#F5A524" /> Satisfaction guarantee on every job
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <Clock size={15} className="text-signal shrink-0" /> Typically responds in {tech.responseTime}
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <Container className="mt-16">
          <h3 className="font-display text-xl font-bold text-ink mb-6">More {category?.name} professionals</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map((t, i) => (
              <TechnicianCard tech={t} key={t.id} index={i} />
            ))}
          </div>
        </Container>
      )}
    </div>
  )
}
