import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, to }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-porcelain border border-line flex items-center justify-center mb-5">
        {Icon && <Icon size={26} className="text-muted-2" />}
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted max-w-sm">{description}</p>}
      {actionLabel && (
        <Button className="mt-6" onClick={onAction} as={to ? 'a' : 'button'} href={to}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
