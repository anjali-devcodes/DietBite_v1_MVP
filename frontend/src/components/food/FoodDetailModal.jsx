import { useEffect, useState } from 'react'
import { foodService } from '../../api/foodService'

const NUTRIENT_LABELS = {
  energy_kcal: { label: 'Energy', icon: '🔥' },
  protein_g: { label: 'Protein', icon: '💪' },
  fat_g: { label: 'Fat', icon: '🥑' },
  carb_g: { label: 'Carbohydrates', icon: '🍚' },
  fiber_g: { label: 'Fiber', icon: '🌾' },
  calcium_mg: { label: 'Calcium', icon: '🦴' },
  iron_mg: { label: 'Iron', icon: '⚙️' },
  sodium_mg: { label: 'Sodium', icon: '🧂' },
  potassium_mg: { label: 'Potassium', icon: '🍌' },
  vit_c_mg: { label: 'Vitamin C', icon: '🍊' },
  vit_a_mcg: { label: 'Vitamin A', icon: '👁️' },
  folate_mcg: { label: 'Folate', icon: '🌿' },
  zinc_mg: { label: 'Zinc', icon: '🔩' },
}

const MACROS = ['energy_kcal', 'protein_g', 'fat_g', 'carb_g', 'fiber_g']

export function FoodDetailModal({ foodId, onClose }) {
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!foodId) return
    setLoading(true)
    setError('')
    foodService.getFoodById(foodId)
      .then(({ data }) => setFood(data))
      .catch(() => setError('Failed to load food details.'))
      .finally(() => setLoading(false))
  }, [foodId])

  if (!foodId) return null

  const nutrientMap = food
    ? Object.fromEntries(food.nutrients.map((n) => [n.nutrient_name, n]))
    : {}

  const macros = MACROS.filter((key) => nutrientMap[key])
  const micros = Object.keys(NUTRIENT_LABELS).filter(
    (key) => !MACROS.includes(key) && nutrientMap[key]
  )

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading nutrition data...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 text-sm">{error}</div>
        ) : food ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{food.name}</h2>
                {food.name_hindi && <p className="text-sm text-gray-400">{food.name_hindi}</p>}
                <div className="flex items-center gap-2 mt-2">
                  {food.category && (
                    <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md">
                      {food.category.name}
                    </span>
                  )}
                  {food.region && <span className="text-xs text-gray-400">📍 {food.region}</span>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-6">
              <p className="text-xs text-gray-400">
                Nutrition values per {food.serving_size_g}{food.serving_unit}
              </p>

              {/* Macros */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Macronutrients
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {macros.map((key) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <span className="text-lg">{NUTRIENT_LABELS[key].icon}</span>
                      <div>
                        <p className="text-xs text-gray-400">{NUTRIENT_LABELS[key].label}</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {nutrientMap[key].value}{nutrientMap[key].unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micros */}
              {micros.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Vitamins & Minerals
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {micros.map((key) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                        <span className="text-lg">{NUTRIENT_LABELS[key].icon}</span>
                        <div>
                          <p className="text-xs text-gray-400">{NUTRIENT_LABELS[key].label}</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {nutrientMap[key].value}{nutrientMap[key].unit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}