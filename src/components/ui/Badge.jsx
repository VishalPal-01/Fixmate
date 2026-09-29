import { cn } from '@/lib/utils'

const VARIANTS = {
  neutral: 'bg-porcelain text-muted border border-line',
  volt: 'bg-volt-light text-volt-dark',
  signal: 'bg-signal-light text-signal-dark',
  amber: 'bg-amber-light text-[#8a5b0a]',
  dark: 'bg-ink text-white',
  outline: 'border border-line text-ink bg-white',
}

export default function Badge({ children, variant = 'neutral', className, icon: Icon, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  )
}
