import { useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, FileText, ShieldCheck, ChevronLeft } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { RatingStars } from '@/components/ui/Rating'
import { getTechnicianById } from '@/data/technicians'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/lib/utils'

const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM']

export default function Booking() {
  const { technicianId } = useParams()
  const tech = getTechnicianById(technicianId)
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    service: tech?.skills[0] || '',
    date: '',
    slot: '',
    address: user?.address || '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (!tech) return <Navigate to="/404" replace />

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const estimatedTotal = tech.priceStart

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.date) nextErrors.date = 'Choose a date'
    if (!form.slot) nextErrors.slot = 'Choose a time slot'
    if (!form.address) nextErrors.address = 'Address is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    setTimeout(() => {
      const bookingId = `FM-${Math.floor(20000 + Math.random() * 9999)}`
      setSubmitting(false)
      showToast('Booking request sent to the technician!', 'success')
      navigate(`/booking-confirmation/${bookingId}`, {
        state: { technicianId: tech.id, ...form, price: estimatedTotal, bookingId },
      })
    }, 900)
  }

  return (
    <div className="bg-porcelain min-h-screen py-10">
      <Container className="max-w-5xl">
        <Link to={`/pros/${tech.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-6">
          <ChevronLeft size={16} /> Back to profile
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="bg-white border border-line rounded-2xl p-6 sm:p-8"
            noValidate
          >
            <h1 className="font-display text-2xl font-bold text-ink">Book {tech.name}</h1>
            <p className="text-sm text-muted mt-1.5">Fill in the details below to confirm your service request.</p>

            <div className="mt-7 space-y-5">
              <Select label="Service needed" value={form.service} onChange={update('service')}>
                {tech.skills.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>

              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  type="date"
                  label="Preferred date"
                  icon={Calendar}
                  value={form.date}
                  onChange={update('date')}
                  error={errors.date}
                  min={new Date().toISOString().split('T')[0]}
                />
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Preferred time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setForm({ ...form, slot })}
                        className={cn(
                          'py-2.5 rounded-xl text-xs font-semibold border transition-colors',
                          form.slot === slot
                            ? 'bg-ink text-white border-ink'
                            : 'bg-white text-muted border-line hover:border-ink/30'
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.slot && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.slot}</p>}
                </div>
              </div>

              <Input
                label="Service address"
                icon={MapPin}
                placeholder="House no, building, area, city"
                value={form.address}
                onChange={update('address')}
                error={errors.address}
              />

              <Textarea
                label="Describe the issue (optional)"
                placeholder="e.g. Kitchen tap is leaking continuously from the base"
                rows={4}
                value={form.notes}
                onChange={update('notes')}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-8" loading={submitting}>
              Confirm booking request
            </Button>
            <p className="text-xs text-muted-2 text-center mt-3">
              You won't be charged yet. The technician will confirm before work begins.
            </p>
          </motion.form>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-line rounded-2xl p-6 lg:sticky lg:top-24"
          >
            <h3 className="text-sm font-bold text-muted uppercase tracking-wide font-mono-tag text-xs">Booking summary</h3>
            <div className="flex items-center gap-3 mt-4">
              <img src={tech.avatar} alt={tech.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-ink text-sm flex items-center gap-1">
                  {tech.name} {tech.verified && <ShieldCheck size={13} className="text-volt" />}
                </p>
                <RatingStars value={tech.rating} count={tech.reviewCount} size={11} />
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-line space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Service</span>
                <span className="font-medium text-ink text-right">{form.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Date</span>
                <span className="font-medium text-ink">{form.date || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Time</span>
                <span className="font-medium text-ink">{form.slot || '—'}</span>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-line">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-ink">Estimated total</span>
                <span className="font-display text-xl font-bold text-ink">₹{estimatedTotal}</span>
              </div>
              <p className="text-xs text-muted-2 mt-1">Final price may vary based on materials & diagnosis</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
