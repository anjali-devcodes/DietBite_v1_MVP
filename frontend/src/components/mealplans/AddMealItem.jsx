import { useState, useEffect, useCallback } from 'react'
import { foodService } from '../../api/foodService'
import { useDebounce } from '../../hooks/useDebounce'
import { MEAL_SLOTS } from '../../constants/mealSlots'

export function AddMealItem({ onAdd, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('')
  const debounced = useDebounce(searchTerm, 350)
  const [results, setResults] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(100)
  const [mealSlot, setMealSlot] = useState('breakfast')
  const [loading, setLoading] = useState(false)

  const runSearch = useCallback(async () => {
    if (!debounced.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const { data } = await foodService.search({ q: debounced, limit: 8 })
      setResults(data.foods)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [debounced])

  useEffect(() => { runSearch() }, [runSearch])

  const handleSelect = (food) => {
    setSelectedFood(food)
    setSearchTerm(food.name)
    setResults([])
  }

  const handleAdd = () => {
    if (!selectedFood || quantity <= 0) return
    onAdd({ food_id: selectedFood.id, food_name: selectedFood.name, meal_slot: mealSlot, quantity_g: quantity })
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col gap-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search food to add..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setSelectedFood(null) }}
          autoFocus
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
            {results.map((food) => (
              <button
                key={food.id}
                onClick={() => handleSelect(food)}
                className="w-full text-left px-3 py-2 hover:bg-green-50 transition-colors text-sm"
              >
                {food.name}
                {food.name_hindi && <span className="text-xs text-gray-400 ml-2">{food.name_hindi}</span>}
              </button>
            ))}
          </div>
        )}
        {loading && <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg px-3 py-2 text-xs text-gray-400">Searching...</div>}
      </div>

      {selectedFood && (
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={mealSlot}
            onChange={(e) => setMealSlot(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-green-500"
          >
            {MEAL_SLOTS.map((s) => (
              <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm text-gray-500">g</span>
          <button onClick={handleAdd} className="bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-700">
            Add to Plan
          </button>
          <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 px-2">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}