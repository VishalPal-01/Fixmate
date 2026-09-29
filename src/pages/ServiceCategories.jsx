import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import { categories } from '@/data/categories'

export default function ServiceCategories() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      categories.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.tagline.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  return (
    <div className="bg-porcelain min-h-screen">
      <section className="bg-white border-b border-line py-14 sm:py-16">
        <Container className="max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-signal" />
            <span className="font-mono-tag text-xs font-semibold tracking-[0.18em] uppercase text-signal">
              Service categories
            </span>
            <span className="w-6 h-px bg-signal" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
            Every kind of repair, one platform
          </h1>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Browse verified professionals by category, or search for exactly what's broken.
          </p>

          <div className="mt-7 max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-line bg-porcelain outline-none focus:border-ink/30 focus:ring-4 focus:ring-ink/5 text-sm"
            />
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
            >
              <Link
                to={`/search?category=${cat.id}`}
                className="group flex flex-col h-full bg-white border border-line rounded-2xl p-6 hover:shadow-xl hover:shadow-ink/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${cat.color}18` }}
                >
                  <cat.icon size={22} style={{ color: cat.color }} />
                </div>
                <h3 className="font-display font-bold text-lg text-ink">{cat.name}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed flex-1">{cat.description}</p>
                <div className="mt-5 pt-5 border-t border-line flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-2">{cat.proCount.toLocaleString()} pros · from {cat.avgPrice}</p>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-porcelain group-hover:bg-signal flex items-center justify-center transition-colors">
                    <ArrowRight size={16} className="text-ink group-hover:text-white transition-colors" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted py-16">No categories match "{query}".</p>
        )}
      </Container>
    </div>
  )
}
