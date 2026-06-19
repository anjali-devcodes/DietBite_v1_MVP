import { useState, useEffect, useCallback } from 'react'
import { foodService } from '../../api/foodService'
import { useDebounce } from '../../hooks/useDebounce'

export function FoodPicker({ onAdd }) {
  const [searchTerm, setSearchTerm] = useState('')
  const debounced = useDebounce(searchTerm, 350)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(100)

  const runSearch = useCallback(async () => {
    if (!debounced.trim()) {
      setResults([])
      return
    }
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
    onAdd(selectedFood, quantity)
    setSelectedFood(null)
    setSearchTerm('')
    setQuantity(100)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search a food to add — e.g. 'rice', 'paneer'..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setSelectedFood(null)
          }}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Dropdown results */}
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {results.map((food) => (
              <button
                key={food.id}
                onClick={() => handleSelect(food)}
                className="w-full text-left px-4 py-2.5 hover:bg-green-50 transition-colors flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{food.name}</p>
                  {food.name_hindi && <p className="text-xs text-gray-400">{food.name_hindi}</p>}
                </div>
                {food.category && (
                  <span className="text-xs text-gray-400 whitespace-nowrap">{food.category.name}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-xs text-gray-400">
            Searching...
          </div>
        )}
      </div>

      {selectedFood && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{selectedFood.name}</p>
          </div>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm text-gray-500">g</span>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add
          </button>
        </div>
      )}
    </div>
  )
}