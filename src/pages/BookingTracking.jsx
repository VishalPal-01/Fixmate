import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  MapPin, Calendar, Phone, MessageCircle, ChevronLeft, CheckCircle2,
  Circle, XCircle, FileText, Star, ShieldCheck,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import StatusPill from '@/components/ui/StatusPill'
import Modal from '@/components/ui/Modal'
import { RatingInput } from '@/components/ui/Rating'
import { Textarea } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { STATUS_STEPS } from '@/data/bookings'
import { formatDateTime, formatTime, cn } from '@/lib/utils'
import { useToast } from '@/context/ToastContext'

import { sendStatusUpdateEmail } from '@/lib/emailService'

export default function BookingTracking() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [booking, setBooking] = useState(null)
  const [tech, setTech] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [rateOpen, setRateOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchBooking = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('fixmate_bookings')
        .select(`
          *,
          fixmate_technician_profiles:technician_id(id, name, avatar_url, title, verified, area, response_time),
          provider:provider_id(id, name, phone, email, avatar_url),
          customer:customer_id(id, name, phone, email)
        `)
        .eq('id', id)
        .single()

      if (!error && data) {
        setBooking(data)
        setTech(data.fixmate_technician_profiles || data.technician_profiles)
      }
      setLoading(false)
    }
    fetchBooking()
  }, [id])

  if (loading) {
    return (
      <div className="bg-porcelain min-h-screen py-10 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-ink/20 border-t-ink animate-spin" />
      </div>
    )
  }

  if (!booking) return <Navigate to="/404" replace />

  const isCancelled = booking.status === 'cancelled'
  const isCompleted = booking.status === 'completed'
  const timeline = booking.timeline || STATUS_STEPS.map((s) => ({ key: s.key, time: null, done: false }))
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === booking.status)

  const handleCancel = async () => {
    setSubmitting(true)
    const nowIso = new Date().toISOString()
    const existingTimeline = Array.isArray(booking.timeline) ? booking.timeline : []
    const updatedTimeline = [
      ...existingTimeline.filter((t) => t.key !== 'cancelled'),
      { key: 'cancelled', time: nowIso, done: true },
    ]

    const { error } = await supabase
      .from('fixmate_bookings')
      .update({
        status: 'cancelled',
        cancel_reason: 'Cancelled by customer',
        timeline: updatedTimeline,
      })
      .eq('id', id)
      .eq('customer_id', user.id)

    if (!error) {
      setBooking({
        ...booking,
        status: 'cancelled',
        cancel_reason: 'Cancelled by customer',
        timeline: updatedTimeline,
      })

      // Send cancellation email via Resend
      void sendStatusUpdateEmail({
        booking: { ...booking, status: 'cancelled' },
        customer: user,
        technician: tech || { name: 'Service Professional' },
        newStatus: 'cancelled',
        cancelReason: 'Cancelled by customer',
      }).catch((emailErr) => {
        console.warn('Cancellation email warning:', emailErr)
      })

      showToast('Booking cancelled successfully.', 'info')
    } else {
      showToast('Could not cancel booking. Please try again.', 'error')
    }
    setCancelOpen(false)
    setSubmitting(false)
  }

  const handleSubmitRating = async () => {
    setSubmitting(true)
    try {
      const { error: bookingErr } = await supabase
        .from('fixmate_bookings')
        .update({ rating_given: rating, review_comment: comment, rated: true })
        .eq('id', id)
        .eq('customer_id', user.id)

      if (bookingErr) throw bookingErr

      // Also persist review in fixmate_reviews
      await supabase.from('fixmate_reviews').insert({
        booking_id: booking.id,
        customer_id: user.id,
        provider_id: booking.provider_id,
        service: booking.service || 'Service Repair',
        rating,
        comment: comment || '',
      })

      setBooking({ ...booking, rated: true, rating_given: rating, review_comment: comment })
      showToast('Thanks! Your review has been posted.', 'success')
    } catch (err) {
      console.error('Submit rating error:', err)
      showToast('Could not submit review. Please try again.', 'error')
    } finally {
      setRateOpen(false)
      setSubmitting(false)
    }
  }

  const techAvatar = tech?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech?.name || 'T')}&background=1a1a2e&color=fff&size=150`

  return (
    <div className="bg-porcelain min-h-screen py-10">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8">
        <Link to="/bookings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-6">
          <ChevronLeft size={16} /> Back to my bookings
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-ink">{booking.service}</h1>
              <StatusPill status={booking.status} />
            </div>
            <p className="text-sm text-muted mt-1 font-mono-tag">{booking.booking_ref || booking.id}</p>
          </div>
          {!isCancelled && !isCompleted && (
            <Button variant="danger" size="sm" onClick={() => setCancelOpen(true)}>
              <XCircle size={15} /> Cancel booking
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="space-y-6">
            {/* Timeline card */}
            <div className="bg-white border border-line rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-ink mb-7">Live status</h3>

              {isCancelled ? (
                <div className="flex items-start gap-3 bg-red-50 rounded-xl p-4">
                  <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-600">This booking was cancelled</p>
                    <p className="text-xs text-red-500/80 mt-1">{booking.cancel_reason || 'No reason provided.'}</p>
                  </div>
                </div>
              ) : (
                <ol className="relative">
                  {STATUS_STEPS.map((step, i) => {
                    const entry = timeline.find?.((t) => t.key === step.key)
                    const done = entry?.done || (i < currentIndex)
                    const isCurrent = i === currentIndex
                    return (
                      <li key={step.key} className="relative pb-8 last:pb-0 pl-10">
                        {i < STATUS_STEPS.length - 1 && (
                          <span
                            className={cn(
                              'absolute left-[15px] top-8 bottom-0 w-0.5',
                              done ? 'bg-volt' : 'bg-line'
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            'absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2',
                            done
                              ? 'bg-volt border-volt text-white'
                              : isCurrent
                              ? 'border-signal text-signal bg-signal-light'
                              : 'border-line text-muted-2 bg-white'
                          )}
                        >
                          {done ? <CheckCircle2 size={16} /> : isCurrent ? <span className="pulse-dot" /> : <Circle size={10} />}
                        </span>
                        <p className={cn('text-sm font-bold', done || isCurrent ? 'text-ink' : 'text-muted-2')}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {entry?.time ? formatTime(entry.time) + ', ' + new Date(entry.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : isCurrent ? 'In progress…' : 'Pending'}
                        </p>
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="bg-white border border-line rounded-2xl p-6">
                <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-muted" /> Issue description
                </h3>
                <p className="text-sm text-muted leading-relaxed">{booking.notes}</p>
              </div>
            )}

            {/* Rate CTA */}
            {isCompleted && !booking.rated && (
              <div className="bg-white border border-line rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-ink">How was your service?</h3>
                  <p className="text-sm text-muted mt-1">Rate {tech?.name} to help other customers choose well.</p>
                </div>
                <Button onClick={() => setRateOpen(true)}>
                  <Star size={16} /> Rate &amp; review
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white border border-line rounded-2xl p-6">
              <h4 className="font-mono-tag text-xs uppercase tracking-wide text-muted-2 font-semibold mb-4">Your technician</h4>
              <div className="flex items-center gap-3">
                <img src={techAvatar} alt={tech?.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-bold text-ink flex items-center gap-1">
                    {tech?.name} {tech?.verified && <ShieldCheck size={13} className="text-volt" />}
                  </p>
                  <p className="text-xs text-muted">{tech?.title}</p>
                </div>
              </div>
              {!isCancelled && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button
                    as="a"
                    href={booking.provider?.phone ? `tel:${booking.provider.phone}` : 'tel:18002663529'}
                    variant="outline"
                    size="sm"
                    title={booking.provider?.phone ? `Call ${booking.provider.phone}` : 'Call Support'}
                  >
                    <Phone size={14} /> Call
                  </Button>
                  <Button
                    as="a"
                    href={
                      booking.provider?.phone
                        ? `https://wa.me/${booking.provider.phone.replace(/[^0-9]/g, '')}`
                        : 'https://wa.me/9118002663529'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    title="Message on WhatsApp"
                  >
                    <MessageCircle size={14} /> Message
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white border border-line rounded-2xl p-6 space-y-4">
              <h4 className="font-mono-tag text-xs uppercase tracking-wide text-muted-2 font-semibold">Booking details</h4>
              <div className="flex items-start gap-2.5 text-sm">
                <Calendar size={15} className="text-muted-2 mt-0.5 shrink-0" />
                <span className="text-ink">{formatDateTime(booking.scheduled_for)}</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm">
                <MapPin size={15} className="text-muted-2 mt-0.5 shrink-0" />
                <span className="text-ink">{booking.address}</span>
              </div>
              <div className="pt-3 border-t border-line flex items-center justify-between">
                <span className="text-sm text-muted">Total</span>
                <span className="font-display font-bold text-ink text-lg">₹{booking.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel this booking?">
        <p className="text-sm text-muted leading-relaxed">
          This will notify {tech?.name} that the service is no longer needed. This action can't be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="w-full" onClick={() => setCancelOpen(false)}>
            Keep booking
          </Button>
          <Button variant="danger" className="w-full" onClick={handleCancel} loading={submitting}>
            Yes, cancel
          </Button>
        </div>
      </Modal>

      <Modal open={rateOpen} onClose={() => setRateOpen(false)} title={`Rate ${tech?.name}`}>
        <div className="text-center">
          <img src={techAvatar} alt={tech?.name} className="w-16 h-16 rounded-full object-cover mx-auto" />
          <p className="text-sm font-bold text-ink mt-3">{tech?.name}</p>
          <div className="flex justify-center mt-4">
            <RatingInput value={rating} onChange={setRating} />
          </div>
        </div>
        <Textarea
          className="mt-5"
          placeholder="Share details about your experience (optional)"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button className="w-full mt-5" onClick={handleSubmitRating} loading={submitting}>
          Submit review
        </Button>
      </Modal>
    </div>
  )
}
