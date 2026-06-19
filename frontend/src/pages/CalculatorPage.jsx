import { useState, useEffect, useCallback, useRef } from 'react'
import { foodService } from '../api/foodService'
import { AppLayout } from '../components/layout/AppLayout'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { FoodPicker } from '../components/calculator/FoodPicker'
import { MealList } from '../components/calculator/MealList'
import { NutritionTotals } from '../components/calculator/NutritionTotals'

export default function CalculatorPage() {
  const [items, setItems] = useState([])  // [{ food, quantity_g, result }]
  const [totals, setTotals] = useState({})
  const [error, setError] = useState('')
  const [calculating, setCalculating] = useState(false)

  const handleAdd = (food, quantity_g) => {
    setItems((prev) => [...prev, { food, quantity_g, result: null }])
  }

  const handleRemove = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpdateQuantity = (idx, quantity_g) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, quantity_g } : item)))
  }

  const handleClear = () => {
    setItems([])
    setTotals({})
  }

  // Recalculate whenever items change
  const runCalculation = useCallback(async () => {
    if (items.length === 0) {
      setTotals({})
      return
    }
    setCalculating(true)
    setError('')
    try {
      const { data } = await foodService.calculate(
        items.map((item) => ({ food_id: item.food.id, quantity_g: item.quantity_g }))
      )
      setTotals(data.totals)
      // Attach per-item results back for display in MealList
      setItems((prev) =>
        prev.map((item, idx) => ({ ...item, result: data.items[idx] }))
      )
    } catch {
      setError('Failed to calculate nutrition. Please try again.')
    } finally {
      setCalculating(false)
    }
  }, [items.map((i) => `${i.food.id}:${i.quantity_g}`).join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { runCalculation() }, [runCalculation])

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Nutrient Calculator</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Add foods to build a meal and see combined nutrition instantly
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Left: Picker + Meal list */}
          <div className="col-span-3 flex flex-col gap-4">
            <Card>
              <CardHeader title="Add Foods" subtitle="Search and add items with quantity" />
              <CardBody>
                <FoodPicker onAdd={handleAdd} />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Your Meal" subtitle={`${items.length} item${items.length !== 1 ? 's' : ''} added`} />
              <CardBody>
                <MealList items={items} onRemove={handleRemove} onUpdateQuantity={handleUpdateQuantity} />
                {items.length > 0 && (
                  <div className="flex justify-end mt-3">
                    <Button variant="secondary" onClick={handleClear}>Clear Meal</Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right: Totals */}
          <div className="col-span-2">
            <Card className="sticky top-6">
              <CardHeader title="Nutrition Summary" subtitle={calculating ? 'Calculating...' : 'Combined totals'} />
              <CardBody>
                <Alert type="error" message={error} />
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Totals will appear here once you add foods.
                  </p>
                ) : (
                  <NutritionTotals totals={totals} />
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}