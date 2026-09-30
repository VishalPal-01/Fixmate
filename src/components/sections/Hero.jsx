import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, ShieldCheck, ArrowRight, Star } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

const BOARD_ITEMS = [
  { name: 'Ramesh K.', role: 'Plumber', status: 'En Route', eta: '8 min', color: '#F5A524', avatar: 'https://ui-avatars.com/api/?name=Ramesh+K&background=F5A524&color=fff&size=100' },
  { name: 'Ayesha P.', role: 'Electrician', status: 'Online', eta: 'Nearby', color: '#0FAE82', avatar: 'https://ui-avatars.com/api/?name=Ayesha+P&background=0FAE82&color=fff&size=100' },
  { name: 'Vikram S.', role: 'Mobile Repair', status: 'In Progress', eta: 'On site', color: '#FF5A1F', avatar: 'https://ui-avatars.com/api/?name=Vikram+S&background=FF5A1F&color=fff&size=100' },
]

export default function Hero() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('loc', location)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-porcelain">
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]">
        <div className="absolute top-24 left-1/3 w-px h-40 trace-line-v" />
        <div className="absolute top-40 right-1/4 w-52 h-px trace-line" />
      </div>

      <Container className="relative pt-14 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white pl-2.5 pr-4 py-1.5 mb-6"
            >
              <span className="pulse-dot text-volt" />
              <span className="text-xs font-semibold text-ink">8,200+ verified pros online right now</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-ink leading-[1.08] tracking-tight"
            >
              Fix it today, <br />
              not <span className="relative inline-block">
                <span className="relative z-10">"someday."</span>
                <span className="absolute left-0 right-0 bottom-1.5 h-3 bg-signal-light -z-0" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-5 text-lg text-muted max-w-lg leading-relaxed"
            >
              FixMate connects you with background-verified plumbers, electricians, technicians
              and more — with upfront pricing and live tracking from booking to done.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              onSubmit={handleSearch}
              className="mt-8 bg-white rounded-2xl border border-line shadow-lg shadow-ink/5 p-2 flex flex-col sm:flex-row gap-2"
            >
              <div className="flex items-center gap-2.5 flex-1 px-3.5 py-2.5">
                <Search size={18} className="text-muted-2 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What needs fixing? e.g. leaking tap"
                  className="w-full outline-none text-sm placeholder:text-muted-2 bg-transparent"
                />
              </div>
              <div className="hidden sm:block w-px bg-line my-1" />
              <div className="flex items-center gap-2.5 flex-1 px-3.5 py-2.5">
                <MapPin size={18} className="text-muted-2 shrink-0" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your area or pincode"
                  className="w-full outline-none text-sm placeholder:text-muted-2 bg-transparent"
                />
              </div>
              <Button type="submit" size="lg" className="shrink-0">
                Search <ArrowRight size={17} />
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted">
                <ShieldCheck size={16} className="text-volt" /> Background-verified pros
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted">
                <Star size={16} className="fill-amber text-amber" /> 4.8 average rating
              </div>
              <div className="flex -space-x-2">
                {[
                  { name: 'M', bg: '2C6EEA' },
                  { name: 'R', bg: '0FAE82' },
                  { name: 'A', bg: 'F5A524' },
                  { name: 'V', bg: 'FF5A1F' },
                ].map((u, idx) => (
                  <img
                    key={idx}
                    src={`https://ui-avatars.com/api/?name=${u.name}&background=${u.bg}&color=fff&size=60`}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Live dispatch board — signature element */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-ink rounded-3xl p-6 shadow-2xl shadow-ink/25 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-signal/20 blur-3xl" />
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono-tag text-[11px] tracking-widest text-white/50 uppercase">Live Dispatch Board</span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-volt">
                  <span className="pulse-dot" /> LIVE
                </span>
              </div>

              <div className="space-y-3">
                {BOARD_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                    className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-3"
                  >
                    <img src={item.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-xs text-white/50">{item.role}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full inline-block"
                        style={{ color: item.color, backgroundColor: `${item.color}22` }}
                      >
                        {item.status}
                      </span>
                      <p className="text-[11px] text-white/40 mt-1 font-mono-tag">{item.eta}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-display text-lg font-bold text-white">17min</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wide">Avg response</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white">4.8★</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wide">Avg rating</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white">142k</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wide">Jobs done</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-line px-4 py-3 hidden sm:flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-volt-light flex items-center justify-center">
                <ShieldCheck size={16} className="text-volt-dark" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">ID Verified</p>
                <p className="text-[10px] text-muted">Every technician</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
