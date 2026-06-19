import { useState } from 'react'
import { MEAL_SLOTS, MEAL_SLOT_MAP } from '../../constants/mealSlots'
import { AddMealItem } from './AddMealItem'

export function DayCard({ day, onAddItem, onRemoveItem, onRemoveDay }) {
  const [adding, setAdding] = useState(false)

  // Group items by meal slot, preserving the canonical slot order
  const grouped = MEAL_SLOTS.map((slot) => ({
    slot,
    items: day.items.filter((i) => i.meal_slot === slot.value),
  })).filter((g) => g.items.length > 0 || adding)

  const energyTotal = day.totals?.energy_kcal?.value ?? 0

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-800">{day.label || `Day ${day.day_number}`}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{Math.round(energyTotal)} kcal total</p>
        </div>
        <button onClick={() => onRemoveDay(day.id)} className="text-xs text-red-400 hover:text-red-600">
          Remove Day
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {MEAL_SLOTS.map((slot) => {
          const items = day.items.filter((i) => i.meal_slot === slot.value)
          return (
            <div key={slot.value}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {slot.icon} {slot.label}
              </p>
              {items.length === 0 ? (
                <p className="text-xs text-gray-300 italic mb-2">No items added</p>
              ) : (
                <div className="flex flex-col gap-1.5 mb-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm text-gray-800">{item.food_name}</p>
                        <p className="text-xs text-gray-400">
                          {item.quantity_g}g · {item.nutrients?.energy_kcal?.value ?? '—'} kcal
                        </p>
                      </div>
                      <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-600 text-sm px-2">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {adding ? (
          <AddMealItem
            onAdd={(itemData) => { onAddItem(day.id, itemData); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="text-sm text-green-600 hover:text-green-700 font-medium text-left"
          >
            + Add food to this day
          </button>
        )}
      </div>
    </div>
  )
}