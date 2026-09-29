import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef(
  ({ className, label, error, icon: Icon, id, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-ink mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-2" />
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted-2 outline-none transition-all',
              'focus:border-ink/40 focus:ring-4 focus:ring-ink/5',
              Icon && 'pl-11',
              error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export const Textarea = forwardRef(({ className, label, error, id, ...props }, ref) => {
  const inputId = id || props.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-ink mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted-2 outline-none transition-all resize-none',
          'focus:border-ink/40 focus:ring-4 focus:ring-ink/5',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
})
Textarea.displayName = 'Textarea'

export const Select = forwardRef(({ className, label, id, children, ...props }, ref) => {
  const inputId = id || props.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-ink mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-all appearance-none',
          'focus:border-ink/40 focus:ring-4 focus:ring-ink/5',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
})
Select.displayName = 'Select'
