import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react'
import { RatingStars } from '@/components/ui/Rating'
import Badge from '@/components/ui/Badge'
import { getCategoryById } from '@/data/categories'

export default function TechnicianCard({ tech, index = 0 }) {
  const category = getCategoryById(tech.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
    >
      <Link
        to={`/pros/${tech.id}`}
        className="group flex flex-col h-full bg-white border border-line rounded-2xl p-5 hover:shadow-xl hover:shadow-ink/5 hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img src={tech.avatar} alt={tech.name} className="w-16 h-16 rounded-xl object-cover" />
            {tech.online && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-volt border-2 border-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-ink truncate">{tech.name}</h3>
              {tech.verified && <ShieldCheck size={15} className="text-volt shrink-0" />}
            </div>
            <p className="text-xs text-muted mt-0.5 truncate">{tech.title}</p>
            <div className="mt-1.5">
              <RatingStars value={tech.rating} count={tech.reviewCount} size={13} showValue />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {category && (
            <Badge variant="outline" icon={category.icon}>
              {category.name}
            </Badge>
          )}
          {(tech.badges || []).slice(0, 1).map((b) => (
            <Badge key={b} variant="volt">
              {b}
            </Badge>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {tech.distanceKm} km away
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {tech.responseTime}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-2">Starts at</span>
            <p className="font-display font-bold text-ink">₹{tech.priceStart}</p>
          </div>
          <span className="w-9 h-9 rounded-full bg-porcelain group-hover:bg-signal flex items-center justify-center transition-colors">
            <ArrowRight size={16} className="text-ink group-hover:text-white transition-colors" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
