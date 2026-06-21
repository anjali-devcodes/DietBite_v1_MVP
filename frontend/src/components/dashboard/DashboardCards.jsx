/**
 * Clickable summary card for the dashboard's main feature grid.
 * - Pass `value` for a live count/number (e.g. patient total, food count).
 * - Omit `value` for a "tool" card that links to a feature without a count (e.g. Calculator).
 */
export function StatCard({ icon, label, value, sublabel, color = 'text-green-600 bg-green-50', onClick, loading }) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 transition-all duration-150 hover:border-green-300 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        {value !== undefined ? (
          <>
            <p className="text-2xl font-bold text-gray-800 leading-tight">
              {loading ? <span className="inline-block w-10 h-6 bg-gray-100 rounded animate-pulse" /> : value}
            </p>
            <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
          </>
        ) : (
          <p className="text-sm font-semibold text-gray-800">{label}</p>
        )}
        {sublabel && <p className="text-xs text-gray-400 mt-0.5 truncate">{sublabel}</p>}
      </div>
    </button>
  )
}

/**
 * Small actionable tile for the Quick Actions row.
 */
export function QuickAction({ icon, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-left transition-all duration-150 hover:border-green-300 hover:bg-green-50/50 hover:shadow-sm"
    >
      <span className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-lg shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        {description && <span className="block text-xs text-gray-400 mt-0.5 truncate">{description}</span>}
      </span>
    </button>
  )
}
