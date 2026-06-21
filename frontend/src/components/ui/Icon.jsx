// Lightweight, dependency-free icon set.
// All icons share the same stroke weight, cap, and 24x24 viewBox so they
// read as one consistent family instead of mixed emoji.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, size = 18, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      {...base}
    >
      {children}
    </svg>
  )
}

export const icons = {
  dashboard: (p) => (
    <Svg {...p}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Svg>
  ),
  search: (p) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.5-4.5" />
    </Svg>
  ),
  calculator: (p) => (
    <Svg {...p}>
      <rect x="4" y="2.5" width="16" height="19" rx="2" />
      <path d="M8 7h8M8 12h2M8 16h2M14 12h2M14 16h2" />
    </Svg>
  ),
  users: (p) => (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M16 8.2a3 3 0 110 5.8" />
      <path d="M19 14.6c1.8.5 3 2.1 3 4.4" />
    </Svg>
  ),
  user: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
    </Svg>
  ),
  logout: (p) => (
    <Svg {...p}>
      <path d="M9 4.5H6a2 2 0 00-2 2v11a2 2 0 002 2h3" />
      <path d="M14 16l5-5-5-5" />
      <path d="M19 11H9" />
    </Svg>
  ),
  menu: (p) => (
    <Svg {...p}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
    </Svg>
  ),
  chevronDown: (p) => (
    <Svg {...p}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  ),
  check: (p) => (
    <Svg {...p}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </Svg>
  ),
  alertCircle: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v6" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  ),
  info: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.7" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  ),
  plus: (p) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  x: (p) => (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  ),
}

export function Icon({ name, size = 18, className = '' }) {
  const render = icons[name]
  if (!render) return null
  return render({ size, className })
}
