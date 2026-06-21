const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
}

export function Spinner({ size = 'md', inline = false, className = '' }) {
  const spinner = (
    <div
      className={`${sizeMap[size]} border-current border-t-transparent rounded-full animate-spin ${className}`}
    />
  )

  if (inline) return spinner

  return (
    <div className="flex items-center justify-center min-h-screen text-brand-600">
      {spinner}
    </div>
  )
}
