// All fake and mock technician profiles have been purged. Real technicians are loaded via Supabase.
export const technicians = []

export const getTechnicianById = (id) => technicians.find((t) => t.id === id)
export const getTechniciansByCategory = (categoryId) =>
  technicians.filter((t) => t.category === categoryId)
