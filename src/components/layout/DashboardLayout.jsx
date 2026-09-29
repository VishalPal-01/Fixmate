import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Bell } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ navItems, title }) {
  const [open, setOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    setOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }


  return (
    <div className="min-h-screen bg-porcelain flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-line bg-white sticky top-0 h-screen">
        <div className="px-6 py-6">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  isActive ? 'bg-ink text-white' : 'text-muted hover:bg-porcelain hover:text-ink'
                )
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-porcelain border border-line">
          <div className="flex items-center gap-3">
            <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink truncate">{user?.name}</p>
              <p className="text-xs text-muted truncate capitalize">{user?.role} account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-600"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-line px-4 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-porcelain"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/50 z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden flex flex-col"
            >
              <div className="px-6 py-6 flex items-center justify-between">
                <Logo />
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold',
                        isActive ? 'bg-ink text-white' : 'text-muted'
                      )
                    }
                  >
                    <item.icon size={17} />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 m-3 rounded-2xl bg-porcelain border border-line">
                <div className="flex items-center gap-3">
                  <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{user?.name}</p>
                    <p className="text-xs text-muted truncate capitalize">{user?.role} account</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-500"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-line bg-white/70 backdrop-blur sticky top-0 z-30">
          <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-porcelain" aria-label="Notifications">
              <Bell size={18} className="text-muted" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-signal" />
            </button>
            <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover" />
          </div>
        </header>
        <div className="pt-16 lg:pt-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
