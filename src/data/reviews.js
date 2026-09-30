// All fake and mock reviews have been purged. Real reviews are loaded via Supabase.
export const reviews = []

export const getReviewsByTechnician = (technicianId) =>
  reviews.filter((r) => r.technicianId === technicianId)
