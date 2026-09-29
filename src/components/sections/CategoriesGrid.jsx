import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { categories } from '@/data/categories'

export default function CategoriesGrid() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="What we cover"
            title="A verified pro for every fix"
            description="From a dripping tap to a cracked laptop screen — browse the categories our technicians specialize in."
          />
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink shrink-0 hover:text-signal transition-colors"
          >
            View all categories <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.06 }}
            >
              <Link
                to={`/search?category=${cat.id}`}
                className="group block bg-porcelain hover:bg-white border border-transparent hover:border-line rounded-2xl p-5 h-full transition-all hover:shadow-lg hover:shadow-ink/5 hover:-translate-y-0.5"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${cat.color}18` }}
                >
                  <cat.icon size={20} style={{ color: cat.color }} />
                </div>
                <h3 className="font-bold text-ink text-sm">{cat.name}</h3>
                <p className="text-xs text-muted mt-1">{cat.tagline}</p>
                <p className="text-xs font-semibold text-muted-2 mt-3">{cat.proCount.toLocaleString()} pros</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
