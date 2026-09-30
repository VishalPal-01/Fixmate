import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const isSupabaseConfigured = Boolean(
  isValidUrl(rawUrl) && rawKey && rawKey !== 'your_supabase_anon_key'
)

if (!isSupabaseConfigured) {
  console.warn(
    '[FixMate] Supabase is not configured with valid credentials yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

const supabaseUrl = isValidUrl(rawUrl) ? rawUrl : 'https://placeholder.supabase.co'
const supabaseAnonKey = rawKey || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
