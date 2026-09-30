import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Services', to: '/services' },
  { label: 'Find a Pro', to: '/search' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate('/')
  }

  const dashboardPath = user?.role === 'provider' ? '/provider/dashboard' : '/dashboard'


  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-line' : 'bg-white/0 border-b border-transparent'
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3.5">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                    isActive ? 'text-ink bg-porcelain' : 'text-muted hover:text-ink hover:bg-porcelain'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-line hover:border-ink/20 transition-colors"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-sm font-semibold text-ink">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-muted-2" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-line py-2 z-20"
                      >
                        <Link
                          to={dashboardPath}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink hover:bg-porcelain"
                        >
                          <LayoutDashboard size={16} className="text-muted" /> Dashboard
                        </Link>
                        <Link
                          to={user.role === 'provider' ? '/provider/profile' : '/dashboard'}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink hover:bg-porcelain"
                        >
                          <User size={16} className="text-muted" /> Profile
                        </Link>
                        <div className="h-px bg-line my-1.5" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left"
                        >
                          <LogOut size={16} /> Log out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" size="md">
                  Log in
                </Button>
                <Button as={Link} to="/register" variant="primary" size="md">
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-porcelain"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-line bg-white"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2.5 rounded-lg text-sm font-semibold',
                      isActive ? 'bg-porcelain text-ink' : 'text-muted'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="h-px bg-line my-2" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-semibold text-ink"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                    className="px-3 py-2.5 rounded-lg text-sm font-semibold text-red-500 text-left"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-1">
                  <Button as={Link} to="/login" variant="outline" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Button>
                  <Button as={Link} to="/register" variant="primary" onClick={() => setMobileOpen(false)}>
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
