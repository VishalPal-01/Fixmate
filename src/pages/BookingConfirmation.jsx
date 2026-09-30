import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, MapPin, ArrowRight, Home, ListChecks } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { fetchTechnicianById } from '@/lib/techniciansApi'

export default function BookingConfirmation() {
  const { bookingId } = useParams()
  const { state } = useLocation()
  const [tech, setTech] = useState(
    state?.technicianName
      ? { name: state.technicianName, avatar: state.technicianAvatar }
      : null
  )

  useEffect(() => {
    if (!tech && state?.technicianId) {
      fetchTechnicianById(state.technicianId).then((res) => {
        if (res) setTech(res)
      })
    }
  }, [tech, state?.technicianId])

  return (
    <div className="bg-porcelain min-h-screen py-14 flex items-center">
      <Container className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white border border-line rounded-3xl p-8 sm:p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
            className="w-20 h-20 rounded-full bg-volt-light flex items-center justify-center mx-auto"
          >
            <CheckCircle2 size={38} className="text-volt-dark" />
          </motion.div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-6">
            Booking request sent!
          </h1>
          <p className="text-sm text-muted mt-2">
            {tech ? `${tech.name} has` : 'Your technician has'} been notified and will confirm shortly.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-porcelain border border-line rounded-full px-4 py-2">
            <span className="text-xs text-muted">Booking ID</span>
            <span className="font-mono-tag text-sm font-bold text-ink">{state?.bookingId || bookingId}</span>
          </div>

          {state && (
            <div className="mt-7 bg-porcelain rounded-2xl p-5 text-left space-y-3">
              {tech && (
                <div className="flex items-center gap-3 pb-3 border-b border-line">
                  <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-ink">{tech.name}</p>
                    <p className="text-xs text-muted">{state.service}</p>
                  </div>
                </div>
              )}
              {state.date && (
                <div className="flex items-center gap-2.5 text-sm text-ink">
                  <Calendar size={15} className="text-muted-2" /> {state.date} · {state.slot}
                </div>
              )}
              {state.address && (
                <div className="flex items-center gap-2.5 text-sm text-ink">
                  <MapPin size={15} className="text-muted-2" /> {state.address}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button as={Link} to={`/bookings/${bookingId}`} className="w-full" size="lg">
              Track this booking <ArrowRight size={17} />
            </Button>
            <Button as={Link} to="/dashboard" variant="outline" className="w-full" size="lg">
              <Home size={17} /> Go to dashboard
            </Button>
          </div>
          <Link to="/bookings" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink mt-5">
            <ListChecks size={14} /> View all my bookings
          </Link>
        </motion.div>
      </Container>
    </div>
  )
}
