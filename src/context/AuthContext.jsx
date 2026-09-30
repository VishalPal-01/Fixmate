
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'

import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile from Supabase
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      setLoading(false)
      return null
    }

    try {
      const { data, error } = await supabase
        .from('fixmate_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
        return null
      }

      if (!data) {
        console.warn(
          'Profile not found for authenticated user:',
          userId
        )
        setProfile(null)
        return null
      }

      setProfile(data)
      return data
    } catch (error) {
      console.error('Unexpected profile error:', error)
      setProfile(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize session and listen for auth changes
  useEffect(() => {
    let active = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return

      const currentUser = session?.user ?? null

      setUser(currentUser)

      if (currentUser) {
        setLoading(true)

        // Run the profile query after the auth callback completes.
        setTimeout(() => {
          if (active) {
            void fetchProfile(currentUser.id)
          }
        }, 0)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    // Explicitly initialize the current session
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return

      if (error) {
        console.error('Error getting session:', error)
        setLoading(false)
        return
      }

      const currentUser = data.session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        setLoading(true)
        void fetchProfile(currentUser.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    }).catch((error) => {
      if (!active) return

      console.error('Session initialization failed:', error)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  // Register a new user
  // The database trigger creates the profile rows.
  const register = useCallback(
    async ({ name, email, phone, password, role, category }) => {
      const normalizedRole =
        role === 'provider' ? 'provider' : 'customer'

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: normalizedRole,
            category:
              normalizedRole === 'provider' ? category : null,
          },
        },
      })

      if (error) {
        console.error('Signup error:', error.message)
        throw error
      }

      // Email confirmation may be required.
      // In that case, data.session can be null.
      if (data.session && data.user) {
        await fetchProfile(data.user.id)
      }

      return data
    },
    [fetchProfile]
  )

  // Login
  const login = useCallback(async ({ email, password }) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (error) {
      console.error('Login error:', error.message)
      throw error
    }

    return data
  }, [])

  // Logout
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error.message)
      throw error
    }

    setUser(null)
    setProfile(null)
    setLoading(false)
  }, [])

  // Update the logged-in user's profile
  const updateProfile = useCallback(
    async (updates) => {
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Do not allow profile updates to change the user's role.
      const { role, id, email, ...safeUpdates } = updates

      const { data, error } = await supabase
        .from('fixmate_profiles')
        .update(safeUpdates)
        .eq('id', user.id)
        .select()
        .maybeSingle()

      if (error) {
        console.error('Profile update error:', error)
        throw error
      }

      if (!data) {
        throw new Error(
          'Profile was not updated. Check your profile row and RLS policies.'
        )
      }

      setProfile(data)
      return data
    },
    [user]
  )

  // Combined user data for the existing application
  const mergedUser = useMemo(() => {
    if (!user || !profile) return null

    return {
      id: user.id,
      email: user.email,
      name: profile.name || user.email,
      phone: profile.phone,
      role: profile.role,
      category: profile.category,
      avatar:
        profile.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profile.name || 'User'
        )}&background=1a1a2e&color=fff&size=150`,
      title: profile.title,
      address: profile.address,
    }
  }, [user, profile])

  const value = useMemo(
    () => ({
      user: mergedUser,
      rawUser: user,
      profile,
      isAuthenticated: Boolean(user && profile),
      loading,
      login,
      register,
      logout,
      updateProfile,
      fetchProfile,
    }),
    [
      mergedUser,
      user,
      profile,
      loading,
      login,
      register,
      logout,
      updateProfile,
      fetchProfile,
    ]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return context
}