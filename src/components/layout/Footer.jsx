import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Container from '@/components/ui/Container'
import { categories } from '@/data/categories'

const SOCIALS = ['X', 'in', 'ig', 'fb']

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact & Support', to: '/contact' },
      { label: 'Become a Professional', to: '/register?role=provider' },
    ],
  },
  {
    title: 'For Customers',
    links: [
      { label: 'Find a Pro', to: '/search' },
      { label: 'Service Categories', to: '/services' },
      { label: 'My Bookings', to: '/bookings' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <Container className="pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12">
          <div>
            <Logo dark />
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              The fastest way to find verified, background-checked repair and maintenance
              professionals near you — with live tracking on every booking.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`FixMate on ${label}`}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[11px] font-bold text-white/70 hover:text-white hover:border-white/40 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono-tag text-xs uppercase tracking-[0.15em] text-white/40 font-semibold mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/75 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-mono-tag text-xs uppercase tracking-[0.15em] text-white/40 font-semibold mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-3">
              {categories.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link to={`/search?category=${c.id}`} className="text-sm text-white/75 hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
            <span className="flex items-center gap-1.5"><Phone size={13} /> 1800-266-3529</span>
            <span className="flex items-center gap-1.5"><Mail size={13} /> support@fixmate.app</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} /> Vasai-Virar, Maharashtra</span>
          </div>
          <p className="text-xs text-white/40">© 2026 FixMate Technologies Pvt. Ltd. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}
