export function MealList({ items, onRemove, onUpdateQuantity }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-2xl mb-1">🍽️</p>
        <p className="text-sm">No foods added yet. Search above to build your meal.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => (
        <div
          key={`${item.food.id}-${idx}`}
          className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-4 py-3"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{item.food.name}</p>
            <p className="text-xs text-gray-400">
              {item.result?.nutrients?.energy_kcal?.value ?? '—'} kcal
            </p>
          </div>

          <input
            type="number"
            min="1"
            value={item.quantity_g}
            onChange={(e) => onUpdateQuantity(idx, Number(e.target.value))}
            className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-xs text-gray-400 w-4">g</span>

          <button
            onClick={() => onRemove(idx)}
            className="text-red-400 hover:text-red-600 text-sm px-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}