const TYPE_COLORS = {
  raw: 'bg-green-50 text-green-600',
  cooked: 'bg-orange-50 text-orange-600',
  processed: 'bg-blue-50 text-blue-600',
  beverage: 'bg-cyan-50 text-cyan-600',
  recipe: 'bg-purple-50 text-purple-600',
}

const ENERGY = (food) => {
  // We don't have nutrients in summary view, this is a placeholder slot
  return null
}

export function FoodCard({ food, onClick }) {
  return (
    <button
      onClick={() => onClick(food)}
      className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all duration-150 flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug">{food.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${TYPE_COLORS[food.food_type]}`}>
          {food.food_type}
        </span>
      </div>

      {food.name_hindi && (
        <p className="text-xs text-gray-400">{food.name_hindi}</p>
      )}

      <div className="flex items-center gap-2 mt-1">
        {food.category && (
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            {food.category.name}
          </span>
        )}
        {food.region && (
          <span className="text-xs text-gray-400">📍 {food.region}</span>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-1">
        Per {food.serving_size_g}{food.serving_unit} — tap for full nutrition
      </p>
    </button>
  )
}