import { Spinner } from './Spinner'

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 ' +
  'rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-soft',
  secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200',
  outline: 'bg-transparent border border-surface-300 text-surface-700 hover:bg-surface-50',
  ghost: 'bg-transparent text-surface-600 hover:bg-surface-100',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 shadow-soft',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export function Button({
  children,
  loading = false,
  variant = 'primary',
  size = 'md',
  icon = null,
  className = '',
  ...props
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" inline className={variant === 'primary' || variant === 'danger' ? 'text-white' : 'text-current'} />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
