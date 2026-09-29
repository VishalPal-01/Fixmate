import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Calendar, Phone, MessageCircle, ChevronLeft, CheckCircle2,
  Circle, XCircle, FileText, Star, ShieldCheck,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import StatusPill from '@/components/ui/StatusPill'
import Modal from '@/components/ui/Modal'
import { RatingInput } from '@/components/ui/Rating'
import { Textarea } from '@/components/ui/Input'
import { bookings, STATUS_STEPS, getBookingById } from '@/data/bookings'
import { getTechnicianById } from '@/data/technicians'
import { formatDateTime, formatTime, cn } from '@/lib/utils'
import { useToast } from '@/context/ToastContext'

export default function BookingTracking() {
  const { id } = useParams()
  const { showToast } = useToast()
  const bookingSeed = getBookingById(id)
  const [booking, setBooking] = useState(
    bookingSeed || {
      id,
      technicianId: 'tech-01',
      service: 'Service Request',
      status: 'requested',
      scheduledFor: new Date().toISOString(),
      address: 'Address not available',
      price: 349,
      notes: '',
      timeline: STATUS_STEPS.map((s, i) => ({ key: s.key, time: i === 0 ? new Date().toISOString() : null, done: i === 0 })),
    }
  )
  const [cancelOpen, setCancelOpen] = useState(false)
  const [rateOpen, setRateOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const tech = getTechnicianById(booking.technicianId)
  if (!tech) return <Navigate to="/404" replace />

  const isCancelled = booking.status === 'cancelled'
  const isCompleted = booking.status === 'completed'
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === booking.status)

  const handleCancel = () => {
    setBooking({ ...booking, status: 'cancelled', cancelReason: 'Cancelled by customer' })
    setCancelOpen(false)
    showToast('Booking cancelled successfully.', 'info')
  }

  const handleSubmitRating = () => {
    setRateOpen(false)
    showToast('Thanks! Your review has been posted.', 'success')
  }

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
            <p className="text-sm text-muted mt-1 font-mono-tag">{booking.id}</p>
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
                    <p className="text-xs text-red-500/80 mt-1">{booking.cancelReason || 'No reason provided.'}</p>
                  </div>
                </div>
              ) : (
                <ol className="relative">
                  {STATUS_STEPS.map((step, i) => {
                    const entry = booking.timeline?.find((t) => t.key === step.key)
                    const done = entry?.done
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
                  <p className="text-sm text-muted mt-1">Rate {tech.name} to help other customers choose well.</p>
                </div>
                <Button onClick={() => setRateOpen(true)}>
                  <Star size={16} /> Rate & review
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white border border-line rounded-2xl p-6">
              <h4 className="font-mono-tag text-xs uppercase tracking-wide text-muted-2 font-semibold mb-4">Your technician</h4>
              <Link to={`/pros/${tech.id}`} className="flex items-center gap-3">
                <img src={tech.avatar} alt={tech.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-bold text-ink flex items-center gap-1">
                    {tech.name} {tech.verified && <ShieldCheck size={13} className="text-volt" />}
                  </p>
                  <p className="text-xs text-muted">{tech.title}</p>
                </div>
              </Link>
              {!isCancelled && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="outline" size="sm"><Phone size={14} /> Call</Button>
                  <Button variant="outline" size="sm"><MessageCircle size={14} /> Message</Button>
                </div>
              )}
            </div>

            <div className="bg-white border border-line rounded-2xl p-6 space-y-4">
              <h4 className="font-mono-tag text-xs uppercase tracking-wide text-muted-2 font-semibold">Booking details</h4>
              <div className="flex items-start gap-2.5 text-sm">
                <Calendar size={15} className="text-muted-2 mt-0.5 shrink-0" />
                <span className="text-ink">{formatDateTime(booking.scheduledFor)}</span>
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
          This will notify {tech.name} that the service is no longer needed. This action can't be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="w-full" onClick={() => setCancelOpen(false)}>
            Keep booking
          </Button>
          <Button variant="danger" className="w-full" onClick={handleCancel}>
            Yes, cancel
          </Button>
        </div>
      </Modal>

      <Modal open={rateOpen} onClose={() => setRateOpen(false)} title={`Rate ${tech.name}`}>
        <div className="text-center">
          <img src={tech.avatar} alt={tech.name} className="w-16 h-16 rounded-full object-cover mx-auto" />
          <p className="text-sm font-bold text-ink mt-3">{tech.name}</p>
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
        <Button className="w-full mt-5" onClick={handleSubmitRating}>
          Submit review
        </Button>
      </Modal>
    </div>
  )
}
