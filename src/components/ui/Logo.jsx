import { cn } from '@/lib/utils'

export default function Logo({ className, dark = false, size = 'md' }) {
  const dims = size === 'sm' ? 30 : size === 'lg' ? 42 : 34
  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <svg width={dims} height={dims} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="11" fill={dark ? '#ffffff' : '#0F1B2D'} />
        <path
          d="M13 27L18.5 13H23L20 20H26L15.5 32L18.5 22H13.8L13 27Z"
          fill={dark ? '#0F1B2D' : '#FF5A1F'}
        />
        <circle cx="29.5" cy="12.5" r="3" fill={dark ? '#0F1B2D' : '#0FAE82'} />
      </svg>
      <span
        className={cn(
          'font-display font-bold tracking-tight',
          size === 'lg' ? 'text-2xl' : 'text-xl',
          dark ? 'text-white' : 'text-ink'
        )}
      >
        Fix<span className={dark ? 'text-[#FF9466]' : 'text-signal'}>Mate</span>
      </span>
    </div>
  )
}
