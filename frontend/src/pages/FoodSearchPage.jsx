import { useState, useEffect, useCallback } from 'react'
import { foodService } from '../api/foodService'
import { useDebounce } from '../hooks/useDebounce'
import { AppLayout } from '../components/Layout/AppLayout'
import { FoodCard } from '../components/food/FoodCard'
import { FoodFilters } from '../components/food/FoodFilters'
import { FoodDetailModal } from '../components/food/FoodDetailModal'
import { Alert } from '../components/ui/Alert'

export default function FoodSearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 400)

  const [filters, setFilters] = useState({ category: '', food_type: '', region: '' })
  const [categories, setCategories] = useState([])

  const [foods, setFoods] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedFoodId, setSelectedFoodId] = useState(null)

  // Load categories once
  useEffect(() => {
    foodService.getCategories().then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  // Search whenever debounced term or filters change
  const runSearch = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await foodService.search({
        q: debouncedSearch,
        category: filters.category,
        food_type: filters.food_type,
        region: filters.region,
        limit: 30,
      })
      setFoods(data.foods)
      setTotal(data.total)
    } catch {
      setError('Failed to load foods. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filters])

  useEffect(() => { runSearch() }, [runSearch])

  const clearFilters = () => setFilters({ category: '', food_type: '', region: '' })

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">Food Search</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Browse Indian foods with verified nutrient data (IFCT-based)
          </p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name — try 'dal', 'chawal', or 'palak'..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
        </div>

        {/* Filters */}
        <FoodFilters filters={filters} categories={categories} onChange={setFilters} onClear={clearFilters} />

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {loading ? 'Searching...' : `${total} food${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <Alert type="error" message={error} />

        {/* Results grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm">No foods match your search. Try different keywords or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} onClick={(f) => setSelectedFoodId(f.id)} />
            ))}
          </div>
        )}
      </div>

      <FoodDetailModal foodId={selectedFoodId} onClose={() => setSelectedFoodId(null)} />
    </AppLayout>
  )
}