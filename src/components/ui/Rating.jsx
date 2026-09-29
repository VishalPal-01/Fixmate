import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function RatingStars({ value = 0, size = 14, showValue = false, count, className }) {
  const full = Math.floor(value)
  const hasHalf = value - full >= 0.5

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const filled = i < full || (i === full && hasHalf)
          return (
            <Star
              key={i}
              size={size}
              className={filled ? 'fill-amber text-amber' : 'fill-line text-line'}
            />
          )
        })}
      </div>
      {showValue && <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-sm text-muted">({count})</span>}
    </div>
  )
}

export function RatingInput({ value, onChange, size = 28 }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${n} stars`}
        >
          <Star
            size={size}
            className={(hover || value) >= n ? 'fill-amber text-amber' : 'fill-line text-line'}
          />
        </button>
      ))}
    </div>
  )
}
