import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import TechnicianCard from './TechnicianCard'
import { technicians } from '@/data/technicians'

export default function FeaturedTechnicians() {
  const featured = technicians.filter((t) => t.badges.includes('Top Rated')).slice(0, 4)

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((tech, i) => (
            <TechnicianCard tech={tech} key={tech.id} index={i} />
          ))}
        </div>
      </Container>
    </section>
  )
}
