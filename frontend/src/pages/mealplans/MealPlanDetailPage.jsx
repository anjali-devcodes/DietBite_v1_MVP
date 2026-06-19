import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mealPlanService } from '../../api/mealPlanService'
import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { DayCard } from '../../components/mealplans/DayCard'
import { DayTotalsSummary } from '../../components/mealplans/DayTotalsSummary'

export default function MealPlanDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPlan = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await mealPlanService.getById(id)
      setPlan(data)
    } catch {
      setError('Failed to load meal plan.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchPlan() }, [fetchPlan])

  const handleAddItem = async (dayId, itemData) => {
    try {
      await mealPlanService.addItem(dayId, itemData)
      fetchPlan()
    } catch {
      setError('Failed to add food item.')
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await mealPlanService.removeItem(itemId)
      fetchPlan()
    } catch {
      setError('Failed to remove item.')
    }
  }

  const handleAddDay = async () => {
    const nextDayNumber = (plan.days[plan.days.length - 1]?.day_number ?? 0) + 1
    try {
      const { data } = await mealPlanService.addDay(id, { day_number: nextDayNumber, label: `Day ${nextDayNumber}` })
      setPlan(data)
    } catch {
      setError('Failed to add day.')
    }
  }

  const handleRemoveDay = async (dayId) => {
    if (!window.confirm('Remove this entire day and all its items?')) return
    try {
      await mealPlanService.removeDay(dayId)
      fetchPlan()
    } catch {
      setError('Failed to remove day.')
    }
  }

  const handleDeletePlan = async () => {
    if (!window.confirm(`Delete "${plan.title}"? This cannot be undone.`)) return
    await mealPlanService.remove(id)
    navigate(-1)
  }

  if (loading) return <AppLayout><p className="text-sm text-gray-400 text-center py-12">Loading meal plan...</p></AppLayout>
  if (error && !plan) return <AppLayout><Alert type="error" message={error} /></AppLayout>
  if (!plan) return null

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600">
            ← Back
          </button>
          <Button variant="danger" onClick={handleDeletePlan}>Delete Plan</Button>
        </div>

        <Card>
          <CardBody>
            <h1 className="text-xl font-bold text-gray-800">{plan.title}</h1>
            {plan.notes && <p className="text-sm text-gray-400 mt-1">{plan.notes}</p>}
            <p className="text-xs text-gray-400 mt-2">{plan.days.length} day{plan.days.length !== 1 ? 's' : ''} in this plan</p>
          </CardBody>
        </Card>

        <Alert type="error" message={error} />

        {/* Days */}
        <div className="flex flex-col gap-5">
          {plan.days.map((day) => (
            <div key={day.id} className="flex flex-col gap-3">
              <DayCard
                day={day}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onRemoveDay={handleRemoveDay}
              />
              <div className="px-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Day Totals</p>
                <DayTotalsSummary totals={day.totals} />
              </div>
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={handleAddDay} className="self-start">
          + Add Another Day
        </Button>
      </div>
    </AppLayout>
  )
}