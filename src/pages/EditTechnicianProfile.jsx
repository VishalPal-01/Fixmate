import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Plus, X, ShieldCheck, Save, Loader2 } from 'lucide-react'
import { Input, Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { supabase } from '@/lib/supabase'
import { categories } from '@/data/categories'

export default function EditTechnicianProfile() {
  const { user, fetchProfile } = useAuth()
  const { showToast } = useToast()
  const fileInputRef = useRef(null)
  const [techProfile, setTechProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const [form, setForm] = useState({
    name: '',
    title: '',
    category: categories[0].id,
    bio: '',
    price_start: '',
    experience_years: '',
    area: '',
    phone: '',
    email: '',
    avatar_url: '',
  })
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    const fetchTechData = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('fixmate_technician_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        setTechProfile(data)
        setForm({
          name: user.name || data.name || '',
          title: data.title || '',
          category: data.category || categories[0].id,
          bio: data.bio || '',
          price_start: data.price_start || '',
          experience_years: data.experience_years || '',
          area: data.area || '',
          phone: user.phone || '',
          email: user.email || '',
          avatar_url: data.avatar_url || user.avatar || '',
        })
        setSkills(data.skills || [])
      } else {
        setForm((f) => ({
          ...f,
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          avatar_url: user.avatar || '',
        }))
      }
      setLoading(false)
    }
    fetchTechData()
  }, [user?.id, user?.name, user?.phone, user?.email, user?.avatar])

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const addSkill = (e) => {
    e.preventDefault()
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }
  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s))

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      // Read as data URL for instant clean preview and persistent profile save
      const reader = new FileReader()
      reader.onload = async (event) => {
        const photoUrl = event.target.result
        setForm((f) => ({ ...f, avatar_url: photoUrl }))

        // Update in profiles and technician profile
        await supabase
          .from('fixmate_profiles')
          .update({ avatar_url: photoUrl })
          .eq('id', user.id)

        await supabase
          .from('fixmate_technician_profiles')
          .update({ avatar_url: photoUrl })
          .eq('user_id', user.id)

        if (fetchProfile) await fetchProfile(user.id)
        showToast('Profile photo updated!', 'success')
        setUploadingPhoto(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Failed to update photo:', err)
      showToast('Could not update photo. Please try a smaller image.', 'error')
      setUploadingPhoto(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Update fixmate_profiles name/phone/avatar
      const { error: profileErr } = await supabase
        .from('fixmate_profiles')
        .update({
          name: form.name,
          phone: form.phone,
          ...(form.avatar_url ? { avatar_url: form.avatar_url } : {}),
        })
        .eq('id', user.id)

      if (profileErr) throw profileErr

      // Upsert fixmate_technician_profiles
      const { error: techErr } = await supabase
        .from('fixmate_technician_profiles')
        .upsert(
          {
            user_id: user.id,
            name: form.name,
            title: form.title,
            category: form.category,
            bio: form.bio,
            price_start: Number(form.price_start) || null,
            experience_years: Number(form.experience_years) || null,
            area: form.area,
            skills,
            ...(form.avatar_url ? { avatar_url: form.avatar_url } : {}),
          },
          { onConflict: 'user_id' }
        )

      if (techErr) throw techErr

      // Sync auth context
      if (fetchProfile) {
        await fetchProfile(user.id)
      }

      showToast('Profile updated successfully.', 'success')
    } catch (err) {
      showToast('Could not save changes. Please try again.', 'error')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-white border border-line animate-pulse" />
        ))}
      </div>
    )
  }

  const avatarUrl = techProfile?.avatar_url || user?.avatar

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
              <img
                src={form.avatar_url || avatarUrl}
                alt={form.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center hover:bg-ink-2 transition-colors disabled:opacity-50"
                aria-label="Change photo"
                title="Upload new photo"
              >
                {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink flex items-center gap-1.5">
                {form.name} {techProfile?.verified && <ShieldCheck size={14} className="text-volt" />}
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
            <Input label="Years of experience" type="number" value={form.experience_years} onChange={update('experience_years')} />
          </div>
          <Textarea label="About / bio" rows={4} value={form.bio} onChange={update('bio')} />
        </div>

        <div className="bg-white border border-line rounded-2xl p-6 sm:p-7 space-y-5">
          <h2 className="font-bold text-ink">Service details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Starting price (₹)" type="number" value={form.price_start} onChange={update('price_start')} />
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
            <Input label="Email address" type="email" value={form.email} disabled className="opacity-60 cursor-not-allowed" />
          </div>
          <p className="text-xs text-muted">To change your email address, please contact support.</p>
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
