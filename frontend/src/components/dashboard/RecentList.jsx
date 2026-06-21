import { Card } from '../ui/Card'

/**
 * Generic "recent activity" panel. Pass `items` + `renderItem` to control row markup,
 * so the same shell works for "Recently Added Patients", "Recently Joined Users", etc.
 */
export function RecentList({
  title,
  items = [],
  loading,
  emptyIcon = '🗒️',
  emptyMessage = 'Nothing here yet.',
  viewAllLabel = 'View all →',
  onViewAll,
  renderItem,
}) {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-medium text-green-600 hover:text-green-700">
            {viewAllLabel}
          </button>
        )}
      </div>

      <div className="px-2 py-2">
        {loading ? (
          <div className="flex flex-col gap-2 px-4 py-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-2xl mb-1">{emptyIcon}</p>
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {items.map((item, i) => renderItem(item, i))}
          </div>
        )}
      </div>
    </Card>
  )
}
