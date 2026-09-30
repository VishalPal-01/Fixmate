import { supabase, isSupabaseConfigured } from './supabase'

export function mapTechnicianRow(row) {
  if (!row) return null
  const profile = row.fixmate_profiles || row.profiles || {}
  const name = row.name || profile.name || 'Service Professional'
  return {
    id: row.id,
    userId: row.user_id,
    name,
    phone: row.phone || profile.phone || '',
    email: row.email || profile.email || '',
    avatar:
      row.avatar_url ||
      profile.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a2e&color=fff&size=150`,
    category: row.category || 'plumbing',
    title: row.title || 'Specialist',
    verified: Boolean(row.verified),
    rating: Number(row.rating) || 5.0,
    reviewCount: Number(row.review_count) || 0,
    experienceYears: Number(row.experience_years) || 1,
    completedJobs: Number(row.completed_jobs) || 0,
    responseTime: row.response_time || '~15 min',
    priceStart: Number(row.price_start) || 299,
    distanceKm: Number(row.distance_km) || 1.5,
    area: row.area || 'Nearby',
    online: row.online ?? true,
    languages: Array.isArray(row.languages) && row.languages.length ? row.languages : ['English', 'Hindi'],
    skills: Array.isArray(row.skills) ? row.skills : [],
    bio: row.bio || '',
    gallery: Array.isArray(row.gallery) && row.gallery.length ? row.gallery : [1, 2, 3],
    badges: Array.isArray(row.badges)
      ? row.badges
      : row.verified
      ? ['Background Verified']
      : [],
  }
}

export async function fetchAllTechnicians() {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from('fixmate_technician_profiles')
      .select('*, profiles:user_id(name, avatar_url, phone, email)')
      .order('rating', { ascending: false })

    if (error || !data) return []
    return data.map(mapTechnicianRow)
  } catch (err) {
    console.error('Failed to fetch technicians from Supabase:', err)
    return []
  }
}

export async function fetchTechnicianById(id) {
  if (!isSupabaseConfigured || !id) return null
  try {
    // Try by fixmate_technician_profiles.id first
    let { data } = await supabase
      .from('fixmate_technician_profiles')
      .select('*, profiles:user_id(name, avatar_url, phone, email)')
      .eq('id', id)
      .maybeSingle()

    // If not found by primary key, try by user_id
    if (!data) {
      const res = await supabase
        .from('fixmate_technician_profiles')
        .select('*, profiles:user_id(name, avatar_url, phone, email)')
        .eq('user_id', id)
        .maybeSingle()
      data = res.data
    }

    if (!data) return null
    return mapTechnicianRow(data)
  } catch (err) {
    console.error('Failed to fetch technician by ID:', err)
    return null
  }
}

export async function fetchReviewsForTechnician(technicianId, userId) {
  if (!isSupabaseConfigured || (!technicianId && !userId)) return []
  try {
    let query = supabase
      .from('fixmate_reviews')
      .select('*, customer:customer_id(name, avatar_url)')

    // reviews.provider_id = fixmate_profiles.id (= userId)
    // Always prefer userId; also include technicianId as fallback for legacy data
    if (userId && technicianId && userId !== technicianId) {
      query = query.or(`provider_id.eq.${userId},provider_id.eq.${technicianId}`)
    } else {
      query = query.eq('provider_id', userId || technicianId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error || !data) return []
    return data.map((r) => ({
      id: r.id,
      technicianId: r.provider_id,
      customerName: r.customer?.name || 'Verified Customer',
      avatar:
        r.customer?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customer?.name || 'Customer')}&background=eef0f4&color=1a1a2e&size=100`,
      rating: r.rating,
      date: r.created_at,
      service: r.service || 'Service Repair',
      comment: r.comment,
    }))
  } catch (err) {
    console.error('Failed to fetch reviews:', err)
    return []
  }
}
