import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Phone, ArrowRight, Users, Wrench, CheckCircle2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { Input, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { categories } from '@/data/categories'
import { cn } from '@/lib/utils'

export default function Register() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') === 'provider' ? 'provider' : 'customer')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', category: categories[0].id })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name) nextErrors.name = 'Full name is required'
    if (!form.email) nextErrors.email = 'Email is required'
    if (!form.phone) nextErrors.phone = 'Phone number is required'
    if (!form.password || form.password.length < 6) nextErrors.password = 'Minimum 6 characters'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    setTimeout(() => {
      register(role, { name: form.name, email: form.email, phone: form.phone, category: form.category })
      setLoading(false)
      showToast('Account created! Welcome to FixMate.', 'success')
      navigate(role === 'provider' ? '/provider/dashboard' : '/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-porcelain flex flex-col items-center px-5 py-10 sm:py-14">
      <Link to="/" className="mb-8">
        <Logo />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-line shadow-xl shadow-ink/5 p-7 sm:p-10"
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink text-center">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted text-center">
          Join FixMate as a customer or list your services as a professional.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 transition-all',
              role === 'customer' ? 'border-ink bg-porcelain' : 'border-line hover:border-muted-2'
            )}
          >
            <Users size={22} className={role === 'customer' ? 'text-signal' : 'text-muted-2'} />
            <span className="text-sm font-bold text-ink">I need a service</span>
            <span className="text-xs text-muted">Book repairs & track jobs</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 transition-all',
              role === 'provider' ? 'border-ink bg-porcelain' : 'border-line hover:border-muted-2'
            )}
          >
            <Wrench size={22} className={role === 'provider' ? 'text-signal' : 'text-muted-2'} />
            <span className="text-sm font-bold text-ink">I'm a professional</span>
            <span className="text-xs text-muted">Get bookings near you</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          <Input
            label="Full name"
            icon={User}
            placeholder="Meera Kulkarni"
            value={form.name}
            onChange={update('name')}
            error={errors.name}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
              error={errors.email}
            />
            <Input
              label="Phone number"
              icon={Phone}
              placeholder="+91 98200 12345"
              value={form.phone}
              onChange={update('phone')}
              error={errors.phone}
            />
          </div>

          <AnimatePresence mode="wait">
            {role === 'provider' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <Select label="Primary service category" value={form.category} onChange={update('category')}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
          />

          <label className="flex items-start gap-2.5 text-xs text-muted pt-1">
            <input type="checkbox" required className="mt-0.5 accent-ink" />
            I agree to FixMate's Terms of Service and Privacy Policy.
          </label>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create {role} account <ArrowRight size={17} />
          </Button>
        </form>

        {role === 'provider' && (
          <div className="mt-5 flex items-start gap-2 bg-volt-light rounded-xl px-4 py-3">
            <CheckCircle2 size={16} className="text-volt-dark shrink-0 mt-0.5" />
            <p className="text-xs text-volt-dark leading-relaxed">
              Provider accounts go through a quick verification step before you can accept bookings — usually approved within 24-48 hours.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ink hover:text-signal">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
