import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Bell } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ navItems, title, requiredRole }) {
  const [open, setOpen] = useState(false)
  const [notifsOpen, setNotifsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user, logout, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    setOpen(false)
    setNotifsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!user?.id) return
    const fetchNotifs = async () => {
      const isProvider = user.role === 'provider'
      const { data } = await supabase
        .from('fixmate_bookings')
        .select('id, service, status, booking_ref, created_at, scheduled_for')
        .eq(isProvider ? 'provider_id' : 'customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (data) setNotifications(data)
    }
    fetchNotifs()
  }, [user?.id, user?.role, location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Show nothing while session is being restored
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-porcelain">
        <div className="w-8 h-8 rounded-full border-2 border-ink/20 border-t-ink animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // If user is a provider trying to access customer routes, redirect to provider dashboard
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'provider' ? '/provider/dashboard' : '/dashboard'} replace />
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
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setNotifsOpen((o) => !o)}
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-porcelain transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-muted" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-signal" />
              )}
            </button>
            <AnimatePresence>
              {notifsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-12 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-line p-4 z-20"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-line mb-2">
                      <span className="text-xs font-bold text-ink uppercase tracking-wider font-mono-tag">Notifications</span>
                      <span className="text-[11px] text-muted">{notifications.length} recent</span>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted py-5 text-center">No notifications right now.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto">
                        {notifications.map((n) => (
                          <Link
                            key={n.id}
                            to={user.role === 'provider' ? '/provider/requests' : `/bookings/${n.id}`}
                            onClick={() => setNotifsOpen(false)}
                            className="block p-2.5 rounded-xl hover:bg-porcelain transition-colors text-left"
                          >
                            <p className="text-xs font-bold text-ink truncate">{n.service}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[11px] text-signal font-semibold capitalize">{n.status.replace('_', ' ')}</span>
                              <span className="text-[10px] text-muted-2 font-mono-tag">{n.booking_ref || ''}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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
