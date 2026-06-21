const fieldBase =
  'border rounded-md px-3 py-2 text-sm outline-none transition focus:ring-2 ' +
  'focus:ring-brand-500/40 focus:border-brand-500 bg-surface-0 text-surface-800 ' +
  'placeholder:text-surface-400 disabled:bg-surface-50 disabled:text-surface-400'

function FieldWrapper({ label, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-surface-700">{label}</label>}
      {children}
      {error ? (
        <span className="text-xs text-danger-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-surface-400">{hint}</span>
      ) : null}
    </div>
  )
}

export function Input({ label, error, hint, className = '', ...props }) {
  return (
    <FieldWrapper label={label} error={error} hint={hint}>
      <input
        className={`${fieldBase} ${error ? 'border-danger-400' : 'border-surface-300'} ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
}

export function Textarea({ label, error, hint, className = '', rows = 4, ...props }) {
  return (
    <FieldWrapper label={label} error={error} hint={hint}>
      <textarea
        rows={rows}
        className={`${fieldBase} resize-y ${error ? 'border-danger-400' : 'border-surface-300'} ${className}`}
        {...props}
      />
    </FieldWrapper>
  )
}

export function Select({ label, error, hint, className = '', children, ...props }) {
  return (
    <FieldWrapper label={label} error={error} hint={hint}>
      <select
        className={`${fieldBase} ${error ? 'border-danger-400' : 'border-surface-300'} ${className}`}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
}
