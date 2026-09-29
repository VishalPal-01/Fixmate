import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  light = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow && (
        <div className={cn('flex items-center gap-2 mb-3', align === 'center' && 'justify-center')}>
          <span className="w-6 h-px bg-signal" />
          <span className="font-mono-tag text-xs font-semibold tracking-[0.18em] uppercase text-signal">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className={cn('text-3xl sm:text-4xl font-bold tracking-tight', light ? 'text-white' : 'text-ink')}>
        {title}
      </h2>
      {description && (
        <p className={cn('mt-3.5 text-base leading-relaxed', light ? 'text-white/70' : 'text-muted')}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
