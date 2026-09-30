import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Wrench } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import TechnicianCard from './TechnicianCard'
import { fetchAllTechnicians } from '@/lib/techniciansApi'

export default function FeaturedTechnicians() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeatured() {
      setLoading(true)
      const list = await fetchAllTechnicians()
      const top = list.filter((t) => (t.badges || []).includes('Top Rated') || t.verified).slice(0, 4)
      setFeatured(top.length > 0 ? top : list.slice(0, 4))
      setLoading(false)
    }
    loadFeatured()
  }, [])

  return (
    <section className="py-20 lg:py-28 bg-porcelain">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Top rated"
            title="Meet a few of our verified pros"
            description="Every professional on FixMate passes identity checks and a skills review before taking their first booking."
          />
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink shrink-0 hover:text-signal transition-colors"
          >
            Browse all pros <ArrowUpRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-line animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((tech, i) => (
              <TechnicianCard tech={tech} key={tech.id} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-line rounded-2xl p-10 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-porcelain flex items-center justify-center mx-auto mb-3 text-muted">
              <Wrench size={22} />
            </div>
            <p className="font-bold text-ink">No professionals listed yet</p>
            <p className="text-xs text-muted mt-1">Verified service professionals will appear here as they register on FixMate.</p>
          </div>
        )}
      </Container>
    </section>
  )
}
