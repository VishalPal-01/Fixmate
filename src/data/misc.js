// All fake and mock testimonials have been purged. Real customer reviews are loaded via Supabase.
export const testimonials = []

export const platformStats = [
  { label: 'Verified professionals', value: '8,200+' },
  { label: 'Repairs completed', value: '142,000+' },
  { label: 'Average response time', value: '17 min' },
  { label: 'Cities covered', value: '32' },
]

export const howItWorks = [
  {
    step: 1,
    title: 'Tell us what\'s broken',
    description: 'Pick a service category or search in your own words. We match you to nearby verified pros.',
  },
  {
    step: 2,
    title: 'Compare and book',
    description: 'See ratings, pricing and availability side by side, then confirm a time that works for you.',
  },
  {
    step: 3,
    title: 'Track it live',
    description: 'Watch your technician\'s status update in real time, from accepted to en route to done.',
  },
  {
    step: 4,
    title: 'Pay and review',
    description: 'Pay the confirmed price with no surprises, then rate your experience to help others choose well.',
  },
]

export const faqs = [
  {
    id: 'f1',
    question: 'How are technicians verified on FixMate?',
    answer: 'Every professional goes through identity verification, background checks, and a skills assessment before they can accept bookings. Verified pros carry a badge on their profile.',
  },
  {
    id: 'f2',
    question: 'How is pricing decided?',
    answer: 'Each technician sets a starting price per service, visible before you book. Any additional cost from parts or extended work is confirmed with you before it\'s carried out.',
  },
  {
    id: 'f3',
    question: 'What if I\'m not happy with the work?',
    answer: 'Every booking is covered by our satisfaction guarantee. If the issue isn\'t resolved, contact support within 48 hours and we\'ll arrange a free follow-up or a refund.',
  },
  {
    id: 'f4',
    question: 'Can I reschedule or cancel a booking?',
    answer: 'Yes, you can reschedule or cancel from the My Bookings page any time before the technician is marked en route, at no extra charge.',
  },
  {
    id: 'f5',
    question: 'Do you operate in my area?',
    answer: 'FixMate currently covers 32 cities and is expanding. Enter your address on the search page to see live availability near you.',
  },
  {
    id: 'f6',
    question: 'How do I become a FixMate professional?',
    answer: 'Register with a provider account, complete your verification documents, and set up your service categories. Approval usually takes 24-48 hours.',
  },
]

export const supportTopics = [
  'Booking issue',
  'Payment & billing',
  'Technician conduct',
  'Account & profile',
  'Become a provider',
  'Something else',
]
