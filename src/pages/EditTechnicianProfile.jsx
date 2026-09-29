import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Plus, X, ShieldCheck, Save } from 'lucide-react'
import { Input, Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { getTechnicianById } from '@/data/technicians'
import { categories } from '@/data/categories'

export default function EditTechnicianProfile() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const seed = getTechnicianById(user?.id) || getTechnicianById('tech-01')

  const [form, setForm] = useState({
    name: user?.name || seed.name,
    title: seed.title,
    category: seed.category,
    bio: seed.bio,
    priceStart: seed.priceStart,
    experienceYears: seed.experienceYears,
    area: seed.area,
    phone: user?.phone || '+91 98200 54321',
    email: user?.email || 'ramesh.k@example.com',
  })
  const [skills, setSkills] = useState(seed.skills)
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const addSkill = (e) => {
    e.preventDefault()
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }
  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s))

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      showToast('Profile updated successfully.', 'success')
    }, 800)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-ink">Edit Profile</h1>
      <p className="text-sm text-muted mt-1">Keep your details accurate to build customer trust.</p>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSave}
        className="mt-7 space-y-6"
      >
        <div className="bg-white border border-line rounded-2xl p-6 sm:p-7">
          <h2 className="font-bold text-ink mb-5">Profile photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={seed.avatar} alt={form.name} className="w-20 h-20 rounded-2xl object-cover" />
              <button
                type="button"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center"
                aria-label="Change photo"
              >
                <Camera size={14} />
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink flex items-center gap-1.5">
                {form.name} <ShieldCheck size={14} className="text-volt" />
              </p>
              <p className="text-xs text-muted mt-0.5">JPG or PNG, at least 400x400px</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-line rounded-2xl p-6 sm:p-7 space-y-5">
          <h2 className="font-bold text-ink">Basic information</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Full name" value={form.name} onChange={update('name')} />
            <Input label="Professional title" value={form.title} onChange={update('title')} placeholder="e.g. Senior Plumbing Specialist" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Select label="Primary category" value={form.category} onChange={update('category')}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Input label="Years of experience" type="number" value={form.experienceYears} onChange={update('experienceYears')} />
          </div>
          <Textarea label="About / bio" rows={4} value={form.bio} onChange={update('bio')} />
        </div>

        <div className="bg-white border border-line rounded-2xl p-6 sm:p-7 space-y-5">
          <h2 className="font-bold text-ink">Service details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Starting price (₹)" type="number" value={form.priceStart} onChange={update('priceStart')} />
            <Input label="Service area" value={form.area} onChange={update('area')} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((s) => (
                <Badge key={s} variant="outline" className="gap-1.5">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill, e.g. Water Heater Install"
                onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                <Plus size={16} /> Add
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-line rounded-2xl p-6 sm:p-7 space-y-5">
          <h2 className="font-bold text-ink">Contact information</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Phone number" value={form.phone} onChange={update('phone')} />
            <Input label="Email address" type="email" value={form.email} onChange={update('email')} />
          </div>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-4">
          <Button type="submit" size="lg" loading={saving}>
            <Save size={17} /> Save changes
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
