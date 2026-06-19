import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { mealPlanService } from '../../api/mealPlanService'
import { Card, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'

export function MealPlanList({ patientId }) {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', num_days: 3, notes: '' })
  const [creating, setCreating] = useState(false)

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await mealPlanService.listByPatient(patientId)
      setPlans(data.plans)
    } catch {
      setError('Failed to load meal plans.')
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const { data } = await mealPlanService.create({
        patient_id: patientId,
        title: form.title,
        num_days: Number(form.num_days),
        notes: form.notes || null,
      })
      setShowCreate(false)
      setForm({ title: '', num_days: 3, notes: '' })
      navigate(`/meal-plans/${data.id}`)
    } catch {
      setError('Failed to create meal plan.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Meal Plans</h2>
          <p className="text-sm text-gray-400 mt-0.5">Structured diet plans for this patient</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ New Plan</Button>
      </div>

      <CardBody>
        <Alert type="error" message={error} />

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-6">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No meal plans yet. Click "New Plan" to create one.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => navigate(`/meal-plans/${plan.id}`)}
                className="text-left bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-lg px-4 py-3 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{plan.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {plan.day_count} day{plan.day_count !== 1 ? 's' : ''}
                    {plan.start_date && ` · from ${new Date(plan.start_date).toLocaleDateString('en-IN')}`}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${plan.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {plan.is_active ? 'Active' : 'Archived'}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardBody>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">New Meal Plan</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Plan Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Week 1 - Diabetic Diet Plan"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={form.num_days}
                  onChange={(e) => setForm({ ...form, num_days: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit" loading={creating}>Create & Open</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  )
}