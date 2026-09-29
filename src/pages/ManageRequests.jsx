import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, FileText, Check, X, Phone, MessageCircle, IndianRupee } from 'lucide-react'
import Button from '@/components/ui/Button'
import StatusPill from '@/components/ui/StatusPill'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import { incomingRequests as initialRequests } from '@/data/bookings'
import { useToast } from '@/context/ToastContext'
import { formatDateTime, cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

const TABS = [
  { key: 'requested', label: 'New Requests' },
  { key: 'active', label: 'Active Jobs' },
  { key: 'completed', label: 'Completed' },
]

export default function ManageRequests() {
  const [requests, setRequests] = useState(initialRequests)
  const [tab, setTab] = useState('requested')
  const [declineTarget, setDeclineTarget] = useState(null)
  const { showToast } = useToast()

  const filtered = requests.filter((r) => {
    if (tab === 'requested') return r.status === 'requested'
    if (tab === 'active') return ['accepted', 'en_route', 'in_progress'].includes(r.status)
    return r.status === 'completed'
  })

  const updateStatus = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const handleAccept = (r) => {
    updateStatus(r.id, 'accepted')
    showToast(`Accepted booking for ${r.customerName}.`, 'success')
  }

  const handleDecline = () => {
    if (!declineTarget) return
    setRequests((prev) => prev.filter((r) => r.id !== declineTarget.id))
    showToast('Request declined.', 'info')
    setDeclineTarget(null)
  }

  const advanceStatus = (r) => {
    const flow = { accepted: 'en_route', en_route: 'in_progress', in_progress: 'completed' }
    const next = flow[r.status]
    if (next) {
      updateStatus(r.id, next)
      showToast(next === 'completed' ? 'Job marked complete!' : `Status updated to ${next.replace('_', ' ')}.`, 'success')
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

      {filtered.length === 0 ? (
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
            {filtered.map((r) => (
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
                  <img src={r.avatar} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-ink">{r.customerName}</h3>
                      <StatusPill status={r.status} />
                      <span className="font-mono-tag text-[11px] text-muted-2">{r.id}</span>
                    </div>
                    <p className="text-sm font-semibold text-ink mt-2">{r.service}</p>
                    <div className="mt-2.5 space-y-1.5 text-xs text-muted">
                      <p className="flex items-center gap-1.5"><Calendar size={13} /> {formatDateTime(r.scheduledFor)}</p>
                      <p className="flex items-center gap-1.5"><MapPin size={13} /> {r.address} · {r.distanceKm} km</p>
                      {r.notes && <p className="flex items-start gap-1.5"><FileText size={13} className="mt-0.5 shrink-0" /> {r.notes}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className="font-display text-lg font-bold text-ink flex items-center">
                      <IndianRupee size={15} />{r.price}
                    </span>

                    {r.status === 'requested' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setDeclineTarget(r)}>
                          <X size={15} /> Decline
                        </Button>
                        <Button size="sm" onClick={() => handleAccept(r)}>
                          <Check size={15} /> Accept
                        </Button>
                      </div>
                    )}

                    {['accepted', 'en_route', 'in_progress'].includes(r.status) && (
                      <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-lg border border-line flex items-center justify-center hover:bg-porcelain" aria-label="Call customer">
                          <Phone size={15} />
                        </button>
                        <button className="w-9 h-9 rounded-lg border border-line flex items-center justify-center hover:bg-porcelain" aria-label="Message customer">
                          <MessageCircle size={15} />
                        </button>
                        <Button size="sm" onClick={() => advanceStatus(r)}>
                          {r.status === 'accepted' && 'Start heading over'}
                          {r.status === 'en_route' && 'Mark arrived'}
                          {r.status === 'in_progress' && 'Mark complete'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={!!declineTarget} onClose={() => setDeclineTarget(null)} title="Decline this request?">
        <p className="text-sm text-muted leading-relaxed">
          {declineTarget?.customerName} will be notified and matched with another nearby professional.
          This action can't be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={() => setDeclineTarget(null)}>
            Keep request
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDecline}>
            Decline request
          </Button>
        </div>
      </Modal>
    </div>
  )
}
