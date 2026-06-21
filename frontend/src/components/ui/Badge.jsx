const variants = {
  success: 'bg-success-50 text-success-700',
  info: 'bg-info-50 text-info-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  neutral: 'bg-surface-100 text-surface-600',
  admin: 'bg-role-admin-50 text-role-admin-600',
  dietitian: 'bg-role-dietitian-50 text-role-dietitian-600',
  user: 'bg-role-user-50 text-role-user-600',
}

export function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
