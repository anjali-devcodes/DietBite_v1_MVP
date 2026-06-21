export function Table({ children, className = '' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-surface-200">
      <table className={`w-full text-sm text-left border-collapse ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function THead({ children }) {
  return (
    <thead className="bg-surface-50 border-b border-surface-200">
      <tr>{children}</tr>
    </thead>
  )
}

export function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 font-medium text-surface-500 text-xs uppercase tracking-wide ${className}`}>
      {children}
    </th>
  )
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-surface-100">{children}</tbody>
}

export function Tr({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={`${onClick ? 'cursor-pointer hover:bg-surface-50' : ''} transition-colors ${className}`}
    >
      {children}
    </tr>
  )
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-surface-700 ${className}`}>{children}</td>
}
