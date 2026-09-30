import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Wrench, ShieldCheck, Star } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.email) nextErrors.email = 'Email is required'
    if (!form.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      await login({ email: form.email, password: form.password })

      // Wait briefly for profile to load
      await new Promise((r) => setTimeout(r, 400))

      showToast('Welcome back!', 'success')

      // Redirect to where they came from, or dashboard
      const from = location.state?.from
      if (from) {
        navigate(from, { replace: true })
      } else {
        // We'll redirect to a neutral route; DashboardLayout handles role-based redirect
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.'
      showToast(msg, 'error')
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <Link to="/" className="mb-10">
          <Logo />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm mx-auto lg:mx-0"
        >
          <h1 className="font-display text-3xl font-bold text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Log in to manage your bookings and requests.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-[42px] text-muted-2 hover:text-ink"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link to="/contact" className="text-xs font-semibold text-signal hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Log in <ArrowRight size={17} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            New to FixMate?{' '}
            <Link to="/register" className="font-semibold text-ink hover:text-signal">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex relative bg-ink items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-0 bottom-0 left-1/4 w-px trace-line-v" />
          <div className="absolute top-0 bottom-0 left-2/4 w-px trace-line-v" />
          <div className="absolute top-0 bottom-0 left-3/4 w-px trace-line-v" />
        </div>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-signal/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-volt/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-sm text-white"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
            <Wrench size={24} className="text-signal" />
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            8,200+ verified professionals, one login away.
          </h2>
          <p className="mt-4 text-white/60 text-sm leading-relaxed">
            Track live bookings, message technicians, and manage every repair request from a
            single dashboard.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-sm">
              <ShieldCheck size={16} className="text-volt" /> Verified pros
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Star size={16} className="fill-amber text-amber" /> 4.8 rating
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
