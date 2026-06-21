export function Card({ children, className = '', hoverable = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-0 rounded-lg border border-surface-200 shadow-soft ${
        hoverable ? 'transition-shadow duration-150 hover:shadow-hover cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-surface-800">{title}</h2>
        {subtitle && <p className="text-sm text-surface-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-3 border-t border-surface-100 bg-surface-50/50 rounded-b-lg ${className}`}>
      {children}
    </div>
  )
}
