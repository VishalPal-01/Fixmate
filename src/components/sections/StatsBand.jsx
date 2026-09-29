import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import { platformStats } from '@/data/misc'

export default function StatsBand() {
  return (
    <section className="py-14 bg-white border-y border-line">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {platformStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center lg:text-left lg:border-l lg:first:border-l-0 lg:pl-8 lg:first:pl-0 border-line"
            >
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
