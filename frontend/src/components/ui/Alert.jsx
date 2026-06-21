import { Icon } from './Icon'

const styles = {
  success: 'bg-success-50 border-success-600/20 text-success-700',
  error: 'bg-danger-50 border-danger-600/20 text-danger-700',
  info: 'bg-info-50 border-info-600/20 text-info-700',
}

const iconNames = {
  success: 'check',
  error: 'alertCircle',
  info: 'info',
}

export function Alert({ type = 'info', message }) {
  if (!message) return null
  return (
    <div className={`flex items-start gap-2 border rounded-md px-4 py-3 text-sm ${styles[type]}`}>
      <Icon name={iconNames[type]} size={16} className="mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}
