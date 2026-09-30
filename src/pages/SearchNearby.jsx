import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, SlidersHorizontal, ShieldCheck, X, Frown } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import TechnicianCard from '@/components/sections/TechnicianCard'
import { categories } from '@/data/categories'
import { fetchAllTechnicians } from '@/lib/techniciansApi'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'distance', label: 'Nearest first' },
  { value: 'price', label: 'Price: Low to high' },
]

export default function SearchNearby() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [location, setLocation] = useState(params.get('loc') || 'Vasai West, Palghar')
  const [activeCategory, setActiveCategory] = useState(params.get('category') || 'all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPros() {
      setLoading(true)
      const data = await fetchAllTechnicians()
      setTechnicians(data)
      setLoading(false)
    }
    loadPros()
  }, [])

  const results = useMemo(() => {
    let list = [...technicians]
    if (activeCategory !== 'all') list = list.filter((t) => t.category === activeCategory)
    if (verifiedOnly) list = list.filter((t) => t.verified)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          (t.skills || []).some((s) => s.toLowerCase().includes(q))
      )
    }
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'distance') list.sort((a, b) => a.distanceKm - b.distanceKm)
    if (sortBy === 'price') list.sort((a, b) => a.priceStart - b.priceStart)
    return list
  }, [technicians, activeCategory, verifiedOnly, query, sortBy])

  const handleCategoryClick = (id) => {
    setActiveCategory(id)
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setParams(next, { replace: true })
  }

  return (
    <div className="bg-porcelain min-h-screen">
      <section className="bg-white border-b border-line py-8">
        <Container>
          <div className="bg-porcelain rounded-2xl border border-line p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2.5 flex-1 px-3.5 py-2.5">
              <Search size={18} className="text-muted-2 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search technicians, skills, or services"
                className="w-full outline-none text-sm bg-transparent placeholder:text-muted-2"
              />
            </div>
            <div className="hidden sm:block w-px bg-line my-1" />
            <div className="flex items-center gap-2.5 flex-1 px-3.5 py-2.5">
              <MapPin size={18} className="text-muted-2 shrink-0" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your location"
                className="w-full outline-none text-sm bg-transparent placeholder:text-muted-2"
              />
            </div>
            <Button size="md" className="shrink-0">
              Search
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => handleCategoryClick('all')}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors',
                activeCategory === 'all'
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-muted border-line hover:border-ink/30'
              )}
            >
              All services
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={cn(
                  'shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-colors',
                  activeCategory === c.id
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-muted border-line hover:border-ink/30'
                )}
              >
                <c.icon size={13} />
                {c.name}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl font-bold text-ink">
              {loading ? 'Searching...' : `${results.length} professionals near ${location.split(',')[0]}`}
            </h1>
            <p className="text-sm text-muted mt-0.5">Showing verified and community-rated pros</p>
          </div>
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-white text-sm font-semibold"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block">
            <FilterPanel
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </aside>

          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <FilterPanel
                  verifiedOnly={verifiedOnly}
                  setVerifiedOnly={setVerifiedOnly}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
                <Button className="w-full mt-6" onClick={() => setFiltersOpen(false)}>
                  Show {results.length} results
                </Button>
              </motion.div>
            </div>
          )}

          <div>
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-white border border-line animate-pulse" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((tech, i) => (
                  <TechnicianCard tech={tech} key={tech.id} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Frown}
                title="No professionals found"
                description="Try a different category, remove filters, or search a broader term."
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

function FilterPanel({ verifiedOnly, setVerifiedOnly, sortBy, setSortBy }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-ink mb-3">Sort by</h4>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 text-sm text-muted cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value)}
                className="accent-ink"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-line" />

      <div>
        <h4 className="text-sm font-bold text-ink mb-3">Trust</h4>
        <label className="flex items-center gap-2.5 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="accent-ink"
          />
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-volt" /> Verified only
          </span>
        </label>
      </div>

      <div className="h-px bg-line" />

      <div>
        <h4 className="text-sm font-bold text-ink mb-3">Availability</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Available today</Badge>
          <Badge variant="outline">Online now</Badge>
        </div>
      </div>
    </div>
  )
}
