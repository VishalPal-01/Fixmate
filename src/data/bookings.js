// Booking status flow: requested -> accepted -> en_route -> in_progress -> completed
// A booking can also be: cancelled

export const STATUS_STEPS = [
  { key: 'requested', label: 'Requested' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'en_route', label: 'En Route' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

// All fake and mock bookings have been purged. Real data is loaded via Supabase.
export const bookings = []

export const getBookingById = (id) => bookings.find((b) => b.id === id)

// Manage Requests (provider-side incoming requests) — loaded via Supabase in production
export const incomingRequests = []
