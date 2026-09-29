import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-signal text-white hover:bg-signal-dark shadow-sm shadow-signal/20',
  dark: 'bg-ink text-white hover:bg-ink-2',
  outline: 'border border-line bg-white text-ink hover:border-ink/30 hover:bg-porcelain',
  ghost: 'text-ink hover:bg-black/5',
  volt: 'bg-volt text-white hover:bg-volt-dark',
  subtle: 'bg-porcelain text-ink hover:bg-line/60',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
}

const SIZES = {
  sm: 'text-sm px-3.5 py-2 gap-1.5',
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-base px-7 py-3.5 gap-2',
  icon: 'p-2.5',
}

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className,
      loading = false,
      disabled,
      as: Component = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap',
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'
export default Button
