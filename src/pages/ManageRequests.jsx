import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, FileText, Check, X, Phone, MessageCircle, IndianRupee, Inbox } from 'lucide-react'
import Button from '@/components/ui/Button'
import StatusPill from '@/components/ui/StatusPill'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { formatDateTime, cn } from '@/lib/utils'
import { sendStatusUpdateEmail } from '@/lib/emailService'

const TABS = [
  { key: 'requested', label: 'New Requests' },
  { key: 'active', label: 'Active Jobs' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function ManageRequests() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('requested')
  const [declineTarget, setDeclineTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    if (!user?.id) return
    const fetchRequests = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('fixmate_bookings')
        .select('*, customer:customer_id(name, email, phone, avatar_url)')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) setRequests(data)
      setLoading(false)
    }
    fetchRequests()
  }, [user?.id])

  const filtered = requests.filter((r) => {
    if (tab === 'requested') return r.status === 'requested'
    if (tab === 'active') return ['accepted', 'en_route', 'in_progress'].includes(r.status)
    if (tab === 'cancelled') return r.status === 'cancelled'
    return r.status === 'completed'
  })

  const updateStatus = async (booking, newStatus, cancelReason = null) => {
    const id = booking.id
    setActionLoading((l) => ({ ...l, [id]: true }))

    const nowIso = new Date().toISOString()
    const existingTimeline = Array.isArray(booking.timeline) ? booking.timeline : []
    const updatedTimeline = [
      ...existingTimeline.filter((t) => t.key !== newStatus),
      { key: newStatus, time: nowIso, done: true },
    ]

    const updates = {
      status: newStatus,
      timeline: updatedTimeline,
    }
    if (cancelReason) {
      updates.cancel_reason = cancelReason
    }

    const { error } = await supabase
      .from('fixmate_bookings')
      .update(updates)
      .eq('id', id)
      .eq('provider_id', user.id)

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      )

      // Send status update email via Resend
      void sendStatusUpdateEmail({
        booking: { ...booking, ...updates },
        customer: booking.customer,
        technician: { name: user.name },
        newStatus,
        cancelReason,
      }).catch((emailErr) => {
        console.warn('Status update email warning:', emailErr)
      })

      setActionLoading((l) => ({ ...l, [id]: false }))
      return true
    } else {
      console.error('Failed to update booking status:', error)
      showToast('Action failed. Please try again.', 'error')
      setActionLoading((l) => ({ ...l, [id]: false }))
      return false
    }
  }

  const handleAccept = async (r) => {
    const ok = await updateStatus(r, 'accepted')
    if (ok) {
      showToast(`Accepted booking for ${r.customer?.name || 'customer'}.`, 'success')
    }
  }

  const handleDecline = async () => {
    if (!declineTarget) return
    const ok = await updateStatus(declineTarget, 'cancelled', 'Declined by service professional')
    if (ok) {
      setRequests((prev) => prev.filter((r) => r.id !== declineTarget.id))
      showToast('Request declined.', 'info')
    }
    setDeclineTarget(null)
  }

  const advanceStatus = async (r) => {
    const flow = { accepted: 'en_route', en_route: 'in_progress', in_progress: 'completed' }
    const next = flow[r.status]
    if (next) {
      const ok = await updateStatus(r, next)
      if (ok) {
        showToast(
          next === 'completed'
            ? 'Job marked complete!'
            : `Status updated to ${next.replace('_', ' ')}.`,
          'success'
        )
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Manage Requests</h1>
        <p className="text-sm text-muted mt-1">Accept new jobs and track work in progress.</p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-line rounded-xl p-1.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              tab === t.key ? 'bg-ink text-white' : 'text-muted hover:text-ink'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-line animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl">
          <EmptyState
            icon={Inbox}
            title="Nothing here yet"
            description="New booking requests will show up in this tab as customers book you."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((r) => {
              const customerAvatar = r.customer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customer?.name || 'C')}&background=eef0f4&color=1a1a2e&size=80`
              return (
                <motion.div
                  layout
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-line rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    <img src={customerAvatar} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-bold text-ink">{r.customer?.name || 'Customer'}</h3>
                        <StatusPill status={r.status} />
                        <span className="font-mono-tag text-[11px] text-muted-2">{r.booking_ref || r.id}</span>
                      </div>
                      <p className="text-sm font-semibold text-ink mt-2">{r.service}</p>
                      <div className="mt-2.5 space-y-1.5 text-xs text-muted">
                        <p className="flex items-center gap-1.5"><Calendar size={13} /> {formatDateTime(r.scheduled_for)}</p>
                        <p className="flex items-center gap-1.5"><MapPin size={13} /> {r.address}</p>
                        {r.notes && <p className="flex items-start gap-1.5"><FileText size={13} className="mt-0.5 shrink-0" /> {r.notes}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="font-display text-lg font-bold text-ink flex items-center">
                        <IndianRupee size={15} />{r.price}
                      </span>

                      {r.status === 'requested' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setDeclineTarget(r)} loading={actionLoading[r.id]}>
                            <X size={15} /> Decline
                          </Button>
                          <Button size="sm" onClick={() => handleAccept(r)} loading={actionLoading[r.id]}>
                            <Check size={15} /> Accept
                          </Button>
                        </div>
                      )}

                      {['accepted', 'en_route', 'in_progress'].includes(r.status) && (
                        <div className="flex gap-2">
                          <a
                            href={r.customer?.phone ? `tel:${r.customer.phone}` : '#'}
                            className="w-9 h-9 rounded-lg border border-line flex items-center justify-center hover:bg-porcelain text-ink transition-colors"
                            aria-label="Call customer"
                            title={r.customer?.phone ? `Call ${r.customer.phone}` : 'No phone number on profile'}
                          >
                            <Phone size={15} />
                          </a>
                          <a
                            href={
                              r.customer?.phone
                                ? `https://wa.me/${r.customer.phone.replace(/[^0-9]/g, '')}`
                                : '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-lg border border-line flex items-center justify-center hover:bg-porcelain text-ink transition-colors"
                            aria-label="Message customer"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle size={15} />
                          </a>
                          <Button size="sm" onClick={() => advanceStatus(r)} loading={actionLoading[r.id]}>
                            {r.status === 'accepted' && 'Start heading over'}
                            {r.status === 'en_route' && 'Mark arrived'}
                            {r.status === 'in_progress' && 'Mark complete'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal open={!!declineTarget} onClose={() => setDeclineTarget(null)} title="Decline this request?">
        <p className="text-sm text-muted leading-relaxed">
          {declineTarget?.customer?.name || 'The customer'} will be notified and matched with another nearby professional.
          This action can't be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={() => setDeclineTarget(null)}>
            Keep request
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDecline} loading={actionLoading[declineTarget?.id]}>
            Decline request
          </Button>
        </div>
      </Modal>
    </div>
  )
}
