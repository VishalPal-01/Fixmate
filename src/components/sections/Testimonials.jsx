import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { RatingStars } from '@/components/ui/Rating'
import { testimonials } from '@/data/misc'

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Customer stories"
          title="Trusted by thousands of households"
          align="center"
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
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
      </Container>
    </section>
  )
}
